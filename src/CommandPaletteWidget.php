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
     *     'icon' => '🔍', // Emoji, URL to an image, or HTML (if allowHtmlIcons is true)
     *     'name' => 'Search on Google', // Item name
     *     'subtitle' => 'Open Google in a new tab', // Optional subtitle
     *     'action' => 'function', // Function, URL or JsExpression
     *     'visible' => true // Optional, whether the item should be displayed (default: true)
     * ]
     * 
     * For JavaScript actions, use \yii\web\JsExpression:
     * 'action' => new \yii\web\JsExpression('function() { alert("Hello!"); }')
     */
    public $items = [];

    /**
     * @var bool Whether to allow HTML in icons.
     * If true, the icon content will be rendered as HTML, allowing the use of
     * custom HTML like FontAwesome icons: '<i class="fas fa-search"></i>'
     * Note: Be careful with user-provided content to avoid XSS vulnerabilities.
     */
    public $allowHtmlIcons = false;
    
    /**
     * @var bool Whether to enable debug mode.
     * If true, debug messages will be logged to the console.
     * If null, it will default to YII_DEBUG constant value.
     */
    public $debug = null;
    
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
     * @var string|null URL endpoint for external search. If provided, enables external search functionality.
     * The endpoint should accept a GET request with 'query' and 'type' parameters and return JSON:
     * [
     *     {
     *         'icon' => '🔍',
     *         'name' => 'Result name',
     *         'subtitle' => 'Result description',
     *         'action' => '/url/to/result'
     *     },
     *     // ...
     * ]
     */
    public $searchEndpoint = null;

    /**
     * @var array|null Array of search types/categories available for external search.
     * Each type is a string that users can match to trigger category-specific searches.
     * Example: ['users', 'projects', 'documents']
     */
    public $searchTypes = null;

    /**
     * @var int Minimum number of characters required to trigger external search (default: 3)
     */
    public $searchMinChars = 3;

    /**
     * @var int Debounce timeout in milliseconds before triggering external search (default: 300)
     */
    public $searchTimeout = 300;

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();
        $this->_id = $this->getId();
        
        // Default debug to YII_DEBUG if not explicitly set
        if ($this->debug === null) {
            $this->debug = YII_DEBUG;
        }
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
        
        // Filter items based on the 'visible' property
        $filteredItems = $this->filterVisibleItems($this->items);
        
        return $this->render('widget', [
            'id' => $this->_id,
            'items' => $filteredItems,
            'itemsJson' => Json::encode($filteredItems),
            'locale' => $locale,
            'theme' => $this->theme, // Pasar el tema a la vista
            'allowHtmlIcons' => $this->allowHtmlIcons, // Pass allowHtmlIcons to the view
            'debug' => $this->debug, // Pass debug to the view
        ]);
    }
    
    /**
     * Filters items based on the 'visible' property
     * Items with visible=false will be excluded from the result
     * If 'visible' is not set, the item will be included (default is true)
     * 
     * @param array $items The items to filter
     * @return array The filtered items
     */
    protected function filterVisibleItems($items)
    {
        return array_filter($items, function($item) {
            return !isset($item['visible']) || $item['visible'] !== false;
        });
    }

    /**
     * Registers the required assets
     */
    protected function registerAssets()
    {
        $view = $this->getView();
        CommandPaletteAsset::register($view);
        
        // Use application locale if not specified
        $locale = $this->locale ?: \Yii::$app->language;
        // Extract just the language code if it contains a country code (e.g., 'en-US' -> 'en')
        $locale = strtolower(substr($locale, 0, 2));
        
        // Filter items based on the 'visible' property
        $filteredItems = $this->filterVisibleItems($this->items);
        
        // Pass allowHtmlIcons to JavaScript
        $view->registerJs("window.cmdkAllowHtmlIcons_{$this->_id} = " . ($this->allowHtmlIcons ? 'true' : 'false') . ";", \yii\web\View::POS_HEAD);
        
        // Prepare external search configuration
        $externalSearchConfig = null;
        if ($this->searchEndpoint !== null) {
            $externalSearchConfig = [
                'endpoint' => $this->searchEndpoint,
                'types' => $this->searchTypes ?: [],
                'minChars' => $this->searchMinChars,
                'timeout' => $this->searchTimeout,
            ];
        }
        
        // Initialize the command palette with the filtered items, locale, debug mode, and external search config
        $debug = $this->debug ? 'true' : 'false';
        $externalSearchJson = $externalSearchConfig ? Json::encode($externalSearchConfig) : 'null';
        $js = "window.commandPalette_{$this->_id} = new CommandPalette('{$this->_id}', " . Json::encode(array_values($filteredItems)) . ", '{$locale}', {$debug}, {$externalSearchJson});";
        $view->registerJs($js);
    }
}
