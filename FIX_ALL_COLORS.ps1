# PowerShell Script to Fix All Old Color Classes
# Run this in PowerShell: .\FIX_ALL_COLORS.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FIXING ALL OLD COLOR CLASSES" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define files to update
$files = @(
    "client\src\pages\Services.jsx",
    "client\src\pages\Portfolio.jsx",
    "client\src\pages\Blog.jsx",
    "client\src\pages\BlogPost.jsx",
    "client\src\admin\AdminDashboard.jsx",
    "client\src\components\layout\ScrollProgress.jsx",
    "client\src\components\ui\GlitchText.jsx",
    "client\src\components\ui\CursorFollower.jsx",
    "client\src\App.jsx"
)

# Define replacements in order
$replacements = @{
    'text-cream' = 'text-white'
    'text-text-muted' = 'text-platinum-300'
    'text-accent-2' = 'text-gold-500'
    'text-accent(?!-2)' = 'text-royal-500'
    'bg-accent-2' = 'bg-gold-500'
    'bg-accent(?!-2)' = 'bg-royal-500'
    'hover:bg-accent-2' = 'hover:bg-gold-600'
    'hover:bg-accent(?!-2)' = 'hover:bg-royal-600'
    'hover:text-accent' = 'hover:text-royal-400'
    'border-accent' = 'border-royal-500'
    'focus:border-accent' = 'focus:border-royal-500'
    'bg-dark' = 'bg-luxury-50'
    'bg-mid' = 'bg-luxury-100'
    'border-border' = 'border-royal-500/20'
    'text-gradient' = 'gradient-luxury'
    'glow-accent' = 'glow-royal'
    'from-accent via-accent-2 to-accent' = 'from-royal-500 via-gold-500 to-emerald-500'
    'from-accent' = 'from-royal-500'
    'to-accent' = 'to-royal-500'
    'via-accent' = 'via-royal-500'
    '(?<!")glass(?!")' = 'glass-luxury'
    'className="glass ' = 'className="glass-luxury '
    ' glass"' = ' glass-luxury"'
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $fullPath = Join-Path (Get-Location) $file
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file" -ForegroundColor Cyan
        $content = Get-Content $fullPath -Raw
        $originalContent = $content
        $fileReplacements = 0
        
        foreach ($pattern in $replacements.Keys) {
            $replacement = $replacements[$pattern]
            $matches = [regex]::Matches($content, $pattern)
            
            if ($matches.Count -gt 0) {
                $content = $content -replace $pattern, $replacement
                $fileReplacements += $matches.Count
                Write-Host "  ✓ $pattern → $replacement ($($matches.Count)x)" -ForegroundColor Green
            }
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $fullPath -Value $content -NoNewline
            Write-Host "  ✅ Saved $fileReplacements changes" -ForegroundColor Green
            $totalReplacements += $fileReplacements
            $totalFiles++
        } else {
            Write-Host "  ℹ Already up to date" -ForegroundColor Gray
        }
        Write-Host ""
    } else {
        Write-Host "  ⚠ File not found: $fullPath" -ForegroundColor Yellow
        Write-Host ""
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMPLETE!" -ForegroundColor Green
Write-Host "Files Updated: $totalFiles" -ForegroundColor White
Write-Host "Total Replacements: $totalReplacements" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All old color classes have been replaced with luxury colors!" -ForegroundColor Green
Write-Host "Your website now has a consistent ₹20 lakh luxury design! 👑" -ForegroundColor Yellow
