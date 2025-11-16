- [ ] **Improve js debug:** add a param to choose whether enable or disable debug in js classes. Php widget will use
  YII_DEBUG value to set it by default, but user may override it when initializing the command palette. Then create a
  custom Logger.js class, which has methods like log, warn, error, info, etc. Each method will check if debug is
  enabled,
  and if so, will output the message to console, otherwise, it will do nothing. In addition, using variadic, will pass
  all params to console.log (or warn or whatever) but prepending a prefix to each message [CommandPalette]. This way,
  any message will be easily identifiable. Also as palette class is created, if debug is enabled, output to console a
  red text message indicating that command palette is initialized and debug mode is enabled, so user knows that debug is
  enabled.

- [ ] **Implement custom search endpoints**
    - User may provide an search endpoint url to enable this functionality.
    - User may also provide the types of items to search. It will be an array of strings, each string will be a key,
      that will be sent to endpoint to search for when selected.
    - Whenever user writes a sentence, if one of the words matches a type (partial or complete) the option "search "rest
      of sentence" in type" will be shown in results. I.e: user writes "proceeding new user registration", the word
      proceeding matches the type, so the action suggested is: Proceedings: search "new user registration". As you can
      see, we matched the type by similarity. As differ from normal command palette search, we match the category using
      levenshtein distance. In order to perform the search right, we need to keep track of the word that matched the
      type, so we can remove it from the search sentence when sending the request to endpoint.
    - When user selects the action suggested, the search box will be padded on left side and a tag will be added to the
      left of the search box indicating that user is not in searching mode for that type. Tag will have an "x" button to
      remove it and go back to normal command palette options. It will have a fixed width to avoid recalculation of
      padding for input. When user deletes completely the search box content, and press delete again, the tag will be
      removed.
    - Endpoints must return a JSON array in an specific format to be able to show results in command palette. Results
      must be an array of objects with the information needed by command palette.
    - While results are loading, three placeholders must be shown in command palette. Using an animated gradient
      background is recommended.
    - Handle errors when requesting endpoints, displaying a simple message to user while, if debug enabled, showing the
      error details in console.
    - Add a param to set the minimum length of characters to start searching. If less than that, do not start searching
      and show a message.
    - Add a param to set the timeout for triggering a request after user stops typing.
    - Ensure previous requests are cancelled when a new one is triggered.

- [ ] Implement recent items
    - Add a param to set the maximum number of recent items to keep in memory. Zero means disabled.
    - Whenever a user clicks on an item, add it to recent items list. Since it could be an item from a search, we will
      store the full item object, not just the key.
    - We use local storage to store recent items.
    - Since this option use storage in user computer, add a chapter in documentation explaining that if this is enabled,
      they must warn user as gdpr says (i think they only must acknowledge that they are storing data to the user with
      the purpose of technical reasons, but users do not have to give consent)
    - Recent items appear first in command palette options, then an hr is used to separate them from other options.
    - Recent items participate in local search, but duplicates must be prevented. I.e: if an item is in recent
      items, and user types something that matches that item, it must not be shown again in results.

- [ ] **Add links scrapper**
    - Add a param to whether enable this function. Default is disabled.
    - When debug is enabled, show a message in console indicating that links scrapper is enabled and how many links
      were found.
    - This will perform a search on all links visible on the page and generate items for command palette. For each link
      found, we will use the text of the link as title, and the url as action. If link has no text (i.e: an icon link),
      we will use the title attribute if available, otherwise, we will skip the link, and if debug enabled, show a
      message in console indicating that link was skipped due to missing text.
    - Using an additional param in widget, user may provide selector/s for elements to be excluded from scraping. If
      link is inside one of those elements, it will be skipped.
    - Prevent duplicates by checking if link is already in command palette items.
- [ ] **Warn about unsecure actions**: whenever a url is not http and not https, show a red label before title with text
  "unsecure". If link is mailto, show a yellow label with text "email". If link is tel, show a green label with text
  "phone".
- [ ] Handle new tab shortcuts
    - In some browsers, like chrome, when user presses ctrl (or cmd in mac) while clicking a link, it opens link in new
      tab. In order to support this, we need to listen for keydown and keyup events to know if ctrl/cmd is pressed or
      not. So when a user chooses an action pressing enter, if ctrl/cmd is pressed, open link in new tab.
