<#
.SYNOPSIS
  Installs the prompt-bar mod for Claude Code (user scope).
.DESCRIPTION
  One install serves both apps, the mod picks its mode by surface:
  console = full mod, Claude desktop = limits + cache timer under the prompt.
  Restart Claude Code / the desktop app afterwards.
  -Repo owner/name installs from a GitHub copy of this folder instead of the local one.
#>
[CmdletBinding(SupportsShouldProcess)]
param([switch]$Uninstall, [string]$Repo)

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
$Market = 'prompt-bar'
$Plugin = "prompt-bar@$Market"

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { throw 'claude CLI not found in PATH' }

function Invoke-Claude([string[]]$CliArgs) {
  Write-Host "> claude $($CliArgs -join ' ')"
  if ($PSCmdlet.ShouldProcess("claude $($CliArgs -join ' ')")) {
    & claude @CliArgs
    if ($LASTEXITCODE -ne 0) { throw "claude $($CliArgs -join ' ') failed ($LASTEXITCODE)" }
  }
}

$markets = (& claude plugin marketplace list --json 2>$null | ConvertFrom-Json)
$hasMarket = [bool]($markets | Where-Object { $_.name -eq $Market })
$plugins = (& claude plugin list --json 2>$null | ConvertFrom-Json)
$hasPlugin = [bool]($plugins | Where-Object { $_.id -eq $Plugin })

if ($Uninstall) {
  if ($hasPlugin) { Invoke-Claude @('plugin', 'uninstall', $Plugin, '--scope', 'user') }
  if ($hasMarket) { Invoke-Claude @('plugin', 'marketplace', 'remove', $Market) }
  if (-not $WhatIfPreference) { Write-Host 'prompt-bar removed.' }
  return
}

if (-not (Test-Path (Join-Path $Root 'plugin/.claude-plugin/plugin.json'))) { throw "plugin folder missing in $Root" }
Invoke-Claude @('plugin', 'validate', (Join-Path $Root 'plugin'))
if ($hasPlugin) { Invoke-Claude @('plugin', 'uninstall', $Plugin, '--scope', 'user') }
if ($hasMarket) { Invoke-Claude @('plugin', 'marketplace', 'remove', $Market) }
Invoke-Claude @('plugin', 'marketplace', 'add', $(if ($Repo) { $Repo } else { $Root }))
Invoke-Claude @('plugin', 'install', $Plugin, '--scope', 'user')
if (-not $WhatIfPreference) { Write-Host 'prompt-bar installed. Restart Claude Code and the desktop app.' }
