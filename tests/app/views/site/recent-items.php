<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Recent Items Example';
?>

<div class="site-index">
    <div class="body-content">
        <h2>Recent Items Example</h2>
        
        <p>This example demonstrates the recent items feature. Press <kbd>Ctrl</kbd>+<kbd>K</kbd> (or <kbd>⌘</kbd>+<kbd>K</kbd> on Mac) to open the command palette.</p>
        
        <div class="alert alert-info">
            <strong>How to test:</strong>
            <ol>
                <li>Open the command palette (Ctrl+K or Cmd+K)</li>
                <li>Select a few different items</li>
                <li>Open the palette again - you'll see your recently selected items at the top!</li>
                <li>The most recently selected item appears first</li>
                <li>Recent items are separated from regular items by a horizontal line</li>
            </ol>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Widget Configuration</h3>
                <pre class="bg-light p-3 rounded"><code>
echo CommandPaletteWidget::widget([
    'maxRecentItems' => 5, // Keep up to 5 recent items
    'debug' => true, // Enable debug mode to see console logs
    'items' => [
        // Items configuration...
    ],
]);
                </code></pre>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Live Demo</h3>
                <p>Click the button below or use the keyboard shortcut to open the command palette.</p>
                <button id="openPalette" class="btn btn-primary">Open Command Palette</button>
                <button id="clearRecent" class="btn btn-danger ms-2">Clear Recent Items</button>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Features</h3>
                <ul>
                    <li><strong>Persistent Storage:</strong> Recent items are stored in localStorage and persist across page reloads</li>
                    <li><strong>Smart Deduplication:</strong> Items don't appear twice in the list</li>
                    <li><strong>Search Integration:</strong> Search works across both recent and regular items</li>
                    <li><strong>Most Recent First:</strong> Items are ordered by most recently used</li>
                </ul>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Navigation</h3>
                <ul>
                    <li><a href="/index.php?r=site/index">Basic Example</a></li>
                    <li><a href="/index.php?r=site/multiple">Multiple Palettes Example</a></li>
                    <li><a href="/index.php?r=site/custom">Custom Styled Example</a></li>
                    <li><a href="/index.php?r=site/html-icons">HTML Icons Example</a></li>
                    <li><a href="/index.php?r=site/url-labels">URL Labels Example</a></li>
                    <li><strong>Recent Items Example</strong></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<?php
// Render the command palette widget with recent items enabled
echo CommandPaletteWidget::widget([
    'maxRecentItems' => 5, // Keep up to 5 recent items
    'debug' => true, // Enable debug mode
    'items' => [
        [
            'icon' => '🏠',
            'name' => 'Home',
            'subtitle' => 'Go to homepage',
            'action' => '/index.php?r=site/index',
        ],
        [
            'icon' => '🔍',
            'name' => 'Search on Google',
            'subtitle' => 'Open Google in a new tab',
            'action' => 'https://www.google.com',
        ],
        [
            'icon' => '👤',
            'name' => 'Profile',
            'subtitle' => 'View your profile',
            'action' => '#profile',
        ],
        [
            'icon' => '⚙️',
            'name' => 'Settings',
            'subtitle' => 'Application settings',
            'action' => new \yii\web\JsExpression('function() { alert("Settings"); }'),
        ],
        [
            'icon' => '📊',
            'name' => 'Reports',
            'subtitle' => 'View reports',
            'action' => '#reports',
        ],
        [
            'icon' => '📧',
            'name' => 'Messages',
            'subtitle' => 'View your messages',
            'action' => '#messages',
        ],
        [
            'icon' => '📱',
            'name' => 'Mobile App',
            'subtitle' => 'Download mobile app',
            'action' => '#mobile',
        ],
        [
            'icon' => '🔔',
            'name' => 'Notifications',
            'subtitle' => 'View notifications',
            'action' => '#notifications',
        ],
        [
            'icon' => '💼',
            'name' => 'Projects',
            'subtitle' => 'View your projects',
            'action' => '#projects',
        ],
        [
            'icon' => '📅',
            'name' => 'Calendar',
            'subtitle' => 'View calendar',
            'action' => '#calendar',
        ],
    ],
]);
?>

<?php
$js = <<<JS
document.getElementById('openPalette').addEventListener('click', function() {
    if (window.commandPalette_w0) {
        window.commandPalette_w0.open();
    }
});

document.getElementById('clearRecent').addEventListener('click', function() {
    if (window.commandPalette_w0) {
        localStorage.removeItem(window.commandPalette_w0.getRecentItemsKey());
        alert('Recent items cleared! Open the palette to see the change.');
    }
});
JS;
$this->registerJs($js);
?>
