# Tuna Browser keyboard shortcuts

Open **System → Keyboard shortcuts** to review, edit, or reset shortcuts.

The page lists each command's purpose on the left and its assigned key combination with an **Edit** button on the right. Select **Edit**, press a new shortcut, and it saves to the browser's local preferences. Duplicate and reserved shortcuts are rejected. **↺** resets a single command; **Reset all to defaults** restores the entire list.

On Windows/Linux, **Mod** means **Ctrl**. On macOS, **Mod** means **Command (⌘)**. Some desktop environments reserve shortcuts that Tuna cannot override.

| Category | Command | Default | Purpose |
|---|---|---|---|
| Tabs | New tab | Mod+T | Open a blank browser tab |
| Tabs | Close tab | Mod+W | Close active tab |
| Tabs | Reopen closed tab | Mod+Shift+T | Restore the most recently closed HTTPS page |
| Tabs | Next tab | Mod+PageDown | Switch right |
| Tabs | Previous tab | Mod+PageUp | Switch left |
| Navigation | Focus address bar | Mod+L | Select address or enter search |
| Navigation | Reload | Mod+R | Reload active page |
| Navigation | Reload without cache | Mod+Shift+R | Reload bypassing cache |
| Navigation | Stop loading | Escape | Stop page loading |
| Navigation | Back | Alt+Left | Navigate backward |
| Navigation | Forward | Alt+Right | Navigate forward |
| Bookmarks | Bookmark page | Mod+D | Save current page |
| Bookmarks | Toggle bookmarks bar | Mod+Shift+B | Show or hide bar |
| System | Preferences | Mod+, | Open system settings |
| System | Keyboard shortcuts | Mod+Shift+, | Edit key bindings |
| System | Extensions | Mod+Shift+E | View installed extensions |
| Tools | Developer tools | Mod+Shift+I | Toggle devtools |
| Tools | Copy page URL | Mod+Shift+C | Copy current URL |
| Tools | Find on page | Mod+F | Search page text |
| View | Zoom in | Mod+= | Increase zoom |
| View | Zoom out | Mod+- | Decrease zoom |
| View | Reset zoom | Mod+0 | Return to 100% |

Shortcuts are stored in `browser-preferences.json` under the app's user-data directory. They are not synchronized with Remedy Launcher. No theme or wallpaper styling was changed for this feature.

**Alpha limitations:** shortcut behavior needs Electron integration testing across Windows, macOS, and Linux. Some OS-reserved combinations cannot be intercepted. This feature does not create system-wide global hotkeys.
