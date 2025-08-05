<?php

/* @var $this \yii\web\View */
/* @var $content string */

use app\assets\AppAsset;
use yii\bootstrap5\Html;
use yii\bootstrap5\Nav;
use yii\bootstrap5\NavBar;

?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>" class="h-100">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <?php $this->registerCsrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.5;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .container {
            width: 100%;
            padding-right: 15px;
            padding-left: 15px;
            margin-right: auto;
            margin-left: auto;
        }
        .nav {
            display: flex;
            flex-wrap: wrap;
            padding-left: 0;
            margin-bottom: 0;
            list-style: none;
            gap: 1rem;
        }
        .nav-link {
            display: block;
            padding: 0.5rem 1rem;
            text-decoration: none;
            color: #007bff;
        }
        .nav-link:hover {
            color: #0056b3;
        }
        .footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e5e5;
            color: #777;
        }
        .demo-section {
            margin: 2rem 0;
            padding: 1rem;
            border: 1px solid #e5e5e5;
            border-radius: 0.25rem;
        }
        .demo-section h2 {
            margin-top: 0;
        }
        .demo-section pre {
            background-color: #f8f9fa;
            padding: 1rem;
            border-radius: 0.25rem;
            overflow: auto;
        }
    </style>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<header>
    <div class="container">
        <h1>Command Palette Widget Test</h1>
        <nav>
            <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link" href="<?= Yii::$app->homeUrl ?>">Basic Example</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="<?= Yii::$app->urlManager->createUrl(['site/multiple']) ?>">Multiple Palettes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="<?= Yii::$app->urlManager->createUrl(['site/custom']) ?>">Custom Styling</a>
                </li>
            </ul>
        </nav>
    </div>
</header>

<main role="main" class="container">
    <?= $content ?>
</main>

<footer class="footer">
    <div class="container">
        <p>Command Palette Widget for Yii2 - Test Application</p>
    </div>
</footer>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
