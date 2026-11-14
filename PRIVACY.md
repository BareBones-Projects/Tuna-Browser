# Privacy Notice (prototype)

**Last updated: November 3, 2026 · Version 0.10.0**

Tuna Browser is a local desktop prototype that validates HTTPS addresses and loads pages in embedded Electron tabs.

## Data and network behavior

The app does not intentionally transmit telemetry to Tuna project servers. When you open a page or search, the destination website receives network requests from the embedded browser and may collect data under its own terms. The app uses a persistent local Electron session, so site cookies and other web storage may remain on disk. Protocol launches may pass a URL to the app and open it immediately.

This notice describes the checked-in prototype and is not a guarantee that the operating system, dependencies, build environment, or destination websites transmit no data. The app does not include a control to clear site data. Treat local session data as persistent and do not use it for sensitive information.

## Security and privacy limits

The app does not provide anonymity, a VPN, Tor/onion support, anti-tracking, private browsing, encrypted storage, or a password vault. Interface concepts marked as planned are not implemented. No independent privacy or security audit has been completed. See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## Changes and contact

This notice may change as the project changes. For questions or privacy concerns, open an issue in the Tuna-Browser repository; do not include secrets or sensitive personal data.
