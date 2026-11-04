# v0.10.0 security baseline
- Embedded navigation allows only HTTPS, disallows embedded URL credentials, and limits address length.
- Electron shell uses context isolation, sandbox, disabled Node integration, disabled webviews, and denied permission checks/requests.
- Popup windows are denied; validated HTTPS popup destinations open as tabs, capped at 20. Main-frame navigation and redirects are limited to validated HTTPS URLs. Embedded tabs share a persistent local session. External protocol launches open without a confirmation prompt.
- This is a source-code baseline, **not** a penetration test or independently audited privacy guarantee.
- Current release artifacts are unsigned; checksums in `SHA256SUMS.txt` are informational only. No signature verification or updater is implemented. Protocol handler launches render validated addresses immediately without user confirmation. Embedded browser data is stored in a persistent local session and is not anonymous/private.
- TODO: dependency audit, threat model, OS CI builds, updater verification, protocol abuse tests, downloads, extensions, private mode, tab persistence, vault implementation.
- The renderer uses a restrictive CSP; the URL policy accepts HTTPS only. Verify these controls when changing renderer resources or URL handling.
