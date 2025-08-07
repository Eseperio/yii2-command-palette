<?php

/* @var $this \yii\web\View */

/* @var $content string */

use yii\bootstrap5\Html;

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
                <li class="nav-item">
                    <a class="nav-link" href="<?= Yii::$app->homeUrl ?>">Basic Example</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="<?= Yii::$app->urlManager->createUrl(['site/multiple']) ?>">Multiple Palettes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="<?= Yii::$app->urlManager->createUrl(['site/custom']) ?>">Custom Styling</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="<?= Yii::$app->urlManager->createUrl(['site/html-icons']) ?>">HTML Icons</a>
                </li>
            </ul>
        </nav>
    </div>
</header>

<main role="main" class="container flex-grow-1">
    <?= $content ?>
</main>

<footer class="footer mt-auto py-3 bg-light border-top text-muted">
    <div class="container">
        <p class="mb-0">Command Palette Widget for Yii2 - Test Application</p>
    </div>
</footer>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
