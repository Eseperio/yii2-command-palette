<?php

/* @var $this yii\web\View */

use eseperio\commandPalette\CommandPaletteWidget;

$this->title = 'Command Palette Widget - Custom Styling';
?>

<div class="site-custom">
    <div class="body-content">
        <h2>Custom Styled Command Palette</h2>
        
        <p>Este ejemplo demuestra cómo personalizar la apariencia de la paleta de comandos usando variables CSS nativas (custom properties).</p>

        <div class="demo-section">
            <h3>Custom CSS con variables nativas</h3>
            <p>Puedes personalizar la apariencia de la paleta de comandos sobrescribiendo las variables CSS en tu aplicación.</p>
            <pre><code>
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
        
        <div class="demo-section">
            <h3>Live Demo</h3>
            <p>Haz clic en el botón para abrir la paleta de comandos personalizada.</p>
            <button id="openCustomPalette" style="padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Custom Palette</button>
        </div>
    </div>
</div>

<?php
// Registrar CSS usando variables nativas
$css = <<<CSS
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
.cmdk-search {
    color: #f8fafc;
}
.cmdk-search::placeholder {
    color: #94a3b8;
}
CSS;
$this->registerCss($css);

// Renderizar el widget sin clases personalizadas
echo CommandPaletteWidget::widget([
    'items' => [
        [
            'icon' => '🚀',
            'name' => 'Getting Started',
            'subtitle' => 'Learn how to use the widget',
            'action' => 'javascript:alert("Getting Started")',
        ],
        [
            'icon' => '📚',
            'name' => 'Documentation',
            'subtitle' => 'Read the documentation',
            'action' => 'javascript:alert("Documentation")',
        ],
        [
            'icon' => '🎨',
            'name' => 'Themes',
            'subtitle' => 'Customize the appearance',
            'action' => 'javascript:alert("Themes")',
        ],
        [
            'icon' => '🔧',
            'name' => 'Configuration',
            'subtitle' => 'Configure the widget',
            'action' => 'javascript:alert("Configuration")',
        ],
    ],
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
