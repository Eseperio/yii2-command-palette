/**
 * External search module for fetching items from external API endpoints
 */

import Logger from './logger.js';
import { levenshtein } from './fuzzy.js';

/**
 * External search handler class
 */
class ExternalSearch {
    /**
     * Constructor
     * @param {Object} config - Configuration object
     * @param {string} config.endpoint - The API endpoint URL
     * @param {Array<string>} config.types - Available search types
     * @param {number} config.minChars - Minimum characters to trigger search
     * @param {number} config.timeout - Debounce timeout in milliseconds
     * @param {boolean} debug - Whether debug mode is enabled
     */
    constructor(config, debug = false) {
        this.endpoint = config.endpoint;
        this.types = config.types || [];
        this.minChars = config.minChars || 3;
        this.timeout = config.timeout || 300;
        this.logger = new Logger(debug);
        
        // Current search state
        this.currentRequest = null;
        this.debounceTimer = null;
        this.isLoading = false;
        this.activeType = null;
        this.lastError = null;
        
        this.logger.log('External search initialized with config:', config);
    }
    
    /**
     * Check if a search query matches any of the configured types
     * @param {string} query - The search query
     * @returns {Object|null} Matched type info or null
     */
    matchType(query) {
        if (!this.types || this.types.length === 0) {
            return null;
        }
        
        const words = query.trim().toLowerCase().split(/\s+/);
        
        for (const word of words) {
            for (const type of this.types) {
                const typeLower = type.toLowerCase();
                
                // Exact match
                if (word === typeLower) {
                    return {
                        type: type,
                        matchedWord: word,
                        distance: 0
                    };
                }
                
                // Fuzzy match using Levenshtein distance
                const distance = levenshtein(word, typeLower);
                const threshold = Math.ceil(typeLower.length * 0.3); // 30% threshold
                
                if (distance <= threshold) {
                    return {
                        type: type,
                        matchedWord: word,
                        distance: distance
                    };
                }
            }
        }
        
        return null;
    }
    
    /**
     * Extract search terms from query, removing the matched type word
     * @param {string} query - The full query
     * @param {string} matchedWord - The word that matched the type
     * @returns {string} Clean search terms
     */
    extractSearchTerms(query, matchedWord) {
        return query
            .split(/\s+/)
            .filter(word => word.toLowerCase() !== matchedWord.toLowerCase())
            .join(' ')
            .trim();
    }
    
    /**
     * Perform external search
     * @param {string} query - The search query
     * @param {string|null} type - Optional type filter
     * @returns {Promise<Array>} Search results
     */
    async search(query, type = null) {
        // Cancel previous request
        if (this.currentRequest) {
            this.currentRequest.abort();
            this.logger.log('Previous search request cancelled');
        }
        
        // Check minimum character requirement
        if (query.length < this.minChars) {
            this.logger.log('Query too short, minimum:', this.minChars);
            return [];
        }
        
        this.isLoading = true;
        this.lastError = null;
        
        try {
            // Create AbortController for this request
            const controller = new AbortController();
            this.currentRequest = controller;
            
            // Build URL with query parameters
            const url = new URL(this.endpoint, window.location.origin);
            url.searchParams.append('query', query);
            if (type) {
                url.searchParams.append('type', type);
            }
            
            this.logger.log('Fetching external results from:', url.toString());
            
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            this.logger.log('External search results:', data.length, 'items');
            
            return Array.isArray(data) ? data : [];
            
        } catch (error) {
            if (error.name === 'AbortError') {
                this.logger.log('Search request aborted');
                return [];
            }
            
            this.logger.error('External search error:', error);
            this.lastError = error.message;
            throw error;
            
        } finally {
            this.isLoading = false;
            this.currentRequest = null;
        }
    }
    
    /**
     * Perform debounced search
     * @param {string} query - The search query
     * @param {string|null} type - Optional type filter
     * @param {Function} callback - Callback function with results
     */
    debouncedSearch(query, type, callback) {
        // Clear existing timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        // Set new timer
        this.debounceTimer = setTimeout(async () => {
            try {
                const results = await this.search(query, type);
                callback(results, null);
            } catch (error) {
                callback([], error);
            }
        }, this.timeout);
    }
    
    /**
     * Cancel any pending search
     */
    cancel() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
        
        if (this.currentRequest) {
            this.currentRequest.abort();
            this.currentRequest = null;
        }
        
        this.isLoading = false;
    }
}

export default ExternalSearch;
