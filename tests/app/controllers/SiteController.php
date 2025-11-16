<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;

/**
 * Site controller for the test application
 */
class SiteController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::class,
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    /**
     * Displays homepage with command palette widget
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

    /**
     * Displays a test page with multiple command palette widgets
     *
     * @return string
     */
    public function actionMultiple()
    {
        return $this->render('multiple');
    }

    /**
     * Displays a test page with custom styled command palette
     *
     * @return string
     */
    public function actionCustom()
    {
        return $this->render('custom');
    }
    
    /**
     * Displays a test page with HTML icons (FontAwesome) in the command palette
     *
     * @return string
     */
    public function actionHtmlIcons()
    {
        return $this->render('html-icons');
    }
    
    /**
     * Displays a test page with URL type labels in the command palette
     *
     * @return string
     */
    public function actionUrlLabels()
    {
        return $this->render('url-labels');
    }
    
    /**
     * Displays a test page with links scraper feature in the command palette
     *
     * @return string
     */
    public function actionLinksScraper()
    {
        return $this->render('links-scraper');
    }
}
