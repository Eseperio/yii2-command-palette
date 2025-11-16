# Advanced Usage

## HTML Icons

You can use HTML for icons by setting the `allowHtmlIcons` property to `true`. This is useful for using icon libraries
like FontAwesome:

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

## Multiple Command Palettes

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

## Conditional Item Display

You can use the `visible` property to conditionally display items based on certain conditions, similar to other Yii2
widgets:

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

## Debug Mode

Enable debug mode to see detailed console logging:

```php
echo CommandPaletteWidget::widget([
    'debug' => true, // Enable debug mode (defaults to YII_DEBUG)
    'items' => [
        // Items
    ],
]);
```

When debug mode is enabled, you'll see messages like:
- `[CommandPalette] Debug mode is ENABLED` (in red)
- `[CommandPalette] Initializing command palette with X items`
- `[CommandPalette] Opening command palette`
- `[CommandPalette] Item selected: ItemName`

## Keyboard Shortcuts

### Opening the Palette

By default, press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac) to open the command palette.

### Opening Links in New Tabs

Hold `Ctrl` (Windows/Linux) or `Cmd` (Mac) while pressing `Enter` to open a link in a new tab.

## URL Type Labels

The command palette automatically adds colored labels to different URL types:

- **UNSECURE** (red) - For HTTP (non-secure) links
- **EMAIL** (yellow) - For mailto: links
- **PHONE** (green) - For tel: links
- **PROTOCOL** (blue) - For other common protocols (ftp, sms, spotify, steam, slack, etc.)

These labels help users identify the type of action before selecting it.

## Recent Items

The command palette can remember recently selected items and display them at the top of the list for quick access.

### Enabling Recent Items

To enable recent items, set the `maxRecentItems` property to the maximum number of recent items to keep:

```php
echo CommandPaletteWidget::widget([
    'maxRecentItems' => 5, // Keep up to 5 recent items (default: 0 = disabled)
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
        // More items...
    ],
]);
```

### How Recent Items Work

- When a user selects an item, it's automatically added to the recent items list
- Recent items are displayed at the top of the palette, separated from regular items by a horizontal line
- If an item is already in recent items and selected again, it moves to the top
- The list is limited to the maximum number specified in `maxRecentItems`
- Recent items are stored in the browser's localStorage and persist across sessions
- Recent items participate in search but duplicates are prevented (if an item appears in recent items, it won't appear again in the regular results)

### Data Storage and GDPR Compliance

**Important:** Recent items are stored in the user's browser using localStorage. If you enable this feature, you should inform your users about this data storage in accordance with privacy regulations (such as GDPR).

The data stored includes:
- Item name
- Item subtitle (if any)
- Item icon (if any)
- Item action (URL or function reference)

This data is stored locally on the user's device and is used solely for the technical purpose of improving user experience by providing quick access to frequently used commands.

Example privacy notice:

> "This application uses browser local storage to remember your recently used commands. This data is stored only on your device and is not transmitted to our servers. You can clear this data at any time by clearing your browser's local storage."

If privacy compliance is a concern, you can disable recent items by setting `maxRecentItems` to `0` (the default value).
