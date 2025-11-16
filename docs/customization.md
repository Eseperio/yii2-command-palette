# Customization

## Customizing the Appearance

### Using CSS Variables

The command palette supports customization through CSS variables. You can set these variables in your own stylesheet to
customize the appearance:

```css
/* Custom command palette styles using CSS variables */
:root {
    /* Primary colors */
    --cmdk-primary-color: #3b82f6; /* Primary color (buttons, icons, focus) */
    --cmdk-background-color: #1e293b; /* Background color of the panel */

    /* Element colors */
    --cmdk-element-title-color: #f8fafc; /* Color of item titles */
    --cmdk-element-background-color: #334155; /* Background color for selected/hover items */
    --cmdk-element-subtitle-color: #94a3b8; /* Color of item subtitles */

    /* Spacing */
    --cmdk-element-padding: 12px 10px; /* Padding for items */
    --cmdk-element-margin: 0; /* Margin for the list */

    /* Border radius */
    --cmdk-border-radius: 8px; /* Border radius for the panel */
    --cmdk-element-border-radius: 6px; /* Border radius for items */
    --cmdk-input-border-radius: 6px; /* Border radius for the search input */
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

## Theme Support

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

## Customizing Keyboard Shortcuts

By default, the command palette opens with Ctrl+K (Windows/Linux) or Cmd+K (Mac). You can customize this shortcut by
specifying the `keyboardShortcuts` parameter:

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

## Language Support

The command palette supports 10 languages: English (default), Spanish, French, German, Italian, Portuguese, Russian,
Chinese (Simplified), Japanese, and Arabic.

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
