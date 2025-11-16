/**
 * Main palette logic for the command palette
 */

import { filterItems } from './fuzzy.js';
import { renderList, scrollToSelected, executeItemAction, setupEventListeners } from './dom.js';
import { getTranslation, getTranslations } from './i18n.js';
import Logger from './logger.js';

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
     */
    constructor(id, items = [], locale = 'en', debug = false) {
        this.id = id;
        this.items = items;
        this.filtered = [...items];
        this.selectedIdx = 0;
        this.isOpen = false;
        this.locale = locale;
        this.debug = debug;
        
        // Initialize logger
        this.logger = new Logger(debug);
        
        this.logger.log('Initializing command palette with', items.length, 'items');
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
        this.filtered = filterItems(e.target.value.trim(), this.items);
        this.selectedIdx = 0;
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
        
        this.logger.log('Item selected:', item.name);
        executeItemAction(item); // Ejecuta la acción primero
        this.close();            // Luego cierra el panel
    }
}

// Export the CommandPalette class
export default CommandPalette;

// Make it available globally
window.CommandPalette = CommandPalette;
