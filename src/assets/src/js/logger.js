/**
 * Logger class for Command Palette
 * Provides consistent logging with debug mode control
 */
class Logger {
    /**
     * Constructor
     * @param {boolean} debug - Whether debug mode is enabled
     * @param {string} prefix - Prefix for all log messages
     */
    constructor(debug = false, prefix = '[CommandPalette]') {
        this.debug = debug;
        this.prefix = prefix;
        
        // Show initialization message if debug is enabled
        if (this.debug) {
            console.log(
                '%c' + this.prefix + ' Debug mode is ENABLED',
                'color: red; font-weight: bold;'
            );
        }
    }
    
    /**
     * Log a message to console if debug is enabled
     * @param {...any} args - Arguments to pass to console.log
     */
    log(...args) {
        if (this.debug) {
            console.log(this.prefix, ...args);
        }
    }
    
    /**
     * Log a warning to console if debug is enabled
     * @param {...any} args - Arguments to pass to console.warn
     */
    warn(...args) {
        if (this.debug) {
            console.warn(this.prefix, ...args);
        }
    }
    
    /**
     * Log an error to console if debug is enabled
     * @param {...any} args - Arguments to pass to console.error
     */
    error(...args) {
        if (this.debug) {
            console.error(this.prefix, ...args);
        }
    }
    
    /**
     * Log an info message to console if debug is enabled
     * @param {...any} args - Arguments to pass to console.info
     */
    info(...args) {
        if (this.debug) {
            console.info(this.prefix, ...args);
        }
    }
}

export default Logger;
