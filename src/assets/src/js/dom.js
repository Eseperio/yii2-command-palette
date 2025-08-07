/**
 * DOM handling helpers for the command palette
 */

import { getTranslation } from './i18n.js';

/**
 * Renders a list of items in the command palette
 * @param {HTMLElement} listElement - The list element to render items in
 * @param {Array} items - The items to render
 * @param {number} selectedIdx - The index of the selected item
 * @param {string} locale - The locale for translations
 * @returns {void}
 */
export function renderList(listElement, items, selectedIdx = 0, locale = 'en') {
    // Store the previously selected item index
    const prevSelectedIdx = listElement.getAttribute('data-selected-idx');
    
    // Get the current items count from the list
    const currentItemsCount = listElement.querySelectorAll('.cmdk-item').length;
    
    // If this is just a selection change and the list is already populated with the same number of items
    // This ensures we do a full redraw when search results change (different number of items)
    if (listElement.children.length > 0 && items.length > 0 && 
        items.length === currentItemsCount && prevSelectedIdx !== null) {
        // Update only the selection state
        const prevSelected = listElement.querySelector(`.cmdk-item[data-idx="${prevSelectedIdx}"]`);
        const newSelected = listElement.querySelector(`.cmdk-item[data-idx="${selectedIdx}"]`);
        
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
        
        if (newSelected) {
            newSelected.classList.add('selected');
            // Update the stored selected index
            listElement.setAttribute('data-selected-idx', selectedIdx);
            return;
        }
    }
    
    // If we need to do a full render (first render or items changed)
    listElement.innerHTML = '';
    
    if (items.length === 0) {
        const noResultsText = getTranslation('noResults', locale);
        listElement.innerHTML = `<li style="padding: 16px; color: #8b8b93;">${noResultsText}</li>`;
        return;
    }
    
    // Get the template ID from the list element ID
    const id = listElement.id.replace('cmdkList-', '');
    const templateElement = document.getElementById(`cmdkItemTemplate-${id}`);
    
    if (!templateElement) {
        console.error(`Template element not found: cmdkItemTemplate-${id}`);
        return;
    }
    
    const templateContent = templateElement.innerHTML;
    
    // Create a document fragment to improve performance
    const fragment = document.createDocumentFragment();
    
    items.forEach((item, idx) => {
        // Create a new item from the template
        let itemHtml = templateContent;
        
        // Replace placeholders with actual values
        itemHtml = itemHtml.replace(/{{idx}}/g, idx);
        itemHtml = itemHtml.replace(/{{name}}/g, item.name || '');
        
        // Handle icon
        if (item.icon) {
            // Get the widget ID from the list element ID
            const widgetId = listElement.id.replace('cmdkList-', '');
            // Check if HTML icons are allowed for this widget
            const allowHtmlIcons = window[`cmdkAllowHtmlIcons_${widgetId}`] || false;
            
            // Check if the icon is a URL
            if (typeof item.icon === 'string' && item.icon.match(/^https?:\/\//)) {
                // Replace the icon placeholder with an img tag
                itemHtml = itemHtml.replace(/{{#icon}}([\s\S]*?){{\/icon}}/g, 
                    `<img src="${item.icon}" class="cmdk-icon" style="width: 22px; height: 22px; object-fit: cover;">`);
            } else if (allowHtmlIcons) {
                // If HTML icons are allowed, use the icon content as HTML
                // Replace the icon placeholder with the HTML content
                itemHtml = itemHtml.replace(/{{#icon}}([\s\S]*?){{\/icon}}/g, 
                    item.icon);
            } else {
                // Replace the icon content (treat as text)
                itemHtml = itemHtml.replace(/{{icon}}/g, item.icon);
                // Keep the icon block
                itemHtml = itemHtml.replace(/{{#icon}}([\s\S]*?){{\/icon}}/g, '$1');
            }
        } else {
            // Remove the icon block
            itemHtml = itemHtml.replace(/{{#icon}}[\s\S]*?{{\/icon}}/g, '');
        }
        
        // Handle subtitle
        if (item.subtitle) {
            itemHtml = itemHtml.replace(/{{subtitle}}/g, item.subtitle);
            itemHtml = itemHtml.replace(/{{#subtitle}}([\s\S]*?){{\/subtitle}}/g, '$1');
        } else {
            itemHtml = itemHtml.replace(/{{#subtitle}}[\s\S]*?{{\/subtitle}}/g, '');
        }
        
        // Create a temporary element to hold the HTML
        const temp = document.createElement('div');
        temp.innerHTML = itemHtml;
        const li = temp.firstElementChild;
        
        // Add selected class if this is the selected item
        if (idx === selectedIdx) {
            li.classList.add('selected');
        }
        
        fragment.appendChild(li);
    });
    
    // Append all items at once
    listElement.appendChild(fragment);
    
    // Store the selected index as a data attribute
    listElement.setAttribute('data-selected-idx', selectedIdx);
}

/**
 * Scrolls to the selected item in the list
 * @param {HTMLElement} listElement - The list element
 * @returns {void}
 */
export function scrollToSelected(listElement) {
    const selected = listElement.querySelector('.cmdk-item.selected');
    if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
    }
}

/**
 * Executes the action of an item
 * @param {Object} item - The item to execute
 * @returns {void}
 */
export function executeItemAction(item) {
    if (!item) return;
    
    if (typeof item.action === 'function') {
        item.action();
    } else if (typeof item.action === 'string') {
        if (/^(https?:)?\/\//.test(item.action)) {
            window.location.assign(item.action);
        } else {
            window.location.pathname = item.action;
        }
    }
}

/**
 * Adds event listeners to the command palette elements
 * @param {Object} elements - The command palette elements
 * @param {Object} callbacks - The callbacks for the events
 * @returns {void}
 */
export function setupEventListeners(elements, callbacks) {
    const { overlay, panel, search, list } = elements;
    const { onSearch, onKeyDown, onItemClick, onOverlayClick, onPanelBlur, onFocusIn } = callbacks;
    
    // Search input events
    if (search && onSearch) {
        search.addEventListener('input', onSearch);
    }
    
    if (search && onKeyDown) {
        search.addEventListener('keydown', onKeyDown);
    }
    
    // List events
    if (list && onItemClick) {
        list.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const item = e.target.closest('.cmdk-item');
            if (item) {
                const idx = parseInt(item.getAttribute('data-idx'), 10);
                onItemClick(idx);
            }
        });
    }
    
    // Mouse movement on list items
    if (list) {
        list.addEventListener('mousemove', (e) => {
            const item = e.target.closest('.cmdk-item');
            if (item) {
                const idx = parseInt(item.getAttribute('data-idx'), 10);
                if (callbacks.onItemHover) {
                    callbacks.onItemHover(idx);
                }
            }
        });
    }
    
    // Overlay click
    if (overlay && onOverlayClick) {
        overlay.addEventListener('click', onOverlayClick);
    }
    
    // Panel blur
    if (panel && onPanelBlur) {
        panel.addEventListener('blur', onPanelBlur, true);
    }
    
    // Document focus
    if (onFocusIn) {
        document.addEventListener('focusin', onFocusIn);
    }
    
    // Global keyboard shortcuts
    if (callbacks.onGlobalKeyDown) {
        window.addEventListener('keydown', callbacks.onGlobalKeyDown);
    }
}
