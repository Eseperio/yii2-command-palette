# Development Plan: Command Palette Widget for Yii2

## Objective

Develop a library for Yii2 (PHP 7.4+) that provides a reusable `<CommandPaletteWidget>` widget,
configurable from PHP, capable of displaying a floating command palette with fuzzy search (fuzzy/Levenshtein),
compatible with any Yii2 application.  
Frontend interaction is based on the JS/CSS implementation provided in `reference.html`, which must be modularized
for productive and efficient use.

---

## Folder and File Structure

The package structure should be as follows, complying with PSR-4 and Yii2 standard conventions:

```
cmdk-widget-yii2/
│
├── src/
│   ├── CommandPaletteWidget.php
│   ├── assets/
│   │   ├── CommandPaletteAsset.php
│   │   ├── src/
│   │   │   ├── js/
│   │   │   │   ├── palette.js        # Main palette logic (ES6 modular)
│   │   │   │   ├── fuzzy.js          # Fuzzy search algorithms (Levenshtein, helpers)
│   │   │   │   └── dom.js            # DOM handling helpers (render, events)
│   │   │   └── scss/
│   │   │       └── palette.scss      # Base styles, in SCSS
│   │   └── dist/
│   │       ├── js/
│   │       │   └── palette.min.js    # Compiled/minified JS ready for production
│   │       └── css/
│   │           └── palette.min.css   # Compiled/minified CSS from SCSS
│   │
│   └── views/
│       └── widget.php                # HTML rendered by the widget
│
├── tests/
│   ├── app/
│   │   ├── assets/                   # (if needed for tests)
│   │   ├── config/
│   │   │   └── web.php               # Minimal Yii2 configuration
│   │   ├── controllers/
│   │   │   └── SiteController.php    # Demo action rendering the widget
│   │   ├── runtime/                  # (ignore in VCS)
│   │   ├── views/
│   │   │   └── site/
│   │   │       └── index.php         # Widget test page
│   │   └── web/
│   │       └── index.php             # Minimal Yii2 web entry
│   └── WidgetTest.php                # Functional test (PHPUnit/codeception)
│
├── vite.config.js                    # Vite configuration for asset compilation
├── package.json                      # Node.js dependencies including Vite
├── composer.json                     # PSR-4 autoload and dependencies
├── reference.html                    # Complete original reference for parsing and modularization
└── README.md

```

---

## Details of Each Part

### 1. **Main Widget (`src/CommandPaletteWidget.php`)**

- Extends `yii\base\Widget`.
- Public property `items` (array of elements to display: icon, name, subtitle, action).
    - The `icon` field can be:
        - An emoji (e.g.: '🔍', '⚙️', '📝')
        - A relative or absolute URL to an image (the indicated image will be shown)
- Renders the `views/widget.php` view, passing the data.
- Registers the `CommandPaletteAsset`.

#### Usage Example:

```php
echo CommandPaletteWidget::widget([
    'items' => [
        [
            'icon' => '🔍', // Emoji as icon
            'name' => 'Search on Google',
            'subtitle' => 'Open Google in a new tab',
            'action' => 'function' // Or a relative/absolute URL
        ],
        [
            'icon' => '/images/settings.png', // Relative URL to an image
            'name' => 'Settings',
            'subtitle' => 'Application settings',
            'action' => '/site/settings'
        ],
        [
            'icon' => 'https://example.com/icons/user.svg', // Absolute URL to an image
            'name' => 'User Profile',
            'subtitle' => 'View your profile',
            'action' => '/user/profile'
        ],
        // ...
    ],
]);
```

### 2. **Widget View (`src/views/widget.php`)**

* Renders the palette HTML (overlay, panel, search, list) as seen in `reference.html`.
* May use `Html::encode()` to sanitize values.
* The widget must have a unique id to allow multiple palettes on the same page if needed.

### 3. **Assets (`src/assets/CommandPaletteAsset.php`)**

* Publishes and registers JS and CSS files (compiled from `src/assets/src/` to `dist/`).
* May depend on `yii\web\JqueryAsset` if necessary, but should aim to be jQuery-agnostic.
* The asset must register `palette.min.js` and `palette.min.css`.

### 4. **JS/CSS Modularization with Vite**

* **palette.js**: general palette logic (open/close, keyboard navigation, integration with PHP data, HTML render).
* **fuzzy.js**: Levenshtein algorithms and helpers for fuzzy search.
* **dom.js**: helpers for creating nodes, managing events, clearing nodes, etc.
* Everything should be exported as ES6 modules, and compiled with Vite into a single minified file
  in `dist/js/`.

#### Suggestion:

* The palette should receive the items to display via a JS object (injected by the widget). The PHP widget should
  serialize the elements to JSON and inject them into the HTML (for example, in a `window.__PALETTE_ITEMS = [...]` or as
  a `data-items` attribute).
* The JS should allow instantiating multiple palettes if there is more than one widget on the page.

### 5. **SCSS and CSS with Vite**

* All styles are developed in SCSS (`src/assets/src/scss/palette.scss`).
* Compile to minified CSS in `dist/css/palette.min.css` using Vite.
* Follow the radix-ui aesthetic, but customizable via SCSS variables if needed.

### 6. **Vite Configuration for Asset Compilation**

* Vite will be used as the build tool for the project's JS and SCSS files.
* A `vite.config.js` file must be created at the project root with the necessary configurations to:
    * Process modern ES6 JavaScript files and compile them to versions compatible with target browsers.
    * Compile SCSS files to CSS, with autoprefixing and minification.
    * Generate source maps to facilitate debugging.
    * Configure multiple entries (palette.js and palette.scss).
    * Define correct output paths in `dist/` for JS and CSS.
    * Optimize output for production (minification, tree-shaking).
