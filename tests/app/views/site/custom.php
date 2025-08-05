<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Custom Styling';
?>

<div class="site-custom">
    <div class="body-content">
        <h2>Custom Styled Command Palette</h2>
        
        <p>This example demonstrates how to customize the appearance of the command palette with custom CSS.</p>
        
        <div class="demo-section">
            <h3>Custom CSS</h3>
            <p>You can customize the appearance of the command palette by adding custom CSS to your application.</p>
            <pre><code>
/* Custom command palette styles */
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

.cmdk-search::placeholder {
    color: #94a3b8;
}

.cmdk-item {
    color: #f8fafc;
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
            </code></pre>
        </div>
        
        <div class="demo-section">
            <h3>Live Demo</h3>
            <p>Click the button below to open the custom styled command palette.</p>
            <button id="openCustomPalette" style="padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Custom Palette</button>
        </div>
    </div>
</div>

<?php
// Add custom CSS for the command palette
$css = <<<CSS
/* Custom command palette styles */
.cmdk-overlay-custom {
    background: rgba(0, 0, 0, 0.7); /* Darker overlay */
}

.cmdk-panel-custom {
    background: #1e293b; /* Dark background */
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.cmdk-search-custom {
    background: #334155;
    border-color: #475569;
    color: #f8fafc;
}

.cmdk-search-custom:focus {
    border-color: #3b82f6;
    background: #334155;
}

.cmdk-search-custom::placeholder {
    color: #94a3b8;
}

.cmdk-item-custom {
    color: #f8fafc;
}

.cmdk-item-custom.selected,
.cmdk-item-custom:hover {
    background: #334155;
}

.cmdk-icon-custom {
    color: #3b82f6;
}

.cmdk-title-custom {
    color: #f8fafc;
}

.cmdk-subtitle-custom {
    color: #94a3b8;
}
CSS;
$this->registerCss($css);

// Render the command palette widget with custom classes
echo CommandPaletteWidget::widget([
    'items' => [
        [
            'icon' => '🚀',
            'name' => 'Getting Started',
            'subtitle' => 'Learn how to use the widget',
            'action' => 'javascript:alert("Getting Started")',
        ],
        [
            'icon' => '📚',
            'name' => 'Documentation',
            'subtitle' => 'Read the documentation',
            'action' => 'javascript:alert("Documentation")',
        ],
        [
            'icon' => '🎨',
            'name' => 'Themes',
            'subtitle' => 'Customize the appearance',
            'action' => 'javascript:alert("Themes")',
        ],
        [
            'icon' => '🔧',
            'name' => 'Configuration',
            'subtitle' => 'Configure the widget',
            'action' => 'javascript:alert("Configuration")',
        ],
    ],
]);
?>

<?php
// Add JavaScript to customize the command palette
$js = <<<JS
// Get the command palette elements
const overlay = document.getElementById('cmdkOverlay-w0');
const panel = document.getElementById('cmdkPanel-w0');
const search = document.getElementById('cmdkSearch-w0');
const list = document.getElementById('cmdkList-w0');
const items = list.querySelectorAll('.cmdk-item');

// Add custom classes
overlay.classList.add('cmdk-overlay-custom');
panel.classList.add('cmdk-panel-custom');
search.classList.add('cmdk-search-custom');

// Add custom classes to items
items.forEach(item => {
    item.classList.add('cmdk-item-custom');
    
    // Add custom classes to icon and content elements
    const icon = item.querySelector('.cmdk-icon');
    if (icon) {
        icon.classList.add('cmdk-icon-custom');
    }
    
    const title = item.querySelector('.cmdk-title');
    if (title) {
        title.classList.add('cmdk-title-custom');
    }
    
    const subtitle = item.querySelector('.cmdk-subtitle');
    if (subtitle) {
        subtitle.classList.add('cmdk-subtitle-custom');
    }
});

// Add click event to the button
document.getElementById('openCustomPalette').addEventListener('click', function() {
    if (window.commandPalette_w0) {
        window.commandPalette_w0.open();
    }
});
JS;
$this->registerJs($js);
?>
