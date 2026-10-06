# prompt-bar

Mod for Claude Code (console + Claude desktop). One plugin, mode picks itself by app.

| | Console | Desktop app |
| --- | --- | --- |
| Usage limits (5h, 7d) | footer | pills under prompt |
| Cache timer | footer (after 5 min idle) | pills under prompt (always) |
| Cache alert (toast + sound, 10 min before miss) | yes | yes |
| Model / effort pickers | above prompt | - |
| Side pane: message timer, Sessions, Resume, Compact, model, effort | yes | - |

- **Sessions** opens `/resume`. **Resume** sends `--resume` (console) and asks first when cache is already missed.
- **Compact** on cache miss: switches to Sonnet low, compacts, restores model + effort.
- Cache alert sound: `plugin/assets/cache-alert.mp3`. Toast + sound are Windows only; other systems get the in-app toast.

## Install

Needs the `claude` CLI.

```powershell
git clone https://github.com/Niedvin/prompt-bar
.\prompt-bar\install.ps1 -Repo Niedvin/prompt-bar
```

or by hand:

```
claude plugin marketplace add Niedvin/prompt-bar
claude plugin install prompt-bar@prompt-bar --scope user
```

Restart Claude Code and the desktop app.

## Auto-update

Add to `~/.claude/settings.json`:

```json
"extraKnownMarketplaces": {
  "prompt-bar": { "source": { "source": "github", "repo": "Niedvin/prompt-bar" }, "autoUpdate": true }
}
```

Updates are pulled only when `version` in `plugin/.claude-plugin/plugin.json` goes up.

## Uninstall

```powershell
.\install.ps1 -Uninstall
```

## Dev

`claude plugin validate plugin`, `claude plugin test plugin`. Notes for agents: [AGENTS.md](AGENTS.md).
