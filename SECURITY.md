# Security Policy

Tuna Browser 0.10.0 is a prototype URL launcher. It validates web addresses and opens HTTP(S) links in the system browser; it does not provide embedded browsing, Tor or onion-service connectivity, a VPN, anti-tracking, anonymity, encryption, or a password vault. No privacy or security guarantees are made. Features shown in the interface that are not implemented are not available.

Theme files are presentation-only and must not implement security-sensitive behavior, permissions, credential storage, or download enforcement. Report suspected vulnerabilities privately to the repository maintainers before public disclosure. Do not include secrets or personal data in reports. This policy describes the prototype and is not a substitute for an independent security audit.

## Security caveat

Embedded pages run in isolated Electron web contents with a persistent local session. This is not a privacy guarantee, VPN, Tor, anti-tracking, or zero-trace solution. All permission requests in the Electron shell are denied by default. Downloads, extensions, private mode, vault, and tab persistence are not implemented.
