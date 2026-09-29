# External Search

The Command Palette widget supports searching items from external API endpoints, allowing you to integrate dynamic search results from your application's backend.

## Configuration

Enable external search by providing the following configuration options:

```php
use eseperio\commandPalette\CommandPaletteWidget;

echo CommandPaletteWidget::widget([
    'items' => [
        // Your local navigation items
        [
            'icon' => '🏠',
            'name' => 'Home',
            'subtitle' => 'Go to homepage',
            'action' => '/',
        ],
        // ... more items
    ],
    
    // External search configuration
    'searchEndpoint' => '/api/search',           // Required: URL endpoint for search
    'searchTypes' => ['users', 'projects', 'documents'], // Required: Available search categories
    'searchMinChars' => 3,                        // Optional: Minimum characters (default: 3)
    'searchTimeout' => 300,                       // Optional: Debounce timeout in ms (default: 300)
    'searchAlwaysShowTypeSuggestions' => false,    // Optional: Show suggestions for every category (default: false)
]);
```

## Configuration Options

### searchEndpoint (string, required)

The API endpoint URL that will handle search requests. The endpoint will receive GET requests with the following parameters:

- `query` - The search query string
- `type` - The selected search category

Example: `/api/search?query=john&type=users`

### searchTypes (array, required)

An array of search type identifiers (strings) that users can search within. These should match the categories your backend supports.

Example: `['users', 'projects', 'documents', 'tasks']`

### searchMinChars (int, optional)

Minimum number of characters required before triggering an external search. Default: `3`

### searchTimeout (int, optional)

Debounce timeout in milliseconds before sending a search request. This prevents sending too many requests while the user is typing. Default: `300`

### searchAlwaysShowTypeSuggestions (bool, optional)

By default, a "Search {query} in {category}" suggestion is only shown when the typed term (fuzzy-)matches one of the configured `searchTypes`. When set to `true`, a suggestion is shown for **every** configured category instead, even if the typed term does not match any category name, as long as the number of predefined/action results currently matched is **3 or fewer**. This makes it easier to search a category when the local items don't have many matches, without cluttering the list when there are already plenty of results. Default: `false` (existing behavior is preserved).

## Endpoint Response Format

Your search endpoint must return a JSON array of items in the following format:

```json
[
    {
        "icon": "👤",
        "name": "John Doe",
        "subtitle": "john@example.com",
        "action": "/user/1"
    },
    {
        "icon": "👤",
        "name": "Jane Smith",
        "subtitle": "jane@example.com",
        "action": "/user/2"
    }
]
```

Each item should have:

- `icon` (string): An emoji, URL to image, or HTML (if allowHtmlIcons is enabled)
- `name` (string): The primary text to display
- `subtitle` (string, optional): Secondary text or description
- `action` (string): URL to navigate to when the item is selected

## Example Implementation

### Backend (PHP/Yii2)

```php
public function actionSearch()
{
    Yii::$app->response->format = Response::FORMAT_JSON;
    
    $query = Yii::$app->request->get('query', '');
    $type = Yii::$app->request->get('type', '');
    
    // Perform search based on type
    switch ($type) {
        case 'users':
            $results = User::find()
                ->where(['like', 'name', $query])
                ->limit(10)
                ->all();
            
            return array_map(function($user) {
                return [
                    'icon' => '👤',
                    'name' => $user->name,
                    'subtitle' => $user->email,
                    'action' => Url::to(['/user/view', 'id' => $user->id]),
                ];
            }, $results);
            
        case 'projects':
            $results = Project::find()
                ->where(['like', 'title', $query])
                ->limit(10)
                ->all();
            
            return array_map(function($project) {
                return [
                    'icon' => '📁',
                    'name' => $project->title,
                    'subtitle' => 'Status: ' . $project->status,
                    'action' => Url::to(['/project/view', 'id' => $project->id]),
                ];
            }, $results);
            
        default:
            return [];
    }
}
```

## How It Works

### 1. Type Matching

When a user types in the command palette, the widget checks if any word matches one of the configured search types using fuzzy matching (Levenshtein distance). 

For example, if `searchTypes = ['users', 'projects']` and the user types "user john", the word "user" will match the type "users".

### 2. Search Suggestions

When a type is matched, a search suggestion item appears:

```
🔍 Search "john" in users
   Press Enter to search in this category
```

If `searchAlwaysShowTypeSuggestions` is enabled and there are 3 or fewer predefined/action results for the current query, a suggestion is shown for every configured type instead of only the matched one, letting the user pick any category to search in even if the typed term doesn't match a category name.

### 3. Search Mode

When the user selects the search suggestion (by pressing Enter), the palette enters "search mode":

- A visual tag appears showing the active search type
- The search input is cleared (or pre-filled with the remaining query)
- External search is triggered as the user types
- Results are fetched from the API endpoint

### 4. Loading State

While waiting for results, three animated placeholder items are displayed with a gradient animation.

### 5. Error Handling

If the search request fails, an error message is displayed to the user:

```
⚠️ Search Error
   Failed to fetch results
```

### 6. Exiting Search Mode

Users can exit search mode by:

- Pressing Backspace when the search input is empty
- Clicking the × button on the search type tag

## Features

- **Fuzzy Type Matching**: Tolerant to typos (e.g., "usr" matches "users")
- **All-Category Suggestions**: Optionally show a suggestion for every category when few local results are found (`searchAlwaysShowTypeSuggestions`)
- **Debouncing**: Prevents excessive API calls while typing
- **Request Cancellation**: Automatically cancels previous requests when a new search is triggered
- **Loading State**: Provides visual feedback while searching
- **Error Handling**: Gracefully handles network errors and displays user-friendly messages
- **Search Mode UI**: Clear visual indication of active search with dismissable tag
- **Keyboard Navigation**: Full keyboard support for entering/exiting search mode

## Best Practices

1. **Implement pagination**: Limit results to 10-20 items per request
2. **Add authentication**: Ensure your search endpoint checks user permissions
3. **Validate input**: Sanitize and validate the search query on the backend
4. **Cache results**: Consider caching frequent searches to improve performance
5. **Add logging**: Log search queries for analytics and debugging
6. **Handle empty results**: Return an empty array when no results are found
7. **Set appropriate timeouts**: Adjust `searchTimeout` based on your API response time

## Security Considerations

- Always validate and sanitize search queries on the backend
- Implement proper authentication and authorization
- Use CSRF protection for POST requests if needed
- Limit the number of requests per user to prevent abuse
- Be careful with user-provided content in the `icon` field if HTML icons are enabled

## Example: Complete Implementation

See the test application in `tests/app/views/site/external-search.php` for a complete working example.
