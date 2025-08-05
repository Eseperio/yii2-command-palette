<?php

namespace eseperio\commandPalette\assets;

use yii\web\AssetBundle;

/**
 * Asset bundle for the Command Palette widget
 */
class CommandPaletteAsset extends AssetBundle
{
    /**
     * @var string The directory that contains the source asset files for this asset bundle
     */
    public $sourcePath = __DIR__ . '/dist';

    /**
     * @var array List of CSS files that this bundle contains
     */
    public $css = [
        'css/palette.min.css',
    ];

    /**
     * @var array List of JavaScript files that this bundle contains
     */
    public $js = [
        'js/palette.min.js',
    ];

    /**
     * @var array List of bundle class names that this bundle depends on
     */
    public $depends = [
        'yii\web\YiiAsset',
    ];

}
