# prompt-bar

Claude Code mod. One plugin, mode by surface:

- **Console (terminal)**: full. Limits + cache timer in footer, model/effort pickers above prompt, side pane (timer, Sessions, Resume, Compact, model, effort).
- **Claude desktop**: lean. Limits + cache timer only, in footer under prompt (`SessionMode`). No pickers, no pane, no commands, no timer.

Switch: `isFull` (set by `enableFull`). Desktop app runs the CLI headless: `session.start` surface is `null`, app arrives later as `session.attach` `desktop`. So: start with terminal/other surface → full; attach `desktop` → lean. Never branch on `e.surface === 'desktop'` at start. Render hooks gate on their own `e.surface`.

## Layout

- `install.ps1` — installer. `.\install.ps1` / `-Uninstall` / `-WhatIf`. User scope, covers console + desktop.
- `.claude-plugin/marketplace.json` — marketplace `prompt-bar`, plugin at `./plugin`. Repo: github.com/Niedvin/prompt-bar (public).
- `plugin/.claude-plugin/plugin.json` — manifest. Bump version on every release (auto-update keys on it).
- `plugin/assets/cache-alert.mp3` — alert sound. Original `cache alert.mp3` in root is git-ignored.
- `plugin/hooks/register.tsx` — whole mod. `hooks.json` points to it.
- `plugin/types/index.d.ts` — `$.state` contract. New state key → declare here.
- `plugin/hooks/*.test.tsx` — tests. `claude plugin test plugin`, `claude plugin validate plugin`.
- `plugin/.claude-plugin/types/` — engine-generated, git-ignored. Never edit.

## Dev loop

- Edit here (not under `~/.claude`: protected path, bypass mode does not cover it).
- Hot reload: copy `plugin/hooks`, `plugin.json` to `~/.claude/dev-mods/<session-id>/prompt-bar/`.
- Ship: `.\install.ps1` (reinstalls), restart apps.
- Test installer without touching real config: set `CLAUDE_CONFIG_DIR` to a temp dir first.

## Pane (terminal, 24 cols)

Timer pinned top (rows 0..6). Bottom stack anchored down, order: Sessions, Resume, Compact (flat 1-row filled buttons), model, effort (bordered cards), 1 row gap between each.

- Change a block → update `STACK_ROWS` + `paneRows` offsets in `ui.render` Pane. Wheel hit-test uses them.
- Cells only: no half-row gap. Bordered buttons at 0 gap merged, at 1 gap too far, so flat filled buttons (user choice).
- **Sessions** = `/resume` slash command (session picker).
- **Resume** = submit prompt as user. Terminal: `--resume`. Other surfaces: `continue`. Before send: `cacheMinutes() === 0` (idle ≥ 1h, `CACHE_TTL_MS`) → `$.ui.ask` "Cache miss… continue?"; no → nothing sent.
- **Compact**: cache hit → effort low, `/compact`, effort back. Cache miss → model sonnet (skip if already), effort low, `/compact`, model + effort back.
- Cache hint: console hides it first 5 min idle (`CACHE_SHOW_BELOW`), desktop shows it always (chips). Then minutes left, then `⚠ Cache Miss`.
- Cache alert: `left <= ALERT_MIN` (10), once per idle period (`alerted` state). In-app toast + Windows toast + `cache-alert.mp3` via `powershell.exe` (`ALERT_PS`, env-passed text, no double quotes in it). `lastActive` persists in `activeAt` state, survives reload.

## Runtime files

- `~/.claude/mods/prompt-bar-limits.json` — limits shared between sessions.
- `~/.claude/mods/prompt-bar-debug.log` — event log (console only).

## Rules

- Back up before overwriting user-authored files (`~/.claude/.backups/`).
- Comments: one line, dated ` — YYYY-MM-DD`, only non-obvious why.
- UI text Ukrainian, code + comments English.

## Auto-update from GitHub

Published as marketplace `prompt-bar` (repo root has `.claude-plugin/marketplace.json`). Users: `.\install.ps1 -Repo Niedvin/prompt-bar`, then in `~/.claude/settings.json`:
`"extraKnownMarketplaces": { "prompt-bar": { "source": { "source": "github", "repo": "Niedvin/prompt-bar" }, "autoUpdate": true } }`

Release: bump `version` in `plugin.json`, commit, push. Installed copies pull it.
