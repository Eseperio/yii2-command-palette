<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Multiple Instances';
?>

<div class="site-multiple">
    <div class="body-content">
        <h2>Multiple Command Palettes</h2>
        
        <p>This example demonstrates how to use multiple command palette widgets on the same page. Each palette has its own unique ID and can be opened independently.</p>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">First Palette - Navigation</h3>
                <p>This palette contains navigation items.</p>
                <button id="openPalette1" class="btn btn-primary mb-3">Open Navigation Palette</button>

                <?php
                // Render the first command palette widget with German locale
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
                    'locale' => 'de', // Use German locale
                ]);
                ?>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Second Palette - Actions</h3>
                <p>This palette contains action items.</p>
                <button id="openPalette2" class="btn btn-info mb-3">Open Actions Palette</button>

                <?php
                // Render the second command palette widget with Italian locale
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
                    'locale' => 'it', // Use Italian locale
                ]);
                ?>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Third Palette - External Links</h3>
                <p>This palette contains external links.</p>
                <button id="openPalette3" class="btn btn-success mb-3">Open Links Palette</button>

                <?php
                // Render the third command palette widget with Russian locale
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
                    'locale' => 'ru', // Use Russian locale
                ]);
                ?>
            </div>
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
