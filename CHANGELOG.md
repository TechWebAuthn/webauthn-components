# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Add unit tests

## [0.2.7] - 2021-09-18

### Fixed

- Import `parse.js` at top to prevent interruption of user activated event on iOS (#1)

## [0.2.6] - 2021-09-07

### Changed

- Repository and package name have changed from `web-authn-components` to `webauthn-components` in order maintain naming consistency within the ecosystem

## [0.2.5] - 2021-09-05

### Changed

- Emit error on unsupported platforms
- Added `rollup` bundler
- Use `window.customElements` instead of just `customElements`

### Fixed

- Prevent zombie credentials on unsupported platforms
- Wrap all critical code in try...catch blocks

## [0.2.3] - 2021-09-02

### Changed

- Remove live example for webcomponents.org (not usable on domain)
- Update `terser` devDependency to `v5.7.2`

### Fixed

- Fix typo for event names: 'canceled' -> 'cancelled'
- Handle difference between user cancellation and form clear after success on the `web-authn-rtc-enrollment-requester` component

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

---

## Diffs

- [unreleased] - https://github.com/TechWebAuthn/webauthn-components/compare/v0.2.7...HEAD
- [0.2.7] - https://github.com/TechWebAuthn/webauthn-components/compare/v0.2.7...v0.2.6
- [0.2.6] - https://github.com/TechWebAuthn/webauthn-components/compare/v0.2.6...v0.2.5
- [0.2.5] - https://github.com/TechWebAuthn/webauthn-components/compare/v0.2.5...v0.2.3
- [0.2.3] - https://github.com/TechWebAuthn/webauthn-components/compare/v0.2.3...v0.2.2
- [0.2.2] - https://github.com/TechWebAuthn/webauthn-components/compare/v0.2.1...v0.2.2
- [0.2.1] - https://github.com/TechWebAuthn/webauthn-components/releases/tag/v0.2.1
