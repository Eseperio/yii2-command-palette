/**
 * Fuzzy search algorithms for the command palette
 */

/**
 * Maximum allowed difference (in characters) between the query length and the
 * length of the candidate word/text being compared. This prevents short queries
 * from fuzzy-matching substrings of much longer words (e.g. "caja" should not
 * match a substring of "catalog" just because that substring is close enough).
 */
export const MAX_FUZZY_LENGTH_DIFF = 2;

/**
 * Cache of tokenized text (split into words), keyed by the original text string.
 * Avoids re-splitting the same item name/subtitle on every keystroke, since
 * fuzzyMinLevenshtein is called for every item on every search input change.
 * The cache is bounded to avoid unbounded memory growth when searching through
 * many distinct/dynamically loaded texts (e.g. external search results).
 */
const tokenCache = new Map();
const TOKEN_CACHE_MAX_SIZE = 500;

/**
 * Splits text into whitespace-separated tokens, memoizing the result per text value.
 * @param {string} text - The text to tokenize
 * @returns {Array<string>} - The non-empty tokens found in the text
 */
function getTokens(text) {
    let tokens = tokenCache.get(text);
    if (!tokens) {
        if (tokenCache.size >= TOKEN_CACHE_MAX_SIZE) {
            tokenCache.clear();
        }
        tokens = text.split(/\s+/).filter(Boolean);
        tokenCache.set(text, tokens);
    }
    return tokens;
}

/**
 * Returns the minimum Levenshtein distance between the query and 'text', comparing
 * the query against the full text and against each individual word/token in it.
 * A length-aware constraint is enforced: a candidate is only considered if its
 * length does not differ from the query length by more than MAX_FUZZY_LENGTH_DIFF
 * characters, avoiding false positives on much longer/shorter words.
 *
 * Note: previously this compared the query against every arbitrary substring of
 * 'text' with the same length as the query, which allowed a short/typo'd query to
 * match a substring crossing word boundaries anywhere inside a much longer word or
 * phrase (e.g. a 4-letter query matching a 4-character slice of a 7-letter word).
 * That behavior is intentionally replaced by whole-text/whole-token comparisons
 * bound by MAX_FUZZY_LENGTH_DIFF, trading a small amount of multi-word typo recall
 * (e.g. a heavily typo'd two-word query no longer matching a much longer phrase)
 * for correctness on short queries.
 * @param {string} query - The search query
 * @param {string} text - The text to search in
 * @returns {number} - The minimum Levenshtein distance
 */
export function fuzzyMinLevenshtein(query, text) {
    if (!query || !text) return Infinity;
    let minDist = Infinity;

    // Compare against the full text, if the lengths are close enough. This mainly matters
    // for single-word texts (where it is equivalent to the token comparison below); for
    // multi-word text the length constraint makes an accidental match very unlikely, since
    // a genuinely different multi-word phrase would need to happen to have a length within
    // MAX_FUZZY_LENGTH_DIFF characters of the query AND a low edit distance to it.
    if (Math.abs(text.length - query.length) <= MAX_FUZZY_LENGTH_DIFF) {
        minDist = Math.min(minDist, levenshtein(query, text));
    }

    // Compare against each individual word/token, respecting the same length constraint.
    // This allows matching a single word within a longer phrase without letting the
    // query fuzzy-match an arbitrary substring of a much longer word.
    const tokens = getTokens(text);
    for (const token of tokens) {
        if (Math.abs(token.length - query.length) > MAX_FUZZY_LENGTH_DIFF) {
            continue;
        }
        minDist = Math.min(minDist, levenshtein(query, token));
    }

    return minDist;
}

/**
 * Standard Levenshtein algorithm
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - The Levenshtein distance
 */
export function levenshtein(a, b) {
    const m = a.length, n = b.length;

    if (m === 0) return n;
    if (n === 0) return m;

    const dp = [];
    for (let i = 0; i <= m; i++) dp[i] = [i];
    for (let j = 1; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[m][n];
}

/**
 * Filter items based on a search query using fuzzy search
 * @param {string} query - The search query
 * @param {Array} items - The items to filter
 * @returns {Array} - The filtered items
 */
export function filterItems(query, items) {
    if (!query) return items.slice();

    query = query.trim().toLowerCase();

    // Solo coincidencias completas (substring) si <= 3 caracteres
    let exactMatches =  items.filter(item => {
        const name = item.name.toLowerCase();
        const subtitle = item.subtitle ? item.subtitle.toLowerCase() : '';
        return name.includes(query) || subtitle.includes(query);
    });

    if(exactMatches.length > 0) {
        // Si hay coincidencias exactas y la consulta es corta, devolver solo esas
        return exactMatches;
    }

    // Búsqueda difusa si > 3 caracteres
    return items
        .map(item => {
            const name = item.name.toLowerCase();
            const subtitle = item.subtitle ? item.subtitle.toLowerCase() : '';
            const distName = fuzzyMinLevenshtein(query, name);
            const distSubtitle = subtitle ? fuzzyMinLevenshtein(query, subtitle) : Infinity;
            const score = Math.min(distName, distSubtitle);

            const substringMatch = name.includes(query) || subtitle.includes(query);
            return {...item, _score: score, _substringMatch: substringMatch};
        })
        .sort((a, b) => {
            if (a._substringMatch && !b._substringMatch) return -1;
            if (!a._substringMatch && b._substringMatch) return 1;
            return a._score - b._score;
        })
        .filter(item =>
            item._substringMatch ||
            item._score <= 2
        );
}
