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
     * Displays a test page with external search functionality
     *
     * @return string
     */
    public function actionExternalSearch()
    {
        return $this->render('external-search');
    }
    
    /**
     * API endpoint for external search
     * 
     * @return array
     */
    public function actionSearch()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        
        $query = Yii::$app->request->get('query', '');
        $type = Yii::$app->request->get('type', '');
        
        // Simulate search delay
        usleep(500000); // 500ms
        
        // Sample data for different types
        $data = [
            'users' => [
                ['icon' => '👤', 'name' => 'John Doe', 'subtitle' => 'john@example.com', 'action' => '/user/1'],
                ['icon' => '👤', 'name' => 'Jane Smith', 'subtitle' => 'jane@example.com', 'action' => '/user/2'],
                ['icon' => '👤', 'name' => 'Bob Johnson', 'subtitle' => 'bob@example.com', 'action' => '/user/3'],
                ['icon' => '👤', 'name' => 'Alice Williams', 'subtitle' => 'alice@example.com', 'action' => '/user/4'],
                ['icon' => '👤', 'name' => 'Charlie Brown', 'subtitle' => 'charlie@example.com', 'action' => '/user/5'],
            ],
            'projects' => [
                ['icon' => '📁', 'name' => 'Website Redesign', 'subtitle' => 'Status: In Progress', 'action' => '/project/1'],
                ['icon' => '📁', 'name' => 'Mobile App', 'subtitle' => 'Status: Planning', 'action' => '/project/2'],
                ['icon' => '📁', 'name' => 'API Development', 'subtitle' => 'Status: Completed', 'action' => '/project/3'],
                ['icon' => '📁', 'name' => 'Database Migration', 'subtitle' => 'Status: In Progress', 'action' => '/project/4'],
                ['icon' => '📁', 'name' => 'Security Audit', 'subtitle' => 'Status: Pending', 'action' => '/project/5'],
            ],
            'documents' => [
                ['icon' => '📄', 'name' => 'User Manual', 'subtitle' => 'PDF • 2.5 MB', 'action' => '/doc/1'],
                ['icon' => '📄', 'name' => 'Technical Specification', 'subtitle' => 'PDF • 1.8 MB', 'action' => '/doc/2'],
                ['icon' => '📄', 'name' => 'Meeting Notes', 'subtitle' => 'DOCX • 0.5 MB', 'action' => '/doc/3'],
                ['icon' => '📄', 'name' => 'Project Proposal', 'subtitle' => 'PDF • 3.2 MB', 'action' => '/doc/4'],
                ['icon' => '📄', 'name' => 'Budget Report', 'subtitle' => 'XLSX • 0.8 MB', 'action' => '/doc/5'],
            ],
        ];
        
        // Get the data for the specified type
        $results = isset($data[$type]) ? $data[$type] : [];
        
        // Filter by query
        if (!empty($query)) {
            $query = strtolower($query);
            $results = array_filter($results, function($item) use ($query) {
                return stripos($item['name'], $query) !== false || 
                       stripos($item['subtitle'], $query) !== false;
            });
        }
        
        // Return as array (re-index)
        return array_values($results);
    }
}
