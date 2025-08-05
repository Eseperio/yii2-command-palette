<?php

$params = [];

$config = [
    'id' => 'command-palette-test',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'aliases' => [
        '@vendor' => __DIR__ . '/../../../vendor',
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
        '@eseperio/commandPalette' => __DIR__ . '/../../../src',
    ],
    'components' => [
        // link assets
        'assetManager' => [
            'linkAssets' => true,
            'appendTimestamp' => true,
            'basePath' => __DIR__ . '/../assets',
        ],
        'request' => [
            'cookieValidationKey' => 'test-command-palette-widget',
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'yii\web\IdentityInterface',
            'enableAutoLogin' => true,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
            ],
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
    ];

}

return $config;
