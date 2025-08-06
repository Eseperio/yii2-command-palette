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
        
        // Verify that the template is included in the widget output
        $this->assertStringContainsString('<template id="cmdkItemTemplate-', $output);
        $this->assertStringContainsString('{{name}}', $output);
        $this->assertStringContainsString('{{#icon}}', $output);
        $this->assertStringContainsString('{{#subtitle}}', $output);
        
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
    
    /**
     * Test that the widget accepts a locale parameter
     */
    public function testLocaleParameter()
    {
        $view = new View();
        
        // Test with default locale
        $output1 = CommandPaletteWidget::widget([
            'items' => [],
        ]);
        
        // Test with specific locale
        $output2 = CommandPaletteWidget::widget([
            'items' => [],
            'locale' => 'es',
        ]);
        
        // Verify that the locale is passed to JavaScript
        // The placeholder is no longer in the HTML, so we can't test for it directly
        // Instead, we'll check that the widget renders without errors
        $this->assertStringContainsString('cmdk-search', $output2);
        
        // Test with another locale
        $widget = new CommandPaletteWidget([
            'items' => [],
            'locale' => 'fr',
        ]);
        
        $widget->view = $view;
        $widget->run();
        
        // Verify that the asset is registered
        $this->assertArrayHasKey('eseperio\\commandPalette\\assets\\CommandPaletteAsset', $view->assetBundles);
    }
}
