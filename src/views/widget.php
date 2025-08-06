<?php
/**
 * @var $this yii\web\View
 * @var $id string The widget ID
 * @var $items array The items to be displayed
 * @var $itemsJson string The items as JSON string
 * @var $locale string The locale for translations
 * @var $theme string The theme for the widget
 */

use yii\helpers\Html;
?>

<div class="cmdk-main cmdk-theme-<?= $theme ?>">
    <div class="cmdk-overlay" id="cmdkOverlay-<?= $id ?>"></div>
    <div class="cmdk-panel" id="cmdkPanel-<?= $id ?>" tabindex="-1">
        <input class="cmdk-search" id="cmdkSearch-<?= $id ?>" autocomplete="off" />
        <ul class="cmdk-list" id="cmdkList-<?= $id ?>"></ul>
    </div>

    <template id="cmdkItemTemplate-<?= $id ?>">
        <li class="cmdk-item" tabindex="-1" data-idx="{{idx}}">
            {{#icon}}
            <span class="cmdk-icon">{{icon}}</span>
            {{/icon}}
            <div class="cmdk-content">
                <span class="cmdk-title">{{name}}</span>
                {{#subtitle}}
                <span class="cmdk-subtitle">{{subtitle}}</span>
                {{/subtitle}}
            </div>
        </li>
    </template>
</div>

<?php
// Pass the items to JavaScript
$this->registerJs("window.cmdkItems_{$id} = {$itemsJson};", \yii\web\View::POS_HEAD);
?>
