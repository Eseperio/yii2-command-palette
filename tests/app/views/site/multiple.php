<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Multiple Instances';
?>

<div class="site-multiple">
    <div class="body-content">
        <h2>Multiple Command Palettes</h2>
        
        <p>This example demonstrates how to use multiple command palette widgets on the same page. Each palette has its own unique ID and can be opened independently.</p>
        
        <div class="demo-section">
            <h3>First Palette - Navigation</h3>
            <p>This palette contains navigation items.</p>
            <button id="openPalette1" style="padding: 8px 16px; background-color: #7c3aed; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Navigation Palette</button>
            
            <?php
            // Render the first command palette widget
            echo CommandPaletteWidget::widget([
                'items' => [
                    [
                        'icon' => '🏠',
                        'name' => 'Home',
                        'subtitle' => 'Go to homepage',
                        'action' => '/',
                    ],
                    [
                        'icon' => '📊',
                        'name' => 'Dashboard',
                        'subtitle' => 'View your dashboard',
                        'action' => '/dashboard',
                    ],
                    [
                        'icon' => '📝',
                        'name' => 'Blog',
                        'subtitle' => 'Read our blog',
                        'action' => '/blog',
                    ],
                    [
                        'icon' => '📞',
                        'name' => 'Contact',
                        'subtitle' => 'Get in touch with us',
                        'action' => '/contact',
                    ],
                ],
            ]);
            ?>
        </div>
        
        <div class="demo-section">
            <h3>Second Palette - Actions</h3>
            <p>This palette contains action items.</p>
            <button id="openPalette2" style="padding: 8px 16px; background-color: #0ea5e9; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Actions Palette</button>
            
            <?php
            // Render the second command palette widget
            echo CommandPaletteWidget::widget([
                'items' => [
                    [
                        'icon' => '🔍',
                        'name' => 'Search',
                        'subtitle' => 'Search for content',
                        'action' => 'javascript:alert("Search")',
                    ],
                    [
                        'icon' => '➕',
                        'name' => 'Create New',
                        'subtitle' => 'Create a new item',
                        'action' => 'javascript:alert("Create New")',
                    ],
                    [
                        'icon' => '📤',
                        'name' => 'Export',
                        'subtitle' => 'Export data',
                        'action' => 'javascript:alert("Export")',
                    ],
                    [
                        'icon' => '🔄',
                        'name' => 'Refresh',
                        'subtitle' => 'Refresh the page',
                        'action' => 'javascript:location.reload()',
                    ],
                ],
            ]);
            ?>
        </div>
        
        <div class="demo-section">
            <h3>Third Palette - External Links</h3>
            <p>This palette contains external links.</p>
            <button id="openPalette3" style="padding: 8px 16px; background-color: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Links Palette</button>
            
            <?php
            // Render the third command palette widget
            echo CommandPaletteWidget::widget([
                'items' => [
                    [
                        'icon' => 'https://www.google.com/favicon.ico',
                        'name' => 'Google',
                        'subtitle' => 'Search the web',
                        'action' => 'https://www.google.com',
                    ],
                    [
                        'icon' => 'https://github.com/favicon.ico',
                        'name' => 'GitHub',
                        'subtitle' => 'Code hosting platform',
                        'action' => 'https://github.com',
                    ],
                    [
                        'icon' => 'https://www.yiiframework.com/favicon.ico',
                        'name' => 'Yii Framework',
                        'subtitle' => 'Official website',
                        'action' => 'https://www.yiiframework.com',
                    ],
                    [
                        'icon' => 'https://www.php.net/favicon.ico',
                        'name' => 'PHP',
                        'subtitle' => 'PHP language website',
                        'action' => 'https://www.php.net',
                    ],
                ],
            ]);
            ?>
        </div>
    </div>
</div>

<?php
$js = <<<JS
document.getElementById('openPalette1').addEventListener('click', function() {
    if (window.commandPalette_w0) {
        window.commandPalette_w0.open();
    }
});

document.getElementById('openPalette2').addEventListener('click', function() {
    if (window.commandPalette_w1) {
        window.commandPalette_w1.open();
    }
});

document.getElementById('openPalette3').addEventListener('click', function() {
    if (window.commandPalette_w2) {
        window.commandPalette_w2.open();
    }
});
JS;
$this->registerJs($js);
?>
