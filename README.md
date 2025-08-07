# Yii2 Command Palette Widget

A widget to add a command palette to your Yii2 application, similar to the ones in VSCode, GitHub, and other modern applications. The command palette provides a quick way to access commands and navigate through your application using keyboard shortcuts.

![Command Palette Demo](img.png)

## Features

- 🚀 Keyboard-driven interface (Ctrl+K / Cmd+K to open by default, customizable)
- 🔍 Fuzzy search with Levenshtein distance algorithm
- ⌨️ Full keyboard navigation (arrow keys, enter, escape)
- 🎨 Customizable appearance with multiple themes (default, dark, modern)
- 🌐 Internationalization support for 10 languages
- 🧩 Multiple palettes on the same page
- 📱 Responsive design
- 🔗 Support for URLs and JavaScript actions
- 🖼️ Support for emoji, image icons, and HTML icons (FontAwesome, etc.)

## Requirements

- PHP 8.0+
- Yii2 2.0+

## Installation

Install the package via Composer:

```bash
composer require eseperio/yii2-command-palette
```

## Basic Usage

```php
use eseperio\commandPalette\CommandPaletteWidget;

echo CommandPaletteWidget::widget([
    'items' => [
        [
            'icon' => '🏠',
            'name' => 'Home',
            'subtitle' => 'Go to homepage',
            'action' => '/',
        ],
        [
            'icon' => '🔍',
            'name' => 'Search',
            'subtitle' => 'Search for content',
            'action' => '/search',
        ],
        [
            'icon' => '⚙️',
            'name' => 'Settings',
            'subtitle' => 'Application settings',
            'action' => '/settings',
        ],
        [
            'icon' => 'https://example.com/icons/user.png',
            'name' => 'Profile',
            'subtitle' => 'View your profile',
            'action' => '/profile',
        ],
    ],
]);
```

## Item Configuration

Each item in the command palette can have the following properties:

- `icon` (string): An emoji, URL to an image, or HTML (if allowHtmlIcons is true)
- `name` (string): The name of the item
- `subtitle` (string, optional): A subtitle or description
- `action` (string|callable): A URL or JavaScript function to execute when the item is selected
- `visible` (boolean, optional): Whether the item should be displayed (default: true)

The widget itself can be configured with the following properties:

- `items` (array): The items to display in the command palette
- `locale` (string, optional): The locale for translations
- `theme` (string, optional): The theme to use (default, dark, or modern)
- `allowHtmlIcons` (boolean, optional): Whether to allow HTML in icons (default: false)

### URL Actions

You can specify a URL as the action, and the user will be redirected to that URL when the item is selected:

```php
'action' => '/profile', // Relative URL
'action' => 'https://example.com', // Absolute URL
```

### JavaScript Actions

You can specify a JavaScript function as the action using Yii2's JsExpression:

```php
use yii\web\JsExpression;

'action' => new JsExpression('function() { alert("Hello, world!"); }'),
```

Or use a more complex function:

```php
use yii\web\JsExpression;

'action' => new JsExpression('function() { 
    console.log("Item selected"); 
    window.location.href = "/profile"; 
}'),
```

This approach ensures that the JavaScript code is properly encoded and executed when the item is selected.

## Opening the Command Palette Programmatically

You can open the command palette programmatically using JavaScript:

```javascript
// Open the first command palette on the page
if (window.commandPalette_w0) {
    window.commandPalette_w0.open();
}
```

If you have multiple command palettes on the same page, you can access them using their widget IDs:

```javascript
// Open the second command palette on the page
if (window.commandPalette_w1) {
    window.commandPalette_w1.open();
}
```

## Customizing the Appearance

### Using CSS Variables

The command palette supports customization through CSS variables. You can set these variables in your own stylesheet to customize the appearance:

```css
/* Custom command palette styles using CSS variables */
:root {
  /* Primary colors */
  --cmdk-primary-color: #3b82f6;       /* Primary color (buttons, icons, focus) */
  --cmdk-background-color: #1e293b;    /* Background color of the panel */
  
  /* Element colors */
  --cmdk-element-title-color: #f8fafc;  /* Color of item titles */
  --cmdk-element-background-color: #334155; /* Background color for selected/hover items */
  --cmdk-element-subtitle-color: #94a3b8; /* Color of item subtitles */
  
  /* Spacing */
  --cmdk-element-padding: 12px 10px;    /* Padding for items */
  --cmdk-element-margin: 0;             /* Margin for the list */
  
  /* Border radius */
  --cmdk-border-radius: 8px;            /* Border radius for the panel */
  --cmdk-element-border-radius: 6px;    /* Border radius for items */
  --cmdk-input-border-radius: 6px;      /* Border radius for the search input */
}
```

### Using Direct CSS Overrides

You can also customize the appearance by directly overriding the CSS classes:

