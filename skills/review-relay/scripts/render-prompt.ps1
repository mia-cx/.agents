#requires -Version 7
<#
.SYNOPSIS
  Render references/reviewer-prompt.md for one relay leg. PowerShell port of
  render-prompt.py, for hosts with no Python interpreter on PATH.

.DESCRIPTION
  Substitution is literal, so acceptance criteria and log entries containing /, &,
  \, or newlines survive it. Any value may be given as @PATH to read it from that
  file, which is how long fields ($RELAY_LOG, a plan file) stay out of argv.
  Fails loudly if any {{FIELD}} is left unfilled.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$PrUrl,
    [Parameter(Mandatory)][string]$Head,
    [Parameter(Mandatory)][string]$DiffTarget,
    [Parameter(Mandatory)][string]$AcceptanceCriteria,
    [Parameter(Mandatory)][string]$Environment,
    [Parameter(Mandatory)][string]$PriorLegs,
    [Parameter(Mandatory)][string]$Out,
    [switch]$Codex
)

$ErrorActionPreference = 'Stop'

# The line that keeps the codex leg read-only despite -s danger-full-access.
$codexPreamble = 'Do not invoke any skill or delegation tool, and do not spawn sub-agents. Review yourself; do not edit files.' + "`n`n"

function Resolve-Value([string]$value, [string]$field) {
    if ($value.StartsWith('@')) {
        $path = $value.Substring(1)
        if (-not (Test-Path -LiteralPath $path)) { throw "$field points at a missing file: $path" }
        return (Get-Content -LiteralPath $path -Raw)
    }
    return $value
}

$template = Join-Path (Split-Path -Parent (Split-Path -Parent $PSCommandPath)) 'references/reviewer-prompt.md'
$text = Get-Content -LiteralPath $template -Raw

$fields = [ordered]@{
    PR_URL              = Resolve-Value $PrUrl 'PR_URL'
    HEAD_SHA            = Resolve-Value $Head 'HEAD_SHA'
    DIFF_TARGET         = Resolve-Value $DiffTarget 'DIFF_TARGET'
    ACCEPTANCE_CRITERIA = Resolve-Value $AcceptanceCriteria 'ACCEPTANCE_CRITERIA'
    ENVIRONMENT         = Resolve-Value $Environment 'ENVIRONMENT'
    PRIOR_LEGS          = Resolve-Value $PriorLegs 'PRIOR_LEGS'
}

foreach ($name in $fields.Keys) {
    $value = ($fields[$name] -as [string]).TrimEnd()
    if ([string]::IsNullOrWhiteSpace($value)) { throw "$name resolved to nothing; refusing to send a prompt with a blank field." }
    $text = $text.Replace("{{$name}}", $value)
}

$leftover = [regex]::Matches($text, '\{\{[A-Z_]+\}\}') | ForEach-Object { $_.Value } | Select-Object -Unique
if ($leftover) { throw "unfilled fields remain: $($leftover -join ', ')" }

if ($Codex) { $text = $codexPreamble + $text }

Set-Content -LiteralPath $Out -Value $text -NoNewline
Write-Output $Out
