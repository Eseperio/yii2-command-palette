<?php

use eseperio\commandPalette\CommandPaletteWidget;
use yii\helpers\Html;

$this->title = 'URL Labels Example';
?>
<div class="site-index">
    <div class="body-content">
        <h2>URL Type Labels Example</h2>
        
        <p>
            This example demonstrates the URL type labels feature. Different types of URLs are automatically labeled:
        </p>
        
        <ul>
            <li><strong style="color: #ef4444;">UNSECURE</strong> (red) - For non-http/https URLs</li>
            <li><strong style="color: #f59e0b;">EMAIL</strong> (yellow) - For mailto: links</li>
            <li><strong style="color: #10b981;">PHONE</strong> (green) - For tel: links</li>
        </ul>
        
        <p>
            Press <kbd>Ctrl+K</kbd> (or <kbd>⌘+K</kbd> on Mac) to open the command palette and see the labels in action.
        </p>
        
        <?php
        echo CommandPaletteWidget::widget([
            'items' => [
                [
                    'icon' => '🏠',
                    'name' => 'Home (HTTPS)',
                    'subtitle' => 'Secure HTTPS link - no label',
                    'action' => 'https://example.com',
                ],
                [
                    'icon' => '🌐',
                    'name' => 'Website (HTTP)',
                    'subtitle' => 'Regular HTTP link - no label',
                    'action' => 'http://example.com',
                ],
                [
                    'icon' => '📧',
                    'name' => 'Contact Us',
                    'subtitle' => 'Send an email',
                    'action' => 'mailto:contact@example.com',
                ],
                [
                    'icon' => '📞',
                    'name' => 'Call Support',
                    'subtitle' => 'Call our support team',
                    'action' => 'tel:+1234567890',
                ],
                [
                    'icon' => '🔗',
                    'name' => 'FTP Server',
                    'subtitle' => 'Unsecure FTP protocol',
                    'action' => 'ftp://files.example.com',
                ],
                [
                    'icon' => '📱',
                    'name' => 'SMS Message',
                    'subtitle' => 'Send an SMS',
                    'action' => 'sms:+1234567890',
                ],
                [
                    'icon' => '💬',
                    'name' => 'Skype Call',
                    'subtitle' => 'Call via Skype',
                    'action' => 'skype:username?call',
                ],
                [
                    'icon' => '🎵',
                    'name' => 'Spotify Playlist',
                    'subtitle' => 'Open in Spotify',
                    'action' => 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M',
                ],
            ],
        ]);
        ?>
        
        <div class="mt-4">
            <h3>Widget Configuration</h3>
            <pre><code><?= Html::encode('echo CommandPaletteWidget::widget([
    \'items\' => [
        [
            \'icon\' => \'📧\',
            \'name\' => \'Contact Us\',
            \'subtitle\' => \'Send an email\',
            \'action\' => \'mailto:contact@example.com\',
        ],
        [
            \'icon\' => \'📞\',
            \'name\' => \'Call Support\',
            \'subtitle\' => \'Call our support team\',
            \'action\' => \'tel:+1234567890\',
        ],
        [
            \'icon\' => \'🔗\',
            \'name\' => \'FTP Server\',
            \'subtitle\' => \'Unsecure FTP protocol\',
            \'action\' => \'ftp://files.example.com\',
        ],
    ],
]);') ?></code></pre>
        </div>
        
        <div class="mt-4">
            <h3>Navigation</h3>
            <ul>
                <li><?= Html::a('Basic Example', ['/site/index']) ?></li>
                <li><?= Html::a('Multiple Palettes Example', ['/site/multiple']) ?></li>
                <li><?= Html::a('Custom Styled Example', ['/site/custom']) ?></li>
                <li><?= Html::a('HTML Icons Example', ['/site/html-icons']) ?></li>
                <li><strong>URL Labels Example</strong></li>
            </ul>
        </div>
    </div>
</div>
