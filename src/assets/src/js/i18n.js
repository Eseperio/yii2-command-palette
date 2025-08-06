/**
 * Internationalization for the command palette
 * Contains translations for the 10 most common languages
 */

const translations = {
    // English
    'en': {
        'search': 'Search...',
        'noResults': 'No results'
    },
    // Spanish
    'es': {
        'search': 'Buscar...',
        'noResults': 'Sin resultados'
    },
    // French
    'fr': {
        'search': 'Rechercher...',
        'noResults': 'Aucun résultat'
    },
    // German
    'de': {
        'search': 'Suchen...',
        'noResults': 'Keine Ergebnisse'
    },
    // Italian
    'it': {
        'search': 'Cerca...',
        'noResults': 'Nessun risultato'
    },
    // Portuguese
    'pt': {
        'search': 'Pesquisar...',
        'noResults': 'Sem resultados'
    },
    // Russian
    'ru': {
        'search': 'Поиск...',
        'noResults': 'Нет результатов'
    },
    // Chinese (Simplified)
    'zh': {
        'search': '搜索...',
        'noResults': '没有结果'
    },
    // Japanese
    'ja': {
        'search': '検索...',
        'noResults': '結果なし'
    },
    // Arabic
    'ar': {
        'search': 'بحث...',
        'noResults': 'لا نتائج'
    }
};

/**
 * Get a translation for a key in the specified locale
 * @param {string} key - The translation key
 * @param {string} locale - The locale code
 * @returns {string} - The translated string or the key if no translation is found
 */
export function getTranslation(key, locale = 'en') {
    // If the locale doesn't exist, fall back to English
    if (!translations[locale]) {
        locale = 'en';
    }
    
    // If the key doesn't exist, return the key itself
    return translations[locale][key] || key;
}

/**
 * Get all translations for a locale
 * @param {string} locale - The locale code
 * @returns {Object} - The translations object for the locale
 */
export function getTranslations(locale = 'en') {
    // If the locale doesn't exist, fall back to English
    return translations[locale] || translations['en'];
}

export default {
    getTranslation,
    getTranslations
};
