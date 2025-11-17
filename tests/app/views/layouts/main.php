<?php

/* @var $this \yii\web\View */

/* @var $content string */

use yii\bootstrap5\Html;

// Define navigation items in one place
$navItems = [
    ['label' => 'Basic Example', 'url' => Yii::$app->homeUrl],
    ['label' => 'Multiple Palettes', 'url' => Yii::$app->urlManager->createUrl(['site/multiple'])],
    ['label' => 'Custom Styling', 'url' => Yii::$app->urlManager->createUrl(['site/custom'])],
    ['label' => 'HTML Icons', 'url' => Yii::$app->urlManager->createUrl(['site/html-icons'])],
    ['label' => 'URL Labels', 'url' => Yii::$app->urlManager->createUrl(['site/url-labels'])],
    ['label' => 'Links Scraper', 'url' => Yii::$app->urlManager->createUrl(['site/links-scraper'])],
];
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>" class="h-100">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <?php $this->registerCsrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <!-- Bootstrap 5 CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <?php $this->head() ?>
</head>
<body class="d-flex flex-column min-vh-100">
<?php $this->beginBody() ?>

<header class="bg-light py-3 mb-4 border-bottom">
    <div class="container">
        <h1 class="mb-3">Command Palette Widget Test</h1>
        <nav>
            <ul class="nav nav-pills">
                <?php foreach ($navItems as $item): ?>
                <li class="nav-item">
                    <a class="nav-link" href="<?= $item['url'] ?>"><?= $item['label'] ?></a>
                </li>
                <?php endforeach; ?>
            </ul>
        </nav>
    </div>
</header>

<main role="main" class="container flex-grow-1">
    <?= $content ?>
</main>

<footer class="footer mt-auto py-3 bg-light border-top">
    <div class="container">
        <div class="card">
            <div class="card-body">
                <p class="card-text text-muted mb-3">Command Palette Widget for Yii2 - Test Application</p>
                <nav>
                    <h6 class="mb-2">Navigation:</h6>
                    <ul class="nav nav-pills flex-column flex-sm-row">
                        <?php foreach ($navItems as $item): ?>
                        <li class="nav-item">
                            <a class="nav-link py-1 px-2" href="<?= $item['url'] ?>"><?= $item['label'] ?></a>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</footer>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
