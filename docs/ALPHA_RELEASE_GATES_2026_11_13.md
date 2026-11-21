# // Tuna-Browser alpha release gates

Date: 2026-11-13. Target default branch: `main`. Product area: Electron desktop.
Tracked source files: 72.

## Observed source state
- README: present
- Security policy: present
- GitHub workflow files: .github/workflows/alpha-build.yml, .github/workflows/defender-for-devops.yml, .github/workflows/docs-integrity.yml, .github/workflows/ossar.yml, .github/workflows/pr-checks.yml
- Test-like tracked files: tests/browser-preferences.test.js, tests/core.test.js, tests/navigation-guard.test.js

## Tasks before alpha
1. Document actual implementation separately from future features. Rewrite README with install, usage, architecture, security, supported versions, screenshots and known limitations.
2. Create or repair executable functional tests. Require passing CI and negative-path validation, not merely documentation lint.
3. Examine all inputs, secrets, permissions and dependency supply chain; record security blockers.
4. Build on a clean target machine and capture reproducible commands, exact versions and failure logs.
5. Package distributables with SHA-256 manifest, install/uninstall guide and release notes.
6. Review existing pull requests and conflicts against the observed default branch before merging.

## Evidence checklist
- [ ] Build/install logs attached
- [ ] CI checks passing
- [ ] Runtime smoke test with target platform and version
- [ ] Security/licensing approval
- [ ] Distribution manifest with hash
- [ ] README and preview reflect actual shipped functionality

Release state: **HOLD** pending evidence. This document is a source inventory, not a build or security certification.

BareBones Projects, Designed by: Justin Levesque-Welsch
