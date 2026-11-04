# Privacy Notice (prototype)

**Last updated: November 3, 2026 · Version 0.10.0**

Tuna Browser is a local desktop prototype that validates an address and asks your operating system's default browser to open it. It does not provide embedded web browsing.

## Data and network behavior

The launcher does not intentionally collect or transmit personal information, telemetry, browsing history, or account data. A URL you choose to open is handed to your system browser, which may communicate with that website under its own privacy terms. Search text without a URL is sent as a query to DuckDuckGo through the system browser. The app's protocol handler may receive a URL from the operating system when invoked.

This notice describes the checked-in prototype and is not a guarantee that the operating system, dependencies, build environment, or destination websites transmit no data. Do not enter credentials or sensitive information into this prototype.

## Security and privacy limits

The app does not provide anonymity, a VPN, Tor/onion support, anti-tracking, private browsing, encrypted storage, or a password vault. Interface concepts marked as planned are not implemented. No independent privacy or security audit has been completed. See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## Changes and contact

This notice may change as the project changes. For questions or privacy concerns, open an issue in the Tuna-Browser repository; do not include secrets or sensitive personal data.
