/**
 * Main palette logic for the command palette
 */

import { filterItems } from './fuzzy.js';
import { renderList, scrollToSelected, executeItemAction, setupEventListeners } from './dom.js';
import { getTranslation, getTranslations } from './i18n.js';
import Logger from './logger.js';
import { scrapeLinks } from './linkScraper.js';

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
     * @param {boolean} enableLinksScraper - Whether to enable links scraper
     * @param {Array} linkScraperExcludeSelectors - CSS selectors to exclude from link scraping
     * @param {number} maxRecentItems - Maximum number of recent items to keep (0 to disable)
     */
    // constructor(id, items = [], locale = 'en', debug = false, enableLinksScraper = false, linkScraperExcludeSelectors = []) {
    constructor(id, items = [], locale = 'en', debug = false, maxRecentItems = 0) {
        this.id = id;
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
        
        this.logger.log('Initializing command palette with', this.items.length, 'items');
        this.logger.log('Recent items:', maxRecentItems > 0 ? `enabled (max: ${maxRecentItems})` : 'disabled');
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
    }
    
    /**
     * Handle search input
     * @param {Event} e - The input event
     * @returns {void}
     */
    handleSearch(e) {
        const query = e.target.value.trim();

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
        
        this.logger.log('Item selected:', item.name, 'Ctrl/Cmd pressed:', this.ctrlKeyPressed);

        // Add to recent items before executing action
        this.addRecentItem(item);

        executeItemAction(item, this.ctrlKeyPressed); // Pass Ctrl key state
        this.close();            // Luego cierra el panel
    }
}

// Export the CommandPalette class
export default CommandPalette;

// Make it available globally
window.CommandPalette = CommandPalette;
