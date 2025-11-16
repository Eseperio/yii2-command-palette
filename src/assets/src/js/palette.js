/**
 * Main palette logic for the command palette
 */

import { filterItems } from './fuzzy.js';
import { renderList, scrollToSelected, executeItemAction, setupEventListeners } from './dom.js';
import { getTranslation, getTranslations } from './i18n.js';
import Logger from './logger.js';
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
     * @param {string} locale - The locale for translations
     * @param {boolean} debug - Whether debug mode is enabled
     * @param {Object|null} externalSearchConfig - External search configuration
     */
    constructor(id, items = [], locale = 'en', debug = false, externalSearchConfig = null) {
        this.id = id;
        this.items = items;
        this.filtered = [...items];
        this.selectedIdx = 0;
        this.isOpen = false;
        this.locale = locale;
        this.debug = debug;
        
        // Track Ctrl/Cmd key state for new tab shortcuts
        this.ctrlKeyPressed = false;
        
        // External search
        this.externalSearch = externalSearchConfig ? new ExternalSearch(externalSearchConfig, debug) : null;
        this.externalResults = [];
        this.searchMode = null; // null or { type: 'typename', query: 'search terms' }
        
        // Initialize logger
        this.logger = new Logger(debug);
        
        this.logger.log('Initializing command palette with', items.length, 'items');
        if (this.externalSearch) {
            this.logger.log('External search enabled for types:', externalSearchConfig.types);
        }
        
        // Get DOM elements
        this.elements = {
            overlay: document.getElementById(`cmdkOverlay-${id}`),
            panel: document.getElementById(`cmdkPanel-${id}`),
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
        this.filtered = [...this.items];
        this.selectedIdx = 0;
        
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
        
        // Filter local items
        this.filtered = filterItems(query, this.items);
        
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
        
        this.selectedIdx = 0;
        renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
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
        
        // Reset to local items
        this.filtered = [...this.items];
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
        tag.querySelector('.cmdk-search-tag-close').addEventListener('click', () => {
            this.exitSearchMode();
        });
        
        // Insert before search input
        this.elements.search.parentNode.insertBefore(tag, this.elements.search);
        
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
            this.selectedIdx = (this.selectedIdx + 1) % this.filtered.length;
            renderList(this.elements.list, this.filtered, this.selectedIdx, this.locale);
            scrollToSelected(this.elements.list);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIdx = (this.selectedIdx - 1 + this.filtered.length) % this.filtered.length;
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
        if (!item) return;
        
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
        executeItemAction(item, this.ctrlKeyPressed); // Pass Ctrl key state
        this.close();            // Luego cierra el panel
    }
}

// Export the CommandPalette class
export default CommandPalette;

// Make it available globally
window.CommandPalette = CommandPalette;
