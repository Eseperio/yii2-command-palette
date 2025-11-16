/**
 * Link scraper module for the command palette
 * Scrapes all visible links from the page and converts them to command palette items
 */

/**
 * Scrapes links from the page and returns them as command palette items
 * @param {Array} existingItems - Existing command palette items to avoid duplicates
 * @param {Array} excludeSelectors - CSS selectors for elements to exclude from scraping
 * @param {Object} logger - Logger instance for debug messages
 * @returns {Array} Array of command palette items created from scraped links
 */
export function scrapeLinks(existingItems = [], excludeSelectors = [], logger = null) {
    const scrapedItems = [];
    const existingUrls = new Set();
    let skippedCount = 0;
    
    // Build a set of existing URLs to avoid duplicates
    existingItems.forEach(item => {
        if (typeof item.action === 'string') {
            existingUrls.add(item.action);
        }
    });
    
    // Get all links on the page
    const allLinks = document.querySelectorAll('a[href]');
    
    allLinks.forEach(link => {
        // Skip if link is inside an excluded element
        if (shouldExcludeLink(link, excludeSelectors)) {
            if (logger) {
                logger.log('Link skipped (in excluded element):', link.href);
            }
            skippedCount++;
            return;
        }
        
        const href = link.href;
        
        // Skip if URL already exists
        if (existingUrls.has(href)) {
            if (logger) {
                logger.log('Link skipped (duplicate):', href);
            }
            skippedCount++;
            return;
        }
        
        // Get link text
        let text = getLinkText(link);
        
        // Skip if no text is available
        if (!text) {
            if (logger) {
                logger.log('Link skipped (no text):', href);
            }
            skippedCount++;
            return;
        }
        
        // Create command palette item
        const item = {
            icon: '🔗', // Default link icon
            name: text.trim(),
            subtitle: href,
            action: href
        };
        
        scrapedItems.push(item);
        existingUrls.add(href);
    });
    
    if (logger) {
        logger.log('Links scraper found', scrapedItems.length, 'links', 
                   '(skipped', skippedCount, ')');
    }
    
    return scrapedItems;
}

/**
 * Gets the text content of a link
 * @param {HTMLElement} link - The link element
 * @returns {string|null} The text content or null if not available
 */
function getLinkText(link) {
    // Try to get direct text content
    let text = link.textContent.trim();
    
    // If no text, try title attribute
    if (!text && link.hasAttribute('title')) {
        text = link.getAttribute('title').trim();
    }
    
    // If no text, try aria-label
    if (!text && link.hasAttribute('aria-label')) {
        text = link.getAttribute('aria-label').trim();
    }
    
    return text || null;
}

/**
 * Checks if a link should be excluded based on the exclude selectors
 * @param {HTMLElement} link - The link element to check
 * @param {Array} excludeSelectors - CSS selectors for elements to exclude
 * @returns {boolean} True if the link should be excluded
 */
function shouldExcludeLink(link, excludeSelectors) {
    if (!excludeSelectors || excludeSelectors.length === 0) {
        return false;
    }
    
    // Check if link or any of its parents match any exclude selector
    for (const selector of excludeSelectors) {
        try {
            if (link.matches(selector) || link.closest(selector)) {
                return true;
            }
        } catch (e) {
            console.error('Invalid exclude selector:', selector, e);
        }
    }
    
    return false;
}
