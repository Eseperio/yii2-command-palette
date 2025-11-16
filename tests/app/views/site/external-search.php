<?php

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'External Search - Command Palette Test';
?>

<div class="site-index">
    <h1>External Search Example</h1>
    
    <p>
        This example demonstrates the external search functionality of the Command Palette widget.
        Press <kbd>Ctrl+K</kbd> (or <kbd>Cmd+K</kbd> on Mac) to open the command palette.
    </p>
    
    <div class="alert alert-info">
        <strong>Try these searches:</strong>
        <ul>
            <li>Type "<strong>users john</strong>" and press Enter on the search suggestion</li>
            <li>Type "<strong>projects web</strong>" and press Enter on the search suggestion</li>
            <li>Type "<strong>documents report</strong>" and press Enter on the search suggestion</li>
        </ul>
        
        <p class="mb-0">
            <strong>Features:</strong>
        </p>
        <ul class="mb-0">
            <li>Search suggestions based on type matching (fuzzy)</li>
            <li>External API search with debouncing</li>
            <li>Loading state with animated placeholders</li>
            <li>Error handling</li>
            <li>Search mode with visual tag</li>
            <li>Press Backspace on empty search to exit search mode</li>
        </ul>
    </div>
    
    <div class="card mt-4">
        <div class="card-header">
            <h3>Local Navigation</h3>
        </div>
        <div class="card-body">
            <p>These items are available in the command palette along with external search:</p>
            <ul>
                <li>🏠 Home</li>
                <li>📊 Dashboard</li>
                <li>⚙️ Settings</li>
                <li>📝 Profile</li>
            </ul>
        </div>
    </div>
</div>

<?php
// Render the command palette with external search
echo CommandPaletteWidget::widget([
    'debug' => true,
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
            'subtitle' => 'View dashboard',
            'action' => '/site/index',
        ],
        [
            'icon' => '⚙️',
            'name' => 'Settings',
            'subtitle' => 'Application settings',
            'action' => '/site/custom',
        ],
        [
            'icon' => '📝',
            'name' => 'Profile',
            'subtitle' => 'View your profile',
            'action' => '/site/multiple',
        ],
    ],
    'searchEndpoint' => '/site/search',
    'searchTypes' => ['users', 'projects', 'documents'],
    'searchMinChars' => 2,
    'searchTimeout' => 300,
]);
?>
