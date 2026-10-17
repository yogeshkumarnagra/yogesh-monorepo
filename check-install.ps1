Set-Location "d:\MyData\Projects\yogesh-monorepo"

Write-Host "=== Checking install status ===" -ForegroundColor Cyan

# Check root node_modules
$nextPkg = "d:\MyData\Projects\yogesh-monorepo\node_modules\next\package.json"
if (Test-Path $nextPkg) {
    $ver = (Get-Content $nextPkg | ConvertFrom-Json).version
    Write-Host "✓ next@$ver installed at root" -ForegroundColor Green
} else {
    Write-Host "✗ next NOT found — running npm install..." -ForegroundColor Red
    npm install
}

# Check @yogesh symlinks
$yogeshDir = "d:\MyData\Projects\yogesh-monorepo\node_modules\@yogesh"
if (Test-Path $yogeshDir) {
    Write-Host "✓ @yogesh/* workspace packages linked" -ForegroundColor Green
    Get-ChildItem $yogeshDir | ForEach-Object { Write-Host "  - @yogesh/$($_.Name)" }
} else {
    Write-Host "✗ @yogesh workspace links missing" -ForegroundColor Yellow
}

# Check no nested node_modules in apps
$nestedNM = @(
    "d:\MyData\Projects\yogesh-monorepo\apps\portfolio\node_modules",
    "d:\MyData\Projects\yogesh-monorepo\apps\ai-story-ui\node_modules",
    "d:\MyData\Projects\yogesh-monorepo\apps\ai-youtube-bot\node_modules"
)
foreach ($nm in $nestedNM) {
    if (Test-Path $nm) {
        Write-Host "✗ Nested node_modules found: $nm — removing..." -ForegroundColor Red
        Remove-Item -Recurse -Force $nm
    } else {
        Write-Host "✓ No nested node_modules in $($nm -replace '.*apps\\','')" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
