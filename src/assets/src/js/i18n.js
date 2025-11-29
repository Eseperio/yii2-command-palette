/**
 * Internationalization for the command palette
 * Contains translations for the 10 most common languages
 */

const translations = {
    // English
    'en': {
        'search': 'Search...',
        'noResults': 'No results',
        'searchIn': 'Search "{query}" in {type}',
        'pressEnterToSearch': 'Press Enter to search in this category',
        'loading': 'Loading...',
        'searchError': 'Search Error',
        'searchFailed': 'Search failed'
    },
    // Spanish
    'es': {
        'search': 'Buscar...',
        'noResults': 'Sin resultados',
        'searchIn': 'Buscar "{query}" en {type}',
        'pressEnterToSearch': 'Presiona Enter para buscar en esta categoría',
        'loading': 'Cargando...',
        'searchError': 'Error de búsqueda',
        'searchFailed': 'Error en la búsqueda'
    },
    // French
    'fr': {
        'search': 'Rechercher...',
        'noResults': 'Aucun résultat',
        'searchIn': 'Rechercher "{query}" dans {type}',
        'pressEnterToSearch': 'Appuyez sur Entrée pour rechercher dans cette catégorie',
        'loading': 'Chargement...',
        'searchError': 'Erreur de recherche',
        'searchFailed': 'Échec de la recherche'
    },
    // German
    'de': {
        'search': 'Suchen...',
        'noResults': 'Keine Ergebnisse',
        'searchIn': '"{query}" in {type} suchen',
        'pressEnterToSearch': 'Drücken Sie Enter, um in dieser Kategorie zu suchen',
        'loading': 'Laden...',
        'searchError': 'Suchfehler',
        'searchFailed': 'Suche fehlgeschlagen'
    },
    // Italian
    'it': {
        'search': 'Cerca...',
        'noResults': 'Nessun risultato',
        'searchIn': 'Cerca "{query}" in {type}',
        'pressEnterToSearch': 'Premi Invio per cercare in questa categoria',
        'loading': 'Caricamento...',
        'searchError': 'Errore di ricerca',
        'searchFailed': 'Ricerca fallita'
    },
    // Portuguese
    'pt': {
        'search': 'Pesquisar...',
        'noResults': 'Sem resultados',
        'searchIn': 'Pesquisar "{query}" em {type}',
        'pressEnterToSearch': 'Pressione Enter para pesquisar nesta categoria',
        'loading': 'Carregando...',
        'searchError': 'Erro de pesquisa',
        'searchFailed': 'Falha na pesquisa'
    },
    // Russian
    'ru': {
        'search': 'Поиск...',
        'noResults': 'Нет результатов',
        'searchIn': 'Искать "{query}" в {type}',
        'pressEnterToSearch': 'Нажмите Enter для поиска в этой категории',
        'loading': 'Загрузка...',
        'searchError': 'Ошибка поиска',
        'searchFailed': 'Поиск не удался'
    },
    // Chinese (Simplified)
    'zh': {
        'search': '搜索...',
        'noResults': '没有结果',
        'searchIn': '在{type}中搜索"{query}"',
        'pressEnterToSearch': '按回车键在此类别中搜索',
        'loading': '加载中...',
        'searchError': '搜索错误',
        'searchFailed': '搜索失败'
    },
    // Japanese
    'ja': {
        'search': '検索...',
        'noResults': '結果なし',
        'searchIn': '{type}で「{query}」を検索',
        'pressEnterToSearch': 'Enterキーを押してこのカテゴリで検索',
        'loading': '読み込み中...',
        'searchError': '検索エラー',
        'searchFailed': '検索に失敗しました'
    },
    // Arabic
    'ar': {
        'search': 'بحث...',
        'noResults': 'لا نتائج',
        'searchIn': 'ابحث عن "{query}" في {type}',
        'pressEnterToSearch': 'اضغط Enter للبحث في هذه الفئة',
        'loading': 'جاري التحميل...',
        'searchError': 'خطأ في البحث',
        'searchFailed': 'فشل البحث'
    }
};

/**
 * Escape HTML entities in a string to prevent XSS
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHtml(str) {
    if (typeof str !== 'string') {
        return String(str);
    }
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Get a translation for a key in the specified locale
 * @param {string} key - The translation key
 * @param {string} locale - The locale code
 * @param {Object} params - Optional parameters to replace in the translation (e.g., {query: 'test', type: 'users'})
 * @returns {string} - The translated string or the key if no translation is found
 */
export function getTranslation(key, locale = 'en', params = {}) {
    // If the locale doesn't exist, fall back to English
    if (!translations[locale]) {
        locale = 'en';
    }
    
    // If the key doesn't exist, return the key itself
    let translation = translations[locale][key] || key;
    
    // Replace parameters in the translation string using a single replace call with callback
    translation = translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        if (Object.prototype.hasOwnProperty.call(params, paramKey)) {
            return escapeHtml(params[paramKey]);
        }
        return match; // Keep the placeholder if no value provided
    });
    
    return translation;
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
