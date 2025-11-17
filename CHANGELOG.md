# CHANGELOG

## [Unreleased]

## [1.2.0]

- [+] Added link scrapper to automatically detect links in page, with support for excluding areas of the page via
  selectors.
- [+] Added recent items support, storing recent selected items in local storage and displaying them in the dropdown
  first.
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
