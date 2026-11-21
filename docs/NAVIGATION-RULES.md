# Navigation rules: v0.11 guardrails

This is an original Tuna Browser security policy, not a reproduction of a third-party Pen.

- Only HTTPS destinations can be navigated in embedded tabs.
- Block local/loopback and common private IPv4 hosts, localhost, credentials in URLs, control characters and unsupported schemes.
- New tabs are capped at 20.
- Navigation and redirects use the same policy.
- Permission requests remain denied by default.
- Browser chrome IPC is only available to the trusted chrome window.

**Limitations:** hostname-based blocking is not DNS rebinding protection and does not cover all IP encodings, IPv6 ranges, proxy resolution, or subresource requests. Do not claim full SSRF or network isolation. Further hardening needs Electron session hooks, DNS checks and end-to-end tests.

Reference requested for design study: https://codepen.io/jh3y/pen/xbqmjgW. Its contents were not accessible for inspection, so no specific visual or behavioral rules from it are claimed as implemented.
