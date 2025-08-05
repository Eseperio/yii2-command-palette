/**
 * DOM handling helpers for the command palette
 */

/**
 * Renders a list of items in the command palette
 * @param {HTMLElement} listElement - The list element to render items in
 * @param {Array} items - The items to render
 * @param {number} selectedIdx - The index of the selected item
 * @returns {void}
 */
export function renderList(listElement, items, selectedIdx = 0) {
    listElement.innerHTML = '';
    
    if (items.length === 0) {
        listElement.innerHTML = `<li style="padding: 16px; color: #8b8b93;">No results</li>`;
        return;
    }
    
    items.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'cmdk-item' + (idx === selectedIdx ? ' selected' : '');
        li.tabIndex = -1;
        li.setAttribute('data-idx', idx);

        if (item.icon) {
            let iconElem;
            // Check if the icon is a URL
            if (typeof item.icon === 'string' && item.icon.match(/^https?:\/\//)) {
                iconElem = document.createElement('img');
                iconElem.src = item.icon;
                iconElem.className = 'cmdk-icon';
                iconElem.style.width = '22px';
                iconElem.style.height = '22px';
                iconElem.style.objectFit = 'cover';
            } else {
                iconElem = document.createElement('span');
                iconElem.className = 'cmdk-icon';
                iconElem.textContent = item.icon;
            }
            li.appendChild(iconElem);
        }
        
        const content = document.createElement('div');
        content.className = 'cmdk-content';

        const title = document.createElement('span');
        title.className = 'cmdk-title';
        title.textContent = item.name;
        content.appendChild(title);

        if (item.subtitle) {
            const subtitle = document.createElement('span');
            subtitle.className = 'cmdk-subtitle';
            subtitle.textContent = item.subtitle;
            content.appendChild(subtitle);
        }

        li.appendChild(content);
        listElement.appendChild(li);
    });
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
