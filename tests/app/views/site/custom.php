<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Custom Styling';
?>

<div class="site-custom">
    <div class="body-content">
        <h2>Custom Styled Command Palette</h2>

        <p>Este ejemplo demuestra cómo personalizar la apariencia de la paleta de comandos usando variables CSS nativas
            (custom properties).</p>

        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Custom CSS con variables nativas</h3>
                <p>Puedes personalizar la apariencia de la paleta de comandos sobrescribiendo las variables CSS en tu
                    aplicación.</p>
                <pre class="bg-light p-3 rounded"><code>
:root {
    --cmdk-background-color: #1e293b;
    --cmdk-primary-color: #3b82f6;
    --cmdk-element-title-color: #f8fafc;
    --cmdk-element-background-color: #334155;
    --cmdk-element-subtitle-color: #94a3b8;
    --cmdk-border-radius: 8px;
    --cmdk-element-border-radius: 8px;
    --cmdk-input-border-radius: 6px;
}
                </code></pre>
            </div>
        </div>

        <div class="demo-section card my-4">
            <div class="card-body">
                <h3 class="card-title">Live Demo</h3>
                <p>Haz clic en el botón para abrir la paleta de comandos personalizada.</p>
                <button id="openCustomPalette" class="btn btn-primary">Open Custom Palette</button>
            </div>
        </div>
    </div>
</div>

<?php
// Registrar CSS usando variables nativas
$css = <<<CSS
.cmdk-main.cmdk-theme-custom {
    --cmdk-background-color: #1e293b;
    --cmdk-primary-color: #3b82f6;
    --cmdk-element-title-color: #f8fafc;
    --cmdk-element-background-color: #334155;
    --cmdk-element-subtitle-color: #94a3b8;
    --cmdk-border-radius: 8px;
    --cmdk-element-border-radius: 8px;
    --cmdk-input-border-radius: 6px;
}
.cmdk-search {
    color: #f8fafc;
}
.cmdk-search::placeholder {
    color: #94a3b8;
}
CSS;
$this->registerCss($css);

// Renderizar el widget sin clases personalizadas pero con locale español
echo CommandPaletteWidget::widget([
    'theme' => CommandPaletteWidget::THEME_CUSTOM, // Usar tema personalizado
    'items' => [
        [
            'icon' => '🚀',
            'name' => 'Getting Started',
            'subtitle' => 'Learn how to use the widget',
            'action' => new \yii\web\JsExpression('function() { alert("Getting Started"); }'),
        ],
        [
            'icon' => '📚',
            'name' => 'Documentation',
            'subtitle' => 'Read the documentation',
            'action' => new \yii\web\JsExpression('function() { alert("Documentation"); }'),
        ],
        [
            'icon' => '🎨',
            'name' => 'Themes',
            'subtitle' => 'Customize the appearance',
            'action' => new \yii\web\JsExpression('function() { alert("Themes"); }'),
        ],
        [
            'icon' => '🔧',
            'name' => 'Configuration',
            'subtitle' => 'Configure the widget',
            'action' => new \yii\web\JsExpression('function() { alert("Configuration"); }'),
        ],
    ],
    'locale' => 'es', // Usar locale español
]);
?>

<?php
// JS solo para abrir la paleta
$js = <<<JS
document.getElementById('openCustomPalette').addEventListener('click', function() {
    if (window.commandPalette_w0) {
        window.commandPalette_w0.open();
    }
});
JS;
$this->registerJs($js);
?>
