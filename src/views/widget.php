<?php
/**
 * @var $this yii\web\View
 * @var $id string The widget ID
 * @var $items array The items to be displayed
 * @var $itemsJson string The items as JSON string
 */

use yii\helpers\Html;
?>

<div class="cmdk-overlay" id="cmdkOverlay-<?= $id ?>"></div>
<div class="cmdk-panel" id="cmdkPanel-<?= $id ?>" tabindex="-1">
    <input class="cmdk-search" id="cmdkSearch-<?= $id ?>" placeholder="<?= Yii::t('app', 'Search...') ?>" autocomplete="off" />
    <ul class="cmdk-list" id="cmdkList-<?= $id ?>"></ul>
</div>

<?php
// Pass the items to JavaScript
$this->registerJs("window.cmdkItems_{$id} = {$itemsJson};", \yii\web\View::POS_HEAD);
?>
