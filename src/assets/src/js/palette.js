/**
 * Main palette logic for the command palette
 */

import { filterItems } from './fuzzy.js';
import { renderList, scrollToSelected, executeItemAction, setupEventListeners } from './dom.js';
import { getTranslation, getTranslations } from './i18n.js';
import Logger from './logger.js';
import { scrapeLinks } from './linkScraper.js';
import ExternalSearch from './external-search.js';

// Import SCSS for Vite to process
import '../scss/palette.scss';

/**
 * Command Palette class
 */
class CommandPalette {
    /**
     * Constructor
     * @param {string} id - The ID of the command palette
     * @param {Array} items - The items to display in the command palette
     * @param {Object} settings - Configuration object
     * @param {string} settings.locale - The locale for translations (default: 'en')
     * @param {boolean} settings.debug - Whether debug mode is enabled (default: false)
     * @param {boolean} settings.enableLinksScraper - Whether to enable links scraper (default: false)
     * @param {Array} settings.linkScraperExcludeSelectors - CSS selectors to exclude from link scraping (default: [])
     * @param {number} settings.maxRecentItems - Maximum number of recent items to keep (0 to disable) (default: 0)
     * @param {Object|null} settings.externalSearch - External search configuration (default: null)
     */
    constructor(id, items = [], settings = {}) {
        this.id = id;

        // Destructure settings with defaults
        const {
            locale = 'en',
            debug = false,
            enableLinksScraper = false,
            linkScraperExcludeSelectors = [],
            maxRecentItems = 0,
            externalSearch = null
        } = settings;

        this.enableLinksScraper = enableLinksScraper;
        this.linkScraperExcludeSelectors = linkScraperExcludeSelectors;

        // Initialize logger first
        this.logger = new Logger(debug);

        // Scrape links if enabled
        if (this.enableLinksScraper) {
            const scrapedLinks = scrapeLinks(items, this.linkScraperExcludeSelectors, this.logger);
            this.items = [...items, ...scrapedLinks];
        } else {
            this.items = items;
        }

        this.filtered = [...this.items];
        this.selectedIdx = 0;
        this.isOpen = false;
        this.locale = locale;
        this.debug = debug;
        this.maxRecentItems = maxRecentItems;

        // Track Ctrl/Cmd key state for new tab shortcuts
        this.ctrlKeyPressed = false;
        
        // External search
        this.externalSearch = externalSearch ? new ExternalSearch(externalSearch, debug) : null;
        this.externalResults = [];
        this.searchMode = null; // null or { type: 'typename', query: 'search terms' }
        
        this.logger.log('Initializing command palette with', this.items.length, 'items');
        this.logger.log('Recent items:', maxRecentItems > 0 ? `enabled (max: ${maxRecentItems})` : 'disabled');
        if (this.externalSearch) {
            this.logger.log('External search enabled for types:', externalSearch.types);
        }
        
        // Get DOM elements
        this.elements = {
            overlay: document.getElementById(`cmdkOverlay-${id}`),
            panel: document.getElementById(`cmdkPanel-${id}`),
            searchContainer: document.getElementById(`cmdkSearchContainer-${id}`),
            search: document.getElementById(`cmdkSearch-${id}`),
            list: document.getElementById(`cmdkList-${id}`)
        };
        
        // Set placeholder text based on locale
        if (this.elements.search) {
            this.elements.search.placeholder = getTranslation('search', this.locale);
        }
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the command palette
     * @returns {void}
     */
    init() {
        // Set up event listeners
        setupEventListeners(this.elements, {
            onSearch: this.handleSearch.bind(this),
            onKeyDown: this.handleKeyDown.bind(this),
            onItemClick: this.selectItem.bind(this),
            onItemHover: this.handleItemHover.bind(this),
            onOverlayClick: this.close.bind(this),
            onPanelBlur: this.handlePanelBlur.bind(this),
            onFocusIn: this.handleFocusIn.bind(this),
            onGlobalKeyDown: this.handleGlobalKeyDown.bind(this)
        });
        
        // Track Ctrl/Cmd key state globally
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Control' || e.key === 'Meta') {
                this.ctrlKeyPressed = true;
                this.logger.log('Ctrl/Cmd key pressed');
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Control' || e.key === 'Meta') {
                this.ctrlKeyPressed = false;
                this.logger.log('Ctrl/Cmd key released');
            }
        });
        
        // Initial render
        renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
    }
    
    /**
     * Get the localStorage key for recent items
     * @returns {string} - The localStorage key
     */
    getRecentItemsKey() {
        return `cmdPalette_recentItems_${this.id}`;
    }

    /**
     * Get recent items from localStorage
     * @returns {Array} - Array of recent items
     */
    getRecentItems() {
        if (this.maxRecentItems === 0) {
            return [];
        }

        try {
            const stored = localStorage.getItem(this.getRecentItemsKey());
            if (!stored) {
                return [];
            }

            const items = JSON.parse(stored);
            this.logger.log('Retrieved', items.length, 'recent items from localStorage');
            return Array.isArray(items) ? items : [];
        } catch (e) {
            this.logger.error('Error loading recent items from localStorage:', e);
            return [];
        }
    }

    /**
     * Add an item to recent items
     * @param {Object} item - The item to add
     * @returns {void}
     */
    addRecentItem(item) {
        if (this.maxRecentItems === 0) {
            return;
        }

        try {
            let recentItems = this.getRecentItems();

            // Remove the item if it already exists (to move it to the front)
            recentItems = recentItems.filter(recentItem => {
                // Compare by name and action as a simple way to detect duplicates
                return !(recentItem.name === item.name && recentItem.action === item.action);
            });

            // Add the item to the front
            recentItems.unshift(item);

            // Limit to maxRecentItems
            if (recentItems.length > this.maxRecentItems) {
                recentItems = recentItems.slice(0, this.maxRecentItems);
            }

            // Save to localStorage
            localStorage.setItem(this.getRecentItemsKey(), JSON.stringify(recentItems));
            this.logger.log('Added item to recent items:', item.name);
        } catch (e) {
            this.logger.error('Error saving recent item to localStorage:', e);
        }
    }

    /**
     * Merge recent items with regular items, removing duplicates
     * @param {Array} recentItems - The recent items
     * @param {Array} regularItems - The regular items
     * @returns {Array} - Array with recent items first, then a separator, then regular items (no duplicates)
     */
    mergeItemsWithRecent(recentItems, regularItems) {
        if (recentItems.length === 0) {
            return regularItems;
        }

        // Filter out duplicates from regular items
        const filteredRegular = regularItems.filter(regularItem => {
            return !recentItems.some(recentItem =>
                recentItem.name === regularItem.name && recentItem.action === regularItem.action
            );
        });

        // If there are no regular items after filtering, just return recent items
        if (filteredRegular.length === 0) {
            return recentItems;
        }

        // Add a separator between recent and regular items
        const separator = {
            _isSeparator: true,
            name: '',
            action: null
        };

        return [...recentItems, separator, ...filteredRegular];
    }

    /**
     * Open the command palette
     * @returns {void}
     */
    open() {
        if (this.isOpen) return;
        
        this.logger.log('Opening command palette');
        
        this.isOpen = true;
        this.elements.overlay.style.display = 'block';
        this.elements.panel.style.display = 'flex';
        
        setTimeout(() => this.elements.search.focus(), 20);
        
        this.elements.search.value = '';

        // Merge recent items with regular items
        const recentItems = this.getRecentItems();
        this.filtered = this.mergeItemsWithRecent(recentItems, this.items);

        // Set selectedIdx to first non-separator item
        this.selectedIdx = 0;
        while (this.filtered[this.selectedIdx] && this.filtered[this.selectedIdx]._isSeparator) {
            this.selectedIdx++;
        }

        renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
    }
    
    /**
     * Close the command palette
     * @returns {void}
     */
    close() {
        this.logger.log('Closing command palette');
        this.isOpen = false;
        this.elements.overlay.style.display = 'none';
        this.elements.panel.style.display = 'none';
        
        // Clear search mode when closing
        if (this.searchMode) {
            this.exitSearchMode();
        }
    }
    
    /**
     * Handle search input
     * @param {Event} e - The input event
     * @returns {void}
     */
    handleSearch(e) {
        const query = e.target.value.trim();

        // If in search mode, perform external search
        if (this.searchMode) {
            this.performExternalSearch(query);
            return;
        }

        if (!query) {
            // If search is empty, show items with recent items merged
            const recentItems = this.getRecentItems();
            this.filtered = this.mergeItemsWithRecent(recentItems, this.items);
        } else {
            // When searching, we need to search in both recent and regular items
            // but prevent duplicates
            const recentItems = this.getRecentItems();
            const allItems = this.mergeItemsWithRecent(recentItems, this.items);

            // Filter all items (excluding separator)
            this.filtered = filterItems(query, allItems.filter(item => !item._isSeparator));
            
            // Check if query matches an external search type
            if (this.externalSearch && query) {
                const typeMatch = this.externalSearch.matchType(query);
                
                if (typeMatch) {
                    // Extract search terms (removing the type word)
                    const searchTerms = this.externalSearch.extractSearchTerms(query, typeMatch.matchedWord);
                    
                    // Add a suggestion item to trigger search mode
                    const suggestionItem = {
                        icon: '🔍',
                        name: `Search "${searchTerms || '...'}" in ${typeMatch.type}`,
                        subtitle: 'Press Enter to search in this category',
                        action: null,
                        _isSearchSuggestion: true,
                        _searchType: typeMatch.type,
                        _searchTerms: searchTerms
                    };
                    
                    // Add suggestion at the beginning
                    this.filtered = [suggestionItem, ...this.filtered];
                }
            }
        }

        // Set selectedIdx to first non-separator item
        this.selectedIdx = 0;
        while (this.filtered[this.selectedIdx] && this.filtered[this.selectedIdx]._isSeparator) {
            this.selectedIdx++;
        }

        renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
    }
    
    /**
     * Handle key down events
     * @param {KeyboardEvent} e - The keyboard event
     * @returns {void}
     */
    handleKeyDown(e) {
        // Handle backspace in search mode
        if (e.key === 'Backspace' && this.searchMode && this.elements.search.value === '') {
            e.preventDefault();
            this.exitSearchMode();
            return;
        }
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            let newIdx = (this.selectedIdx + 1) % this.filtered.length;
            // Skip separators
            while (this.filtered[newIdx] && this.filtered[newIdx]._isSeparator) {
                newIdx = (newIdx + 1) % this.filtered.length;
            }
            this.selectedIdx = newIdx;
            renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
            scrollToSelected(this.elements.list);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            let newIdx = (this.selectedIdx - 1 + this.filtered.length) % this.filtered.length;
            // Skip separators
            while (this.filtered[newIdx] && this.filtered[newIdx]._isSeparator) {
                newIdx = (newIdx - 1 + this.filtered.length) % this.filtered.length;
            }
            this.selectedIdx = newIdx;
            renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
            scrollToSelected(this.elements.list);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            this.selectItem(this.selectedIdx);
        } else if (e.key === 'Escape') {
            this.close();
        }
    }
    
    /**
     * Handle global key down events
     * @param {KeyboardEvent} e - The keyboard event
     * @returns {void}
     */
    handleGlobalKeyDown(e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            this.open();
        }
        
        if (this.isOpen && e.key === 'Escape') {
            this.close();
        }
    }
    
    /**
     * Handle panel blur events
     * @param {FocusEvent} e - The focus event
     * @returns {void}
     */
    handlePanelBlur(e) {
        // Espera brevemente antes de cerrar, para permitir que el click procese la acción
        setTimeout(() => {
            if (!this.elements.panel.contains(document.activeElement)) {
                this.close();
            }
        }, 10);
    }
    
    /**
     * Handle focus in events
     * @param {FocusEvent} e - The focus event
     * @returns {void}
     */
    handleFocusIn(e) {
        if (this.isOpen && !this.elements.panel.contains(e.target)) {
            this.close();
        }
    }
    
    /**
     * Handle item hover events
     * @param {number} idx - The index of the hovered item
     * @returns {void}
     */
    handleItemHover(idx) {
        if (idx !== this.selectedIdx) {
            this.selectedIdx = idx;
            renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
        }
    }
    
    /**
     * Select an item
     * @param {number} idx - The index of the item to select
     * @returns {void}
     */
    selectItem(idx) {
        const item = this.filtered[idx];
        if (!item || item._isSeparator) return;
        
        // Check if this is a search suggestion
        if (item._isSearchSuggestion) {
            this.enterSearchMode(item._searchType, item._searchTerms);
            return;
        }
        
        // Check if this is a loading or error item
        if (item._isLoading || item._isError) {
            return;
        }
        
        this.logger.log('Item selected:', item.name, 'Ctrl/Cmd pressed:', this.ctrlKeyPressed);

        // Add to recent items before executing action
        this.addRecentItem(item);

        executeItemAction(item, this.ctrlKeyPressed); // Pass Ctrl key state
        this.close();            // Luego cierra el panel
    }
    
    /**
     * Perform external search
     * @param {string} query - The search query
     * @returns {void}
     */
    performExternalSearch(query) {
        // Show loading state
        this.showLoadingState();
        
        // Perform debounced search
        this.externalSearch.debouncedSearch(query, this.searchMode.type, (results, error) => {
            if (error) {
                this.showErrorState(error.message || 'Search failed');
                this.logger.error('External search error:', error);
                return;
            }
            
            this.externalResults = results;
            this.filtered = results;
            this.selectedIdx = 0;
            renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
        });
    }
    
    /**
     * Show loading state with placeholder items
     * @returns {void}
     */
    showLoadingState() {
        const loadingItems = [
            { icon: '', name: 'Loading...', subtitle: '', action: null, _isLoading: true },
            { icon: '', name: 'Loading...', subtitle: '', action: null, _isLoading: true },
            { icon: '', name: 'Loading...', subtitle: '', action: null, _isLoading: true }
        ];
        this.filtered = loadingItems;
        renderList(this.elements.list, this.filtered, -1, this.locale);
    }
    
    /**
     * Show error state
     * @param {string} message - The error message
     * @returns {void}
     */
    showErrorState(message) {
        const errorItem = {
            icon: '⚠️',
            name: 'Search Error',
            subtitle: message,
            action: null,
            _isError: true
        };
        this.filtered = [errorItem];
        renderList(this.elements.list, this.filtered, -1, this.locale);
    }
    
    /**
     * Enter search mode for a specific type
     * @param {string} type - The search type
     * @param {string} initialQuery - Initial search query
     * @returns {void}
     */
    enterSearchMode(type, initialQuery = '') {
        this.searchMode = { type, query: initialQuery };
        this.logger.log('Entering search mode for type:', type);
        
        // Update search input
        this.elements.search.value = initialQuery;
        
        // Add visual indicator (tag/badge)
        this.addSearchModeTag(type);
        
        // Perform initial search if there's a query
        if (initialQuery) {
            this.performExternalSearch(initialQuery);
        } else {
            // Show empty state
            this.filtered = [];
            renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
        }
    }
    
    /**
     * Exit search mode
     * @returns {void}
     */
    exitSearchMode() {
        this.searchMode = null;
        this.externalResults = [];
        
        // Cancel any pending search
        if (this.externalSearch) {
            this.externalSearch.cancel();
        }
        
        // Remove search mode tag
        this.removeSearchModeTag();
        
        // Reset to local items with recent items
        const recentItems = this.getRecentItems();
        this.filtered = this.mergeItemsWithRecent(recentItems, this.items);
        this.selectedIdx = 0;
        renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
        
        this.logger.log('Exited search mode');
    }
    
    /**
     * Add visual tag/badge for search mode
     * @param {string} type - The search type
     * @returns {void}
     */
    addSearchModeTag(type) {
        // Remove existing tag if any
        this.removeSearchModeTag();
        
        const tag = document.createElement('div');
        tag.className = 'cmdk-search-tag';
        tag.id = `cmdkSearchTag-${this.id}`;
        tag.innerHTML = `
            <span class="cmdk-search-tag-text">${type}</span>
            <button class="cmdk-search-tag-close" type="button">&times;</button>
        `;
        
        // Add click handler for close button
        tag.querySelector('.cmdk-search-tag-close').addEventListener('click', (e) => {
           // Prevent default & stop propagation so panel blur/global handlers don't close the palette
           e.preventDefault();
           e.stopPropagation();

           // Exit search mode (removes the tag)
           this.exitSearchMode();

           // Ensure the search input regains focus so the panel doesn't close due to blur handlers.
           // Use setTimeout to run after the current event loop / blur processing.
           setTimeout(() => {
               if (this.elements && this.elements.search) {
                   this.elements.search.focus();
               }
           }, 0);
       });

        // Insert inside the search container (before the input)
        this.elements.searchContainer.insertBefore(tag, this.elements.search);
        
        // Add padding to search input
        this.elements.search.classList.add('cmdk-search-with-tag');
    }
    
    /**
     * Remove search mode tag
     * @returns {void}
     */
    removeSearchModeTag() {
        const tag = document.getElementById(`cmdkSearchTag-${this.id}`);
        if (tag) {
            tag.remove();
        }
        this.elements.search.classList.remove('cmdk-search-with-tag');
    }
}

// Export the CommandPalette class
export default CommandPalette;

// Make it available globally
window.CommandPalette = CommandPalette;
