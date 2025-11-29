/**
 * DOM handling helpers for the command palette
 */

import { getTranslation } from './i18n.js';

/**
 * Get the URL type label for an action
 * @param {string|Function} action - The action to check
 * @returns {Object|null} - Object with type and color, or null if no label needed
 */
function getUrlTypeLabel(action) {
    if (typeof action !== 'string') {
        return null;
    }
    
    const lowerAction = action.toLowerCase();
    
    // Check for mailto
    if (lowerAction.startsWith('mailto:')) {
        return { type: 'email', color: '#f59e0b' }; // yellow/amber
    }
    
    // Check for tel
    if (lowerAction.startsWith('tel:')) {
        return { type: 'phone', color: '#10b981' }; // green
    }
    
    // Check for HTTP (unsecure)
    if (lowerAction.startsWith('http://')) {
        return { type: 'unsecure', color: '#ef4444' }; // red - only for HTTP
    }

// Check for other common protocols (show in blue)
// Common protocols: ftp, sms, spotify, steam, slack, etc.
    const protoMatch = lowerAction.match(/^(ftp|ftps|sms|spotify|steam|slack|discord|zoom|teams|whatsapp):/);
    if (protoMatch) {
        return { type: protoMatch[1], color: '#3b82f6' };
    }

    return null;
}

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
    
    // Generate a content key to detect if items have changed (not just selection)
    // Use null character as separator since it's unlikely to appear in item names
    const contentKey = items.map(item => item.name || '').join('\x00');
    const prevContentKey = listElement.getAttribute('data-content-key');
    
    // If this is just a selection change and the list is already populated with the same items
    // This ensures we do a full redraw when search results change (different items or content)
    if (listElement.children.length > 0 && items.length > 0 && 
        items.length === currentItemsCount && prevSelectedIdx !== null &&
        contentKey === prevContentKey) {
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
        // Handle separator items
        if (item._isSeparator) {
            const separator = document.createElement('li');
            separator.className = 'cmdk-separator';
            separator.innerHTML = '<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 8px 0;">';
            fragment.appendChild(separator);
            return;
        }
        
        // Create a new item from the template
        let itemHtml = templateContent;
        
        // Replace placeholders with actual values
        itemHtml = itemHtml.replace(/{{idx}}/g, idx);
        
        // Get URL type label if applicable
        const urlLabel = getUrlTypeLabel(item.action);
        let nameWithLabel = item.name || '';
        if (urlLabel) {
            const labelHtml = `<span style="display: inline-block; padding: 2px 6px; margin-right: 6px; font-size: 10px; font-weight: bold; color: white; background-color: ${urlLabel.color}; border-radius: 3px; text-transform: uppercase;">${urlLabel.type}</span>`;
            nameWithLabel = labelHtml + nameWithLabel;
        }
        itemHtml = itemHtml.replace(/{{name}}/g, nameWithLabel);
        
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
        
        // Add special classes for loading, error, and search suggestion items
        if (item._isLoading) {
            li.classList.add('_loading');
        }
        if (item._isError) {
            li.classList.add('_error');
        }
        if (item._isSearchSuggestion) {
            li.classList.add('_search-suggestion');
        }
        
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
    
    // Store the content key for change detection (reuse the contentKey from the beginning of the function)
    listElement.setAttribute('data-content-key', contentKey);
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
 * @param {boolean} openInNewTab - Whether to open the link in a new tab (Ctrl/Cmd+Enter)
 * @returns {void}
 */
export function executeItemAction(item, openInNewTab = false) {
    if (!item) return;

    if (typeof item.action === 'function') {
        item.action();
    } else if (typeof item.action === 'string') {
        if (/^#/.test(item.action)) {
            window.location.hash = item.action;
        } else {
            // If Ctrl/Cmd was pressed, open in new tab
            if (openInNewTab) {
                window.open(item.action, '_blank');
            } else {
                window.location.href = item.action;
            }
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
