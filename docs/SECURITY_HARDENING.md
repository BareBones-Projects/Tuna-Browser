# v0.10.0 security baseline
- External navigation allows only HTTP/HTTPS, disallows embedded URL credentials, and limits address length.
- Electron shell uses context isolation, sandbox, disabled Node integration, disabled webviews, and denied permission checks/requests.
- New windows are denied in the Electron shell. Approved external links open in the system browser.
- This is a source-code baseline, **not** a penetration test or independently audited privacy guarantee.
- Current release artifacts are unsigned; checksums in `SHA256SUMS.txt` are informational only. No signature verification or updater is implemented.
- TODO: dependency audit, threat model, OS CI builds, updater verification, protocol abuse tests, actual browser tab architecture, vault implementation.
- The renderer uses a restrictive CSP; the URL policy accepts HTTPS only. Verify these controls when changing renderer resources or URL handling.
