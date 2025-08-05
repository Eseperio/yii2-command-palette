<?php

// Define environment
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');

// Include Composer autoloader
require __DIR__ . '/../../../vendor/autoload.php';
require __DIR__ . '/../../../vendor/yiisoft/yii2/Yii.php';

// Load application configuration
$config = require __DIR__ . '/../config/web.php';

// Run application
(new yii\web\Application($config))->run();
