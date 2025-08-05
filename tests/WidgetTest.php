<?php

namespace tests;

use Codeception\Test\Unit;
use eseperio\commandPalette\CommandPaletteWidget;
use yii\web\View;

/**
 * Functional tests for the Command Palette Widget
 */
class WidgetTest extends Unit
{
    /**
     * Test that the widget renders correctly
     */
    public function testWidgetRendering()
    {
        $view = new View();
        
        $items = [
            [
                'icon' => '🏠',
                'name' => 'Home',
                'subtitle' => 'Go to homepage',
                'action' => '/',
            ],
            [
                'icon' => '🔍',
                'name' => 'Search',
                'subtitle' => 'Search for content',
                'action' => 'javascript:alert("Search")',
            ],
        ];
        
        $output = CommandPaletteWidget::widget([
            'items' => $items,
        ]);
        
        // Verify that the widget output contains the necessary elements
        $this->assertStringContainsString('cmdk-overlay', $output);
        $this->assertStringContainsString('cmdk-panel', $output);
        $this->assertStringContainsString('cmdk-search', $output);
        $this->assertStringContainsString('cmdk-list', $output);
        
        // Verify that the items are passed to JavaScript
        $this->assertStringContainsString('window.cmdkItems_', $output);
    }
    
    /**
     * Test that the widget registers the required assets
     */
    public function testAssetRegistration()
    {
        $view = new View();
        
        $widget = new CommandPaletteWidget([
            'items' => [],
        ]);
        
        $widget->view = $view;
        $widget->run();
        
        // Verify that the asset is registered
        $this->assertArrayHasKey('eseperio\\commandPalette\\assets\\CommandPaletteAsset', $view->assetBundles);
    }
    
    /**
     * Test that the widget generates unique IDs for multiple instances
     */
    public function testMultipleWidgets()
    {
        $view = new View();
        
        $output1 = CommandPaletteWidget::widget([
            'items' => [],
        ]);
        
        $output2 = CommandPaletteWidget::widget([
            'items' => [],
        ]);
        
        // Verify that the widgets have different IDs
        $this->assertNotEquals($output1, $output2);
    }
}
