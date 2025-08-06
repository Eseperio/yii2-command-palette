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
 * @property string $locale Locale for translations
 */
class CommandPaletteWidget extends Widget
{
    // Constantes para los temas
    const THEME_DEFAULT = 'default';
    const THEME_DARK = 'dark';
    const THEME_CUSTOM = 'custom';

    /**
     * @var array Items to be displayed in the command palette.
     * Each item should have the following structure:
     * [
     *     'icon' => '🔍', // Emoji or URL to an image
     *     'name' => 'Search on Google', // Item name
     *     'subtitle' => 'Open Google in a new tab', // Optional subtitle
     *     'action' => 'function' // Function, URL or JsExpression
     * ]
     * 
     * For JavaScript actions, use \yii\web\JsExpression:
     * 'action' => new \yii\web\JsExpression('function() { alert("Hello!"); }')
     */
    public $items = [];
    
    /**
     * @var string Locale for translations. If null, the application locale will be used.
     */
    public $locale = null;

    /**
     * @var string The ID of the widget
     */
    private $_id;

    /**
     * @var string Tema del widget. Puede ser 'default' o 'dark'.
     */
    public $theme = self::THEME_DEFAULT;

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
        
        // Use application locale if not specified
        $locale = $this->locale ?: \Yii::$app->language;
        // Extract just the language code if it contains a country code (e.g., 'en-US' -> 'en')
        $locale = strtolower(substr($locale, 0, 2));
        
        return $this->render('widget', [
            'id' => $this->_id,
            'items' => $this->items,
            'itemsJson' => Json::encode($this->items),
            'locale' => $locale,
            'theme' => $this->theme, // Pasar el tema a la vista
        ]);
    }

    /**
     * Registers the required assets
     */
    protected function registerAssets()
    {
        $view = $this->getView();
        $asset = CommandPaletteAsset::register($view);
        
        // Use application locale if not specified
        $locale = $this->locale ?: \Yii::$app->language;
        // Extract just the language code if it contains a country code (e.g., 'en-US' -> 'en')
        $locale = strtolower(substr($locale, 0, 2));
        
        // Initialize the command palette with the items and locale
        $js = "window.commandPalette_{$this->_id} = new CommandPalette('{$this->_id}', " . Json::encode($this->items) . ", '{$locale}');";
        $view->registerJs($js);
    }
}