* The necessary dependencies must be included in `package.json`:
    * Vite as the main tool
    * Plugins for SCSS/SASS
    * Plugins for minification and optimization
    * Scripts for development and production build
* The basic commands to configure should include:
    * `npm run dev`: For development with live reload
    * `npm run build`: For production build

### 7. **Functional Tests and Test Environment**

* Create a minimal Yii2 app in `tests/app` to render the widget from the main controller.
* Functional tests with Codeception will be used to validate that the widget renders and works correctly.
* Tests should verify:
    * Correct rendering of the widget's HTML
    * Proper injection of items in the expected JSON format
    * Presence of registered assets on the page
    * Basic interaction functionality with the widget
* Optionally, add JS tests with Playwright/Puppeteer to validate JS interaction (optional but recommended).

---

## **Additional Notes**

* The widget should be well documented, with PHPDoc in all classes and public methods.
* The library should be installable via composer, complying with PSR-4.
* The asset bundle should be published in debug mode and minified for production.
* The original command palette JS source (`reference.html`) should be split into thematic modules (
  `palette.js`, `fuzzy.js`, `dom.js`), facilitating maintenance.
* It is recommended that the generated JS is namespaced or configurable to avoid conflicts with other components on the
  same page.
* Add a `README.md` file with installation, usage, and widget extension instructions.
* If the palette needs internationalization, the widget should support translatable messages and texts (e.g., the
  search field placeholder).
* Configure a `.gitignore` file to exclude all unnecessary folders and files from the repository, such as (
  among others):
    * `/vendor/`
    * `/node_modules/`
    * `/tests/app/runtime/`
    * `/tests/app/web/assets/`
    * `/src/assets/dist/` (if generated during development)
    * `.idea/`, `.vscode/` and other IDE-specific files
    * Local configuration files, such as `.env` if applicable
    * Temporary and cache files

---

## **General Development Flow Summary**

1. Copy the base source code from `reference.html`.
2. Extract and modularize the JS into logical files, prepare assets and configure Vite for the build pipeline.
3. Create the PHP widget and its view, serializing and exposing PHP items to JS.
4. Integrate the asset bundle and register resources correctly.
5. Create a minimal app in `tests/app` to render and test the widget.
6. Add functional tests and document the entire integration flow.
7. Document usage examples and extension points in the README.

## **Vite Configuration**

For proper Vite configuration in the project, you need to:

1. Initialize the Node.js environment by running `npm init` at the project root
2. Install Vite and its necessary dependencies:
   ```bash
   npm install --save-dev vite @vitejs/plugin-legacy sass postcss autoprefixer
   ```
3. Create the `vite.config.js` file at the project root configuring:
    - Main file entries (JS and SCSS)
    - Output directory (dist)
    - Production and development configuration
    - Necessary plugins for SCSS and browser compatibility
4. Modify `package.json` to include the scripts:
    - `"dev": "vite"`
    - `"build": "vite build"`
5. During development, you can run `npm run dev` to see changes in real time
6. To compile the final assets for production, run `npm run build`
7. Make sure `CommandPaletteAsset.php` correctly points to the files generated by Vite

Using Vite will provide a faster development process thanks to its development server with HMR (Hot Module
Replacement) and optimized production build.

## **Codeception Configuration for Functional Tests**

To implement functional tests with Codeception, follow these steps:

1. Install Codeception as a development dependency in the project:
   ```bash
   composer require --dev codeception/codeception codeception/module-yii2 codeception/module-asserts
   ```

2. Initialize Codeception's test structure:
   ```bash
   vendor/bin/codecept bootstrap
   ```

3. Configure the test environment in `codeception.yml` and `tests/functional.suite.yml` to work with the
   Yii2 module.

4. Create specific functional tests for the widget in the `tests/functional/` folder:
    - Create a test to validate basic widget rendering
    - Create a test to verify search functionality
    - Create a test to check keyboard interaction

5. For each functional test, configure:
    - Environment setup (arrange)
    - Action to test (act)
    - Assertions to verify results (assert)

6. Structure tests to be independent and runnable in isolation.

7. Implement helper methods if necessary to facilitate interaction with the widget during tests.

8. Run the tests with the command:
   ```bash
   vendor/bin/codecept run functional
   ```

9. Ensure tests cover both success cases and possible error cases in widget configuration or usage.

10. For continuous integration, configure tests to run automatically on each commit or pull
    request.

Functional tests with Codeception will verify that the widget works correctly in a real Yii2 environment,
validating both HTML rendering and correct asset inclusion and expected basic behavior.

## **.gitignore Configuration**

To keep the repository clean and avoid including unnecessary files, configure an appropriate `.gitignore`
file. This file should include:

1. System-generated folders:
   ```
   /vendor/
   /node_modules/
   ```

2. Files generated during development:
   ```
   /tests/app/runtime/*
   /tests/app/web/assets/*
   ```

3. Compiled files if generated locally (and not part of the distributed package):
   ```
   /src/assets/dist/
   ```

4. IDE configuration files:
   ```
   .idea/
   .vscode/
   .phpstorm.meta.php
   ```

5. Temporary and cache files:
   ```
   .DS_Store
   Thumbs.db
   *.log
   *.cache
   ```

6. Local configuration files:
   ```
   .env
   .env.local
   ```

It is important to keep this file updated during development to avoid committing unnecessary or
sensitive files to the repository.
