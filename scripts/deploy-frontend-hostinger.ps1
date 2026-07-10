# Production deploy: Hostinger frontend (SCP) + Railway API (git push).
#
# Order:
#   1. npm run build
#   2. SCP dist/ -> Hostinger public_html  (updates the live website immediately)
#   3. git push origin                     (Railway auto-redeploys the API from GitHub)
#
# Usage:
#   .\scripts\deploy-frontend-hostinger.ps1
#   .\scripts\deploy-frontend-hostinger.ps1 -ApiBaseUrl "https://xxx.up.railway.app/api/v1"
#   .\scripts\deploy-frontend-hostinger.ps1 -SkipGitPush   # frontend only
#   .\scripts\deploy-frontend-hostinger.ps1 -SkipBuild     # deploy existing dist/ as-is
#
# Auth options for Hostinger upload (first match wins):
#   1. -IdentityFile path to private key (recommended once added in Hostinger hPanel)
#   2. $env:HOSTINGER_SSH_PASSWORD for PuTTY pscp/plink non-interactive upload
#   3. OpenSSH scp/ssh (prompts for password if no key)

param(
    [string]$RemotePath = "/home/u910121167/websites/BPHA9w6A6/public_html",
    [string]$ApiBaseUrl = "https://tnsds-production.up.railway.app/api/v1",
    [string]$SshUser = "u910121167_BPHA9w6A6",
    [string]$SshHost = "82.25.100.95",
    [int]$SshPort = 65002,
    [string]$IdentityFile = "",
    [switch]$SkipBuild,
    [switch]$SkipGitPush
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$frontend = Join-Path $root "frontend"
$dist = Join-Path $frontend "dist"
$remote = "${SshUser}@${SshHost}:${RemotePath}"

if (-not $IdentityFile) {
    $defaultKey = Join-Path $env:USERPROFILE ".ssh\hostinger_tnsds"
    if (Test-Path $defaultKey) { $IdentityFile = $defaultKey }
}

Push-Location $root
try {
    if (-not $SkipBuild) {
        Write-Host "Building frontend (API: $ApiBaseUrl)..." -ForegroundColor Cyan
        Push-Location $frontend
        $env:VITE_API_BASE_URL = $ApiBaseUrl
        npm run build
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Pop-Location
    }
    else {
        Write-Host "Skipping build (using existing dist/)." -ForegroundColor Yellow
    }

    if (-not (Test-Path $dist)) {
        Write-Error "Build output not found: $dist"
    }

    Write-Host ""
    Write-Host "Deploying frontend to Hostinger (SCP -> public_html)..." -ForegroundColor Cyan

    function Invoke-ScpUpload([string[]]$ScpArgs, [string]$Target) {
        Write-Host "  -> $Target" -ForegroundColor DarkGray
        & scp @ScpArgs
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }

    function Invoke-PscpUpload([string[]]$PscpArgs, [string]$Target) {
        Write-Host "  -> $Target" -ForegroundColor DarkGray
        & pscp @PscpArgs
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }

    # Everything in dist/ except the assets folder (index.html, .htaccess, images...).
    $rootFilesWin = Get-ChildItem -File -Force $dist | Select-Object -ExpandProperty FullName
    $rootFilesNix = $rootFilesWin  # scp accepts Windows paths as local sources

    $usePscp = -not $IdentityFile -and $env:HOSTINGER_SSH_PASSWORD -and (Get-Command pscp -ErrorAction SilentlyContinue)
    $scpBase = @("-P", "$SshPort")
    if ($IdentityFile) {
        $scpBase += @("-i", $IdentityFile, "-o", "IdentitiesOnly=yes")
    }

    if ($usePscp) {
        Write-Host "Using PuTTY pscp with HOSTINGER_SSH_PASSWORD." -ForegroundColor DarkGray
        $pscpBase = @("-P", "$SshPort", "-pw", $env:HOSTINGER_SSH_PASSWORD, "-batch")
        Invoke-PscpUpload ($pscpBase + @("-r", "$dist\assets", "${remote}/")) "assets/"
        Invoke-PscpUpload ($pscpBase + $rootFilesWin + @("${remote}/")) "root files"
    }
    else {
        if (-not $IdentityFile) {
            Write-Host "Enter your Hostinger SSH password when prompted (assets folder + root files)." -ForegroundColor Yellow
        }
        else {
            Write-Host "Using SSH key: $IdentityFile" -ForegroundColor DarkGray
        }
        Write-Host ""
        Invoke-ScpUpload ($scpBase + @("-r", "$dist/assets", "${remote}/")) "assets/"
        Invoke-ScpUpload ($scpBase + $rootFilesNix + @("${remote}/")) "root files"
    }

    Write-Host "Hostinger frontend deploy complete." -ForegroundColor Green
    Write-Host ""

    if (-not $SkipGitPush) {
        $dirty = git status --porcelain
        if ($dirty) {
            Write-Host "Warning: uncommitted local changes will NOT reach Railway until you commit and push." -ForegroundColor Yellow
            $dirty | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkYellow }
            Write-Host ""
        }

        $branch = git rev-parse --abbrev-ref HEAD
        Write-Host "Pushing $branch to origin (Railway API auto-redeploys from GitHub)..." -ForegroundColor Cyan
        git push origin $branch
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Write-Host "Git push complete. Railway will rebuild the API in the background." -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "Production deploy complete." -ForegroundColor Green
    Write-Host "  Frontend: https://lightgray-alpaca-580456.hostingersite.com/" -ForegroundColor Green
    Write-Host "  API:      $($ApiBaseUrl -replace '/api(/v1)?$','')" -ForegroundColor Green
    if (-not $SkipGitPush) {
        Write-Host "  Railway:  check Deployments tab if the API build is still running." -ForegroundColor DarkGray
    }
}
finally {
    Pop-Location
}
