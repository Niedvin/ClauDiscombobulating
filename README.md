# ClauDiscombobulating

Mod for Claude Code (console + Claude desktop). One plugin, mode picks itself by app.

| | Console | Desktop app |
| --- | --- | --- |
| Usage limits (5h, 7d) | footer | band above prompt |
| Cache timer | footer (after 5 min idle) | band above prompt (always) |
| Cache alert (toast + sound, 10 min before miss) | yes | yes |
| Model / effort pickers | above prompt | - |
| Side pane: message timer, Sessions, Resume, Compact, model, effort | yes | - |

- **Sessions** opens `/resume`. **Resume** sends `--resume` (console) and asks first when cache is already missed.
- **Compact** on cache miss: switches to Sonnet low, compacts, restores model + effort.
- Cache alert sound: `plugin/assets/cache-alert.mp3`. Toast + sound are Windows only; other systems get the in-app toast.

## Install

Needs the `claude` CLI. One line, nothing to clone.

**Windows** (PowerShell):

```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/Niedvin/ClauDiscombobulating/main/install.ps1)))
```

**macOS / Linux**:

```bash
curl -fsSL https://raw.githubusercontent.com/Niedvin/ClauDiscombobulating/main/install.sh | bash
```

Restart Claude Code and the desktop app.

### Why the script and not the two manual commands

- **Auto-update is on from the start.** The script writes the `autoUpdate` entry into `settings.json` for you. With the manual commands the mod never updates, until you edit that file by hand.
- **Safe reinstall.** An old copy is removed first, so rerunning the line repairs a broken install or switches an old one to the GitHub copy.
- **Your settings stay.** Only one key is touched. `settings.json` is copied to `.backups/` before each change.
- **One line to undo.** The same script with `-Uninstall` (Windows) or `--uninstall` (macOS / Linux) removes the plugin, the marketplace and the auto-update entry.
- **Same result on every system.** One source of truth, no copy-pasting JSON.

By hand (no auto-update):

```
claude plugin marketplace add Niedvin/ClauDiscombobulating
claude plugin install ClauDiscombobulating@ClauDiscombobulating --scope user
```

Updates are pulled only when `version` in `plugin/.claude-plugin/plugin.json` goes up.

## Uninstall

```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/Niedvin/ClauDiscombobulating/main/install.ps1))) -Uninstall
```

```bash
curl -fsSL https://raw.githubusercontent.com/Niedvin/ClauDiscombobulating/main/install.sh | bash -s -- --uninstall
```

## Dev

`claude plugin validate plugin`, `claude plugin test plugin`. Notes for agents: [AGENTS.md](AGENTS.md).
