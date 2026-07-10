<#
.SYNOPSIS
  Build the TransNet frontend and deploy it to Hostinger over SSH.

.DESCRIPTION
  1. Runs a production Vite build with the correct VITE_API_BASE_URL baked in.
  2. Packages dist/ into a gzipped tarball (uses tar, built into Windows 10+).
  3. Uploads the tarball with scp and extracts it into the Hostinger web root
     over SSH, replacing the previous build.

  Requires the OpenSSH client (ssh/scp), which ships with Windows 10/11.
  Tip: add your SSH public key to Hostinger (hPanel > Advanced > SSH Access)
  to avoid being prompted for a password on every step.

.EXAMPLE
  ./deploy-hostinger.ps1 -SshUser u123456789 -SshHost 147.79.0.10

.EXAMPLE
  ./deploy-hostinger.ps1 -SshUser u123456789 -SshHost 147.79.0.10 `
      -RemotePath "domains/lightgray-alpaca-580456.hostingersite.com/public_html"
#>
[CmdletBinding()]
param(
    # Hostinger SSH username, e.g. u123456789 (hPanel > Advanced > SSH Access).
    [Parameter(Mandatory = $true)]
    [string]$SshUser,

    # Hostinger SSH host/IP, e.g. 147.79.0.10 (shown next to your SSH details).
    [Parameter(Mandatory = $true)]
    [string]$SshHost,

    # Hostinger SSH port (almost always 65002).
    [int]$SshPort = 65002,

    # Web root to deploy into, relative to the SSH home directory.
    # Primary domain is usually "public_html"; addon/subdomains use
    # "domains/<domain>/public_html".
    [string]$RemotePath = "public_html",

    # API base URL baked into the build. Must include the /api/v1 route prefix.
    [string]$ApiBaseUrl = "https://lightgray-alpaca-580456.hostingersite.com/api/v1",

    # Skip "npm run build" and deploy the existing dist/ as-is.
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

# Run from the frontend project folder (this script's location) regardless of cwd.
$FrontendDir = $PSScriptRoot
Set-Location $FrontendDir

# --- Safety: never rm -rf a home dir or root ---
$cleanRemote = $RemotePath.Trim().TrimEnd("/")
if ([string]::IsNullOrWhiteSpace($cleanRemote) -or $cleanRemote -in @("~", ".", "/", "*")) {
    throw "Unsafe RemotePath '$RemotePath'. Point it at your web root, e.g. 'public_html'."
}

$target = "${SshUser}@${SshHost}"
Write-Host "==> Deploying to $target : $cleanRemote (port $SshPort)" -ForegroundColor Cyan

# --- 1. Build ---
if (-not $SkipBuild) {
    Write-Host "==> Building with VITE_API_BASE_URL=$ApiBaseUrl" -ForegroundColor Cyan
    $env:VITE_API_BASE_URL = $ApiBaseUrl
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed (exit $LASTEXITCODE)." }
} else {
    Write-Host "==> Skipping build (using existing dist/)" -ForegroundColor Yellow
}

if (-not (Test-Path "dist/index.html")) {
    throw "dist/index.html not found - build did not produce output."
}

# --- 2. Package dist/ into a tarball (archive root = contents of dist/) ---
$tarball = Join-Path $FrontendDir "dist.tar.gz"
if (Test-Path $tarball) { Remove-Item $tarball -Force }
Write-Host "==> Packaging dist/ -> dist.tar.gz" -ForegroundColor Cyan
tar -czf $tarball -C dist .
if ($LASTEXITCODE -ne 0) { throw "tar packaging failed (exit $LASTEXITCODE)." }

# --- 3. Upload + extract over SSH ---
try {
    Write-Host "==> Uploading tarball via scp" -ForegroundColor Cyan
    scp -P $SshPort $tarball "${target}:~/tnsds-dist.tar.gz"
    if ($LASTEXITCODE -ne 0) { throw "scp upload failed (exit $LASTEXITCODE)." }

    # Clear only the fingerprinted assets/ dir (safe to regenerate), then extract
    # the new build over the top. index.html and .htaccess are overwritten.
    $remoteScript = @"
set -e
mkdir -p '$cleanRemote'
rm -rf '$cleanRemote/assets'
tar -xzf ~/tnsds-dist.tar.gz -C '$cleanRemote'
rm -f ~/tnsds-dist.tar.gz
echo 'Extracted build into $cleanRemote'
"@
    # Normalize to LF so the remote shell parses the heredoc-free script cleanly.
    $remoteScript = $remoteScript -replace "`r`n", "`n"

    Write-Host "==> Extracting build on server" -ForegroundColor Cyan
    ssh -p $SshPort $target $remoteScript
    if ($LASTEXITCODE -ne 0) { throw "Remote extraction failed (exit $LASTEXITCODE)." }
}
finally {
    if (Test-Path $tarball) { Remove-Item $tarball -Force }
}

Write-Host "==> Done. Frontend deployed to ${target}:${cleanRemote}" -ForegroundColor Green
Write-Host "    Visit https://lightgray-alpaca-580456.hostingersite.com/ and hard-refresh (Ctrl+F5)." -ForegroundColor Green
