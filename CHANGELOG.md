# CHANGELOG

## [Unreleased]

- [+] Added external search functionality to search items from external API endpoints
  - New properties: `searchEndpoint`, `searchTypes`, `searchMinChars`, `searchTimeout`
  - Type matching with fuzzy search using Levenshtein distance
  - Search suggestions when query matches a configured type
  - Search mode with visual tag indicator
  - Loading state with animated gradient placeholders
  - Error handling with user-friendly messages
  - Request debouncing and cancellation
  - Backspace to exit search mode
- [+] Added new logger in js, enabled when YII_DEBUG is true, or if user sets CommandPalette::debug to true.
- [+] Improved docs by moving some of the information to docs folder
- [+] Added a label before option title if protocol is not https. It may show unsecure if it is httpd, or sms, whatsapp,
  ftp, phone, for others.

## [1.1.2]

- Discard keys to prevent object type in items

## [1.1.1]

- Improved action handling for urls. Removed support for SPA navigation. For projects requiring SPA navigation, use a
  different library.

## [1.1.0]

- Added support for custom html for icons in command items.
- Added support for 'visible' property in command items to conditionally display items.

## [1.0.0]

- First stable release of the command palette component.
