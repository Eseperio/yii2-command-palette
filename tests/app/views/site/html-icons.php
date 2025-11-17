<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - HTML Icons Example';

// Register FontAwesome CSS from CDN
$this->registerCssFile('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
?>

<div class="site-index">
    <div class="body-content">
        <h2>HTML Icons Example</h2>
        
        <p>This example demonstrates using HTML for icons in the Command Palette Widget, specifically with FontAwesome icons. Press <kbd>Ctrl</kbd>+<kbd>K</kbd> (or <kbd>⌘</kbd>+<kbd>K</kbd> on Mac) to open the command palette.</p>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Widget Configuration</h3>
                <pre class="bg-light p-3 rounded"><code>
// Include FontAwesome in your layout or view
$this->registerCssFile('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

echo CommandPaletteWidget::widget([
    'allowHtmlIcons' => true, // Enable HTML icons
    'items' => [
        [
            'icon' => '&lt;i class="fas fa-home"&gt;&lt;/i&gt;',
            'name' => 'Home',
            'subtitle' => 'Go to homepage',
            'action' => '/',
        ],
        [
            'icon' => '&lt;i class="fas fa-search"&gt;&lt;/i&gt;',
            'name' => 'Search on Google',
            'subtitle' => 'Open Google in a new tab',
            'action' => 'https://www.google.com',
        ],
        [
            'icon' => '&lt;i class="fas fa-user"&gt;&lt;/i&gt;',
            'name' => 'Profile',
            'subtitle' => 'View your profile',
            'action' => '/profile',
        ],
        [
            'icon' => '&lt;i class="fas fa-cog"&gt;&lt;/i&gt;',
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
                <p>Click the button below or use the keyboard shortcut to open the command palette with FontAwesome icons.</p>
                <button id="openPalette" class="btn btn-primary">Open Command Palette</button>
            </div>
        </div>
    </div>
</div>

<?php
// Render the command palette widget with HTML icons
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
            'name' => 'Search on Google',
            'subtitle' => 'Open Google in a new tab',
            'action' => 'https://www.google.com',
        ],
        [
            'icon' => '<i class="fas fa-user"></i>',
            'name' => 'Profile',
            'subtitle' => 'View your profile',
            'action' => '/profile',
        ],
        [
            'icon' => '<i class="fas fa-cog"></i>',
            'name' => 'Settings',
            'subtitle' => 'Application settings',
            'action' => new \yii\web\JsExpression('function() { alert("Settings"); }'),
        ],
        [
            'icon' => '<i class="fas fa-bell"></i>',
            'name' => 'Notifications',
            'subtitle' => 'View your notifications',
            'action' => '/notifications',
        ],
        [
            'icon' => '<i class="fas fa-envelope"></i>',
            'name' => 'Messages',
            'subtitle' => 'View your messages',
            'action' => '/messages',
        ],
        [
            'icon' => '<i class="fas fa-sign-out-alt"></i>',
            'name' => 'Logout',
            'subtitle' => 'Sign out of your account',
            'action' => '/logout',
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