```css
/* Custom command palette styles with direct overrides */
.cmdk-overlay {
    background: rgba(0, 0, 0, 0.7); /* Darker overlay */
}

.cmdk-panel {
    background: #1e293b; /* Dark background */
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.cmdk-search {
    background: #334155;
    border-color: #475569;
    color: #f8fafc;
}

.cmdk-search:focus {
    border-color: #3b82f6;
    background: #334155;
}

.cmdk-item.selected,
.cmdk-item:hover {
    background: #334155;
}

.cmdk-icon {
    color: #3b82f6;
}

.cmdk-title {
    color: #f8fafc;
}

.cmdk-subtitle {
    color: #94a3b8;
}
```

## Advanced Usage

### HTML Icons

You can use HTML for icons by setting the `allowHtmlIcons` property to `true`. This is useful for using icon libraries like FontAwesome:

```php
// Include FontAwesome in your layout or view
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

echo CommandPaletteWidget::widget([
    'allowHtmlIcons' => true, // Enable HTML icons
    'items' => [
        [
            'icon' => '<i class="fas fa-home"></i>',
            'name' => 'Home',
            'subtitle' => 'Go to homepage',
            'action' => '/',
        ],
        [
            'icon' => '<i class="fas fa-search"></i>',
            'name' => 'Search',
            'subtitle' => 'Search for content',
            'action' => '/search',
        ],
        [
            'icon' => '<i class="fas fa-cog"></i>',
            'name' => 'Settings',
            'subtitle' => 'Application settings',
            'action' => '/settings',
        ],
    ],
]);
```

> **Note:** Be careful when using HTML from user-provided content to avoid XSS vulnerabilities.

### Multiple Command Palettes

You can have multiple command palettes on the same page:

```php
// First command palette
echo CommandPaletteWidget::widget([
    'items' => [
        // Navigation items
    ],
]);

// Second command palette
echo CommandPaletteWidget::widget([
    'items' => [
        // Action items
    ],
]);
```

Each command palette will have a unique ID and can be opened independently.

### Conditional Item Display

You can use the `visible` property to conditionally display items based on certain conditions, similar to other Yii2 widgets:

```php
echo CommandPaletteWidget::widget([
    'items' => [
        [
            'icon' => '🏠',
            'name' => 'Home',
            'subtitle' => 'Go to homepage',
            'action' => '/',
            'visible' => true, // This item will be displayed (default behavior)
        ],
        [
            'icon' => '👤',
            'name' => 'Admin Panel',
            'subtitle' => 'Access admin panel',
            'action' => '/admin',
            'visible' => Yii::$app->user->can('admin'), // Only visible to admin users
        ],
        [
            'icon' => '📊',
            'name' => 'Reports',
            'subtitle' => 'View reports',
            'action' => '/reports',
            'visible' => false, // This item will not be displayed
        ],
    ],
]);
```

Items with `visible` set to `false` will be filtered out and not displayed in the command palette.

### Language Support

The command palette supports 10 languages: English (default), Spanish, French, German, Italian, Portuguese, Russian, Chinese (Simplified), Japanese, and Arabic.

You can specify the locale when initializing the widget:

```php
echo CommandPaletteWidget::widget([
    'locale' => 'es', // Spanish
    'items' => [
        // Items
    ],
]);
```

The locale affects the placeholder text in the search input and the "No results" message.

### Theme Support

The command palette comes with three built-in themes:

- `default`: Light theme with purple accents
- `dark`: Dark theme with purple accents
- `modern`: Light theme with blue accents and modern styling

You can specify the theme when initializing the widget:

```php
echo CommandPaletteWidget::widget([
    'theme' => 'dark', // Use the dark theme
    'items' => [
        // Items
    ],
]);
```

### Customizing Keyboard Shortcuts

By default, the command palette opens with Ctrl+K (Windows/Linux) or Cmd+K (Mac). You can customize this shortcut by specifying the `keyboardShortcuts` parameter:

```php
echo CommandPaletteWidget::widget([
    'keyboardShortcuts' => ['p', 'P'], // Open with Ctrl+P or Cmd+P
    'items' => [
        // Items
    ],
]);
```

You can specify multiple keys to create multiple shortcuts:

```php
echo CommandPaletteWidget::widget([
    'keyboardShortcuts' => ['k', 'p'], // Open with Ctrl+K, Cmd+K, Ctrl+P, or Cmd+P
    'items' => [
        // Items
    ],
]);
```

If you don't want any keyboard shortcuts, you can set it to an empty array:

```php
echo CommandPaletteWidget::widget([
    'keyboardShortcuts' => [], // No keyboard shortcuts
    'items' => [
        // Items
    ],
]);
```

## Development and Testing

The package includes a test application that demonstrates the usage of the command palette widget. You can run this application using the built-in PHP server:

```bash
composer serve
```

This will start a PHP server on `localhost:8081`. Open your browser and navigate to http://localhost:8081 to see the command palette widget in action.

The test application includes several examples:
- Basic usage of the command palette
- Multiple command palettes on the same page
- Custom styled command palette


## License

MIT
