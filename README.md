# Yii2 Command Palette Widget

A widget to add a command palette to your Yii2 application, similar to the ones in VSCode, GitHub, and other modern
applications. The command palette provides a quick way to access commands and navigate through your application using
keyboard shortcuts.

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
- 🆕 **URL type labels** - Automatic labels for HTTP (unsecure), email, phone, and protocol links
- 🆕 **Debug mode** - Console logging with [CommandPalette] prefix
- 🆕 **New tab shortcuts** - Ctrl/Cmd+Enter to open links in new tabs
- 🆕 **Recent items** - Remember and display recently selected items at the top

> Want to see a complex demo in action? You can clone the repository, install dependencies and then run `composer serve`
> to start a
> test application that demonstrates the command palette widget and its uses.

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
- `debug` (boolean, optional): Enable debug mode with console logging (defaults to YII_DEBUG)
- `maxRecentItems` (int, optional): Maximum number of recent items to keep (default: 0 = disabled)

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

## Documentation

- [Advanced Usage](docs/advanced-usage.md) - HTML icons, multiple palettes, conditional items, programmatic control,
  debug mode, keyboard shortcuts
- [Customization](docs/customization.md) - CSS variables, themes, keyboard shortcuts, language support

## Development and Testing

The package includes a test application that demonstrates the usage of the command palette widget. You can run this
application using the built-in PHP server:

```bash
composer serve
```

This will start a PHP server on `localhost:8081`. Open your browser and navigate to http://localhost:8081 to see the
command palette widget in action.

The test application includes several examples:

- Basic usage of the command palette
- Multiple command palettes on the same page
- Custom styled command palette
- HTML icons example (FontAwesome)
- URL type labels example

### Compile assets

This project uses vite to compile assets. To compile assets, run the following command:

`vite build`

## License

MIT
