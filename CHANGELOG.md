# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.2] - 2021-09-01

### Changed

- Use file extensions for dynamic imports (i.e. `import("./utils/parse.js")`)

### Fixed

- Fix `web-authn-login` FormData input name to use the `inputName` field.
- Fix `web-authn-registration` FormData input name to use the `inputName` field.
- Fix `web-authn-recovery` FormData input name to use the `inputName` field.
- Fix `web-authn-enrollment-requester` FormData input name to use the `inputName` field.

## [0.2.1] - 2021-09-01

### Added

- Documentation in the README for `web-authn-login` and `web-authn-registration` components
- LICENSE and README update for webcomponents.org

[unreleased]: https://github.com/TechWebAuthn/web-authn-components/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/TechWebAuthn/web-authn-components/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/TechWebAuthn/web-authn-components/releases/tag/v0.2.1
