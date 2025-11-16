<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Links Scraper Example';
?>

<div class="site-index">
    <div class="body-content">
        <h2>Links Scraper Example</h2>
        
        <p>This example demonstrates the links scraper feature. Press <kbd>Ctrl</kbd>+<kbd>K</kbd> (or <kbd>⌘</kbd>+<kbd>K</kbd> on Mac) to open the command palette.</p>
        
        <p>The command palette will include all visible links on the page, along with the manually configured items.</p>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Sample Links</h3>
                <p>These links will be automatically scraped and added to the command palette:</p>
                <ul>
                    <li><a href="https://www.google.com">Search on Google</a></li>
                    <li><a href="https://www.github.com">Visit GitHub</a></li>
                    <li><a href="/index.php?r=site/index">Home Page</a></li>
                    <li><a href="/index.php?r=site/multiple">Multiple Palettes Example</a></li>
                    <li><a href="mailto:test@example.com">Send Email</a></li>
                    <li><a href="tel:+1234567890">Call Us</a></li>
                    <li><a href="#section1" title="Jump to Section 1">Section 1 (with title attribute)</a></li>
                </ul>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Excluded Links</h3>
                <p>These links are inside the navigation bar and will be excluded from scraping:</p>
                <div class="excluded-nav" id="main-navigation">
                    <ul>
                        <li><a href="/excluded1">Excluded Link 1</a></li>
                        <li><a href="/excluded2">Excluded Link 2</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Widget Configuration</h3>
                <pre class="bg-light p-3 rounded"><code>
echo CommandPaletteWidget::widget([
    'items' => [
        [
            'icon' => '🏠',
            'name' => 'Home (Manual)',
            'subtitle' => 'Manually configured item',
            'action' => '/',
        ],
        [
            'icon' => '⚙️',
            'name' => 'Settings (Manual)',
            'subtitle' => 'Manually configured item',
            'action' => '/settings',
        ],
    ],
    'enableLinksScraper' => true,
    'linkScraperExcludeSelectors' => ['#main-navigation', '.excluded-nav'],
    'debug' => true,
]);
                </code></pre>
            </div>
        </div>
        
        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">More Test Links</h3>
                <p>Additional links to test the scraper:</p>
                <ul>
                    <li><a href="http://unsecure.example.com">Unsecure HTTP Link</a></li>
                    <li><a href="https://secure.example.com">Secure HTTPS Link</a></li>
                    <li><a href="ftp://files.example.com">FTP Link</a></li>
                    <li><a href="javascript:void(0)" title="JavaScript Link">JS Link (with title)</a></li>
                    <li><a href="/duplicate-link">Duplicate Link 1</a></li>
                    <li><a href="/duplicate-link">Duplicate Link 2 (should be filtered)</a></li>
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
                    <li><strong>Links Scraper Example</strong></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<?php
// Render the command palette widget with links scraper enabled
echo CommandPaletteWidget::widget([
    'items' => [
        [
            'icon' => '🏠',
            'name' => 'Home (Manual)',
            'subtitle' => 'Manually configured item',
            'action' => '/',
        ],
        [
            'icon' => '⚙️',
            'name' => 'Settings (Manual)',
            'subtitle' => 'Manually configured item',
            'action' => '/settings',
        ],
    ],
    'enableLinksScraper' => true,
    'linkScraperExcludeSelectors' => ['#main-navigation', '.excluded-nav'],
    'debug' => true,
]);
?>
