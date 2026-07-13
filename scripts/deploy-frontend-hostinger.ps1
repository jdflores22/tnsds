# Deploy the Vite frontend to Hostinger (tnsds.ph) via SCP.
#
# What it does:
#   1. npm run build  (uses Railway API URL baked into the bundle)
#   2. Verify dist/ is a production build (not localhost)
#   3. Test SSH connection
#   4. SCP dist/ -> Hostinger public_html
#
# Usage:
#   .\scripts\deploy-frontend-hostinger.ps1
#   .\scripts\deploy-frontend-hostinger.ps1 -SkipBuild          # upload existing dist/
#   .\scripts\deploy-frontend-hostinger.ps1 -PushApi            # also git push (Railway API redeploy)
#
# Auth (first match wins):
#   1. -IdentityFile  or  %USERPROFILE%\.ssh\hostinger_tnsds  (recommended)
#   2. $env:HOSTINGER_SSH_PASSWORD + PuTTY pscp
#   3. OpenSSH scp (password prompt)

param(
    [string]$FrontendUrl = "https://tnsds.ph",
    [string]$RemotePath = "/home/u910121167/websites/dhSUIgINT/public_html",
    [string]$ApiBaseUrl = "https://tnsds-production.up.railway.app/api/v1",
    [string]$SshUser = "u910121167_dhSUIgINT",
    [string]$SshHost = "82.25.100.95",
    [int]$SshPort = 65002,
    [string]$IdentityFile = "",
    [switch]$SkipBuild,
    [switch]$PushApi
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

function Write-Step([string]$Message) {
    Write-Host ""
    Write-Host $Message -ForegroundColor Cyan
}

function Assert-ProductionBuild {
    param([string]$DistPath, [string]$ExpectedApiUrl)

    if (-not (Test-Path $DistPath)) {
        throw "Build output not found: $DistPath"
    }

    $indexHtml = Join-Path $DistPath "index.html"
    if (-not (Test-Path $indexHtml)) {
        throw "Missing index.html in dist/"
    }

    $htaccess = Join-Path $DistPath ".htaccess"
    if (-not (Test-Path $htaccess)) {
        Write-Host 'Warning: dist htaccess file missing - SPA routes may 404 on Hostinger.' -ForegroundColor Yellow
    }

    $distJs = Get-ChildItem -Path (Join-Path $DistPath "assets") -Filter "index-*.js" -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if (-not $distJs) {
        throw "No index-*.js bundle found in dist/assets/"
    }

    if (Select-String -Path $distJs.FullName -Pattern "localhost:5000" -Quiet) {
        throw @"
dist/ was built for local dev (localhost:5000 found in bundle).
Run without -SkipBuild so the script rebuilds with ApiBaseUrl=$ExpectedApiUrl
"@
    }

    $apiHost = ([uri]$ExpectedApiUrl).Host
    if ($apiHost -and -not (Select-String -Path $distJs.FullName -Pattern ([regex]::Escape($apiHost)) -Quiet)) {
        $msg = 'Bundle does not contain expected API host ''' + $apiHost + '''. Rebuild with -ApiBaseUrl or check frontend/.env.production.'
        throw $msg
    }

    Write-Host ("  dist/ OK: {0} (API host: {1})" -f $distJs.Name, $apiHost) -ForegroundColor DarkGray
}

function Test-SshConnection {
    param(
        [string[]]$SshArgs,
        [string]$UserAtHost
    )

    Write-Host "  Testing SSH to $UserAtHost ..." -ForegroundColor DarkGray
    $remoteCmd = "if [ -d '$RemotePath' ]; then echo ok; else exit 1; fi"
    & ssh @SshArgs $UserAtHost $remoteCmd 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw @"
SSH connection or remote path failed.
  User:     $SshUser@$SshHost`:$SshPort
  Path:     $RemotePath
  Key:      $(if ($IdentityFile) { $IdentityFile } else { '(password auth)' })

Confirm the path with: ssh -p $SshPort $SshUser@$SshHost 'pwd && ls -la'
Override with: -RemotePath '/home/.../public_html'
"@
    }
    Write-Host "  SSH OK, remote path exists." -ForegroundColor DarkGray
}

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

Push-Location $root
try {
    Write-Host "Hostinger frontend deploy -> $FrontendUrl" -ForegroundColor White
    Write-Host "  API:    $ApiBaseUrl" -ForegroundColor DarkGray
    Write-Host "  Remote: ${SshUser}@${SshHost}:${RemotePath}" -ForegroundColor DarkGray

    if (-not $SkipBuild) {
        Write-Step "1/4  Building frontend..."
        Push-Location $frontend
        $env:VITE_API_BASE_URL = $ApiBaseUrl
        npm run build
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Pop-Location
    }
    else {
        Write-Step "1/4  Skipping build (using existing dist/)..."
    }

    Write-Step "2/4  Validating production build..."
    Assert-ProductionBuild -DistPath $dist -ExpectedApiUrl $ApiBaseUrl

    Write-Step "3/4  Checking SSH..."
    $sshTarget = "${SshUser}@${SshHost}"
    $sshBase = @("-p", "$SshPort", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=accept-new")
    if ($IdentityFile) {
        $sshBase += @("-i", $IdentityFile, "-o", "IdentitiesOnly=yes")
        Test-SshConnection -SshArgs $sshBase -UserAtHost $sshTarget
    }
    elseif ($env:HOSTINGER_SSH_PASSWORD) {
        Test-SshConnection -SshArgs $sshBase -UserAtHost $sshTarget
    }
    else {
        Write-Host '  No SSH key - will prompt for password during upload.' -ForegroundColor Yellow
    }

    Write-Step "4/4  Uploading to Hostinger..."
    $rootFiles = Get-ChildItem -File -Force $dist | Select-Object -ExpandProperty FullName

    $usePscp = -not $IdentityFile -and $env:HOSTINGER_SSH_PASSWORD -and (Get-Command pscp -ErrorAction SilentlyContinue)
    $scpBase = @("-P", "$SshPort")
    if ($IdentityFile) {
        $scpBase += @("-i", $IdentityFile, "-o", "IdentitiesOnly=yes")
    }

    if ($usePscp) {
        Write-Host "Using PuTTY pscp (HOSTINGER_SSH_PASSWORD)." -ForegroundColor DarkGray
        $pscpBase = @("-P", "$SshPort", "-pw", $env:HOSTINGER_SSH_PASSWORD, "-batch")
        Invoke-PscpUpload ($pscpBase + @("-r", "$dist\assets", "${remote}/")) 'assets/'
        Invoke-PscpUpload ($pscpBase + $rootFiles + @("${remote}/")) 'root files'
    }
    else {
        if ($IdentityFile) {
            Write-Host "Using SSH key: $IdentityFile" -ForegroundColor DarkGray
        }
        Invoke-ScpUpload ($scpBase + @("-r", "$dist/assets", "${remote}/")) 'assets/'
        Invoke-ScpUpload ($scpBase + $rootFiles + @("${remote}/")) 'root files'
    }

    Write-Host ""
    Write-Host "Frontend deploy complete." -ForegroundColor Green
    Write-Host "  Site:  $FrontendUrl/" -ForegroundColor Green
    Write-Host "  API:   $($ApiBaseUrl -replace '/api(/v1)?$','')" -ForegroundColor Green

    if ($PushApi) {
        Write-Host ""
        $dirty = git status --porcelain
        if ($dirty) {
            Write-Host "Warning: uncommitted changes will NOT reach Railway until committed." -ForegroundColor Yellow
            $dirty | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkYellow }
        }
        $branch = git rev-parse --abbrev-ref HEAD
        Write-Host "Pushing $branch to origin (Railway API redeploy)..." -ForegroundColor Cyan
        git push origin $branch
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Write-Host "Git push complete." -ForegroundColor Green
    }
}
finally {
    Pop-Location
}
