<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Basic Example';
?>

<div class="site-index">
    <div class="body-content">
        <h2>Basic Example</h2>
        
        <p>This is a basic example of the Command Palette Widget. Press <kbd>Ctrl</kbd>+<kbd>K</kbd> (or <kbd>⌘</kbd>+<kbd>K</kbd> on Mac) to open the command palette.</p>
        
        <div class="demo-section">
            <h3>Widget Configuration</h3>
            <pre><code>
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
            'name' => 'Search on Google',
            'subtitle' => 'Open Google in a new tab',
            'action' => 'https://www.google.com',
        ],
        [
            'icon' => '👤',
            'name' => 'Profile',
            'subtitle' => 'View your profile',
            'action' => '/profile',
        ],
        [
            'icon' => '⚙️',
            'name' => 'Settings',
            'subtitle' => 'Application settings',
            'action' => 'javascript:alert("Settings")',
        ],
    ],
]);
            </code></pre>
        </div>
        
        <div class="demo-section">
            <h3>Live Demo</h3>
            <p>Click the button below or use the keyboard shortcut to open the command palette.</p>
            <button id="openPalette" style="padding: 8px 16px; background-color: #7c3aed; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Command Palette</button>
        </div>
    </div>
</div>

<?php
// Render the command palette widget
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
            'name' => 'Search on Google',
            'subtitle' => 'Open Google in a new tab',
            'action' => 'https://www.google.com',
        ],
        [
            'icon' => '👤',
            'name' => 'Profile',
            'subtitle' => 'View your profile',
            'action' => '/profile',
        ],
        [
            'icon' => '⚙️',
            'name' => 'Settings',
            'subtitle' => 'Application settings',
            'action' => 'javascript:alert("Settings")',
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
JS;
$this->registerJs($js);
?>
