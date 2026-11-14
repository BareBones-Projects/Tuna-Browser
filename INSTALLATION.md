# Installation

## TUNA BROWSER v0.10.0-alpha.1

## Development

```sh
npm install
npm run check
npm test
npm start
```

Electron and electron-builder must be installed via npm; CI builds require network access and OS-specific runners. Platform packaging commands are defined in `package.json`. No native installers have been built or verified here.

## Remedy Launcher bridge

- **DOWNLOAD HERE:** 

`--launcher-open https://example.com` and `tunabrowser://open?url=https%3A%2F%2Fexample.com` accept HTTPS only and open in an embedded tab. Browser tab data uses a persistent local Electron session; it is not private or anonymous. No vault, cookies, or credentials are exposed to Remedy Launcher. Protocol launches open the validated address immediately without a confirmation prompt; protocol registration depends on OS installation and user approval.


BareBones Projects, Designed by: Justin Levesque-Welsch
