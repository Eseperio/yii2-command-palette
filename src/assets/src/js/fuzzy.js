/**
 * Fuzzy search algorithms for the command palette
 */

/**
 * Returns the minimum Levenshtein distance between the query and any substring of 'text'
 * @param {string} query - The search query
 * @param {string} text - The text to search in
 * @returns {number} - The minimum Levenshtein distance
 */
export function fuzzyMinLevenshtein(query, text) {
    if (!query || !text) return Infinity;
    let minDist = Infinity;
    
    // Search in all substrings of the same length as the query
    for (let i = 0; i <= text.length - query.length; i++) {
        const substr = text.substr(i, query.length);
        minDist = Math.min(minDist, levenshtein(query, substr));
    }
    
    // Also compare with the full text (in case the query is longer than the text)
    minDist = Math.min(minDist, levenshtein(query, text));
    
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

    return items
        .map(item => {
            const name = item.name.toLowerCase();
            const subtitle = item.subtitle ? item.subtitle.toLowerCase() : '';
            const distName = fuzzyMinLevenshtein(query, name);
            const distSubtitle = subtitle ? fuzzyMinLevenshtein(query, subtitle) : Infinity;
            const score = Math.min(distName, distSubtitle);

            const substringMatch = name.includes(query) || subtitle.includes(query);
            return { ...item, _score: score, _substringMatch: substringMatch };
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
