/**
 * Main palette logic for the command palette
 */

import { filterItems } from './fuzzy.js';
import { renderList, scrollToSelected, executeItemAction, setupEventListeners } from './dom.js';

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
     */
    constructor(id, items = []) {
        this.id = id;
        this.items = items;
        this.filtered = [...items];
        this.selectedIdx = 0;
        this.isOpen = false;
        
        // Get DOM elements
        this.elements = {
            overlay: document.getElementById(`cmdkOverlay-${id}`),
            panel: document.getElementById(`cmdkPanel-${id}`),
            search: document.getElementById(`cmdkSearch-${id}`),
            list: document.getElementById(`cmdkList-${id}`)
        };
        
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
        renderList(this.elements.list, this.filtered, this.selectedIdx);
    }
    
    /**
     * Open the command palette
     * @returns {void}
     */
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.elements.overlay.style.display = 'block';
        this.elements.panel.style.display = 'flex';
        
        setTimeout(() => this.elements.search.focus(), 20);
        
        this.elements.search.value = '';
        this.filtered = [...this.items];
        this.selectedIdx = 0;
        
        renderList(this.elements.list, this.filtered, this.selectedIdx);
    }
    
    /**
     * Close the command palette
     * @returns {void}
     */
    close() {
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
        renderList(this.elements.list, this.filtered, this.selectedIdx);
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
            renderList(this.elements.list, this.filtered, this.selectedIdx);
            scrollToSelected(this.elements.list);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIdx = (this.selectedIdx - 1 + this.filtered.length) % this.filtered.length;
            renderList(this.elements.list, this.filtered, this.selectedIdx);
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
        if (!this.elements.panel.contains(document.activeElement)) {
            this.close();
        }
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
            renderList(this.elements.list, this.filtered, this.selectedIdx);
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
        
        this.close();
        executeItemAction(item);
    }
}

// Export the CommandPalette class
export default CommandPalette;

// Make it available globally
window.CommandPalette = CommandPalette;
