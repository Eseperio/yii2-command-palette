<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Basic Example';
?>

<div class="site-index">
    <div class="body-content">
        <h2>Basic Example</h2>
        
        <p>This is a basic example of the Command Palette Widget. Press <kbd>Ctrl</kbd>+<kbd>K</kbd> (or <kbd>⌘</kbd>+<kbd>K</kbd> on Mac) to open the command palette.</p>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Widget Configuration</h3>
                <pre class="bg-light p-3 rounded"><code>
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
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Live Demo</h3>
                <p>Click the button below or use the keyboard shortcut to open the command palette.</p>
                <button id="openPalette" class="btn btn-primary">Open Command Palette</button>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Navigation</h3>
                <ul>
                    <li><strong>Basic Example</strong></li>
                    <li><a href="/index.php?r=site/multiple">Multiple Palettes Example</a></li>
                    <li><a href="/index.php?r=site/custom">Custom Styled Example</a></li>
                    <li><a href="/index.php?r=site/html-icons">HTML Icons Example</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<?php
// Render the command palette widget with French locale
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
            'action' => new \yii\web\JsExpression('function() { alert("Settings"); }'),
        ],
    ],
    'locale' => 'fr', // Use French locale
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
