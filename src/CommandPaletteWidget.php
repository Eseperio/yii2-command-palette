<?php

namespace eseperio\commandPalette;

use eseperio\commandPalette\assets\CommandPaletteAsset;
use yii\base\Widget;
use yii\helpers\Html;
use yii\helpers\Json;

/**
 * CommandPaletteWidget is a Yii2 widget that provides a floating command palette with fuzzy search.
 *
 * @property array $items Items to be displayed in the command palette
 */
class CommandPaletteWidget extends Widget
{
    /**
     * @var array Items to be displayed in the command palette.
     * Each item should have the following structure:
     * [
     *     'icon' => '🔍', // Emoji or URL to an image
     *     'name' => 'Search on Google', // Item name
     *     'subtitle' => 'Open Google in a new tab', // Optional subtitle
     *     'action' => 'function' // Function or URL
     * ]
     */
    public $items = [];

    /**
     * @var string The ID of the widget
     */
    private $_id;

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();
        $this->_id = $this->getId();
    }

    /**
     * {@inheritdoc}
     */
    public function run()
    {
        $this->registerAssets();
        
        return $this->render('widget', [
            'id' => $this->_id,
            'items' => $this->items,
            'itemsJson' => Json::encode($this->items),
        ]);
    }

    /**
     * Registers the required assets
     */
    protected function registerAssets()
    {
        $view = $this->getView();
        $asset = CommandPaletteAsset::register($view);
        
        // Initialize the command palette with the items
        $js = "window.commandPalette_{$this->_id} = new CommandPalette('{$this->_id}', " . Json::encode($this->items) . ");";
        $view->registerJs($js);
    }
}
