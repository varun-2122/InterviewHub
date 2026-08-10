# InterviewHub - Backdate Commits Script
# Fills GitHub contribution graph from April 26 to June 23, 2026

$repoPath = "c:\Users\varun\OneDrive\Desktop\InterviewHub-main"
Set-Location $repoPath

git checkout main | Out-Null

# Realistic commit messages for an interview platform project
$commitMessages = @(
    "feat: add interview scheduling component",
    "fix: resolve video call connection issues",
    "style: improve candidate profile UI",
    "docs: update API documentation",
    "refactor: optimize database queries",
    "test: add unit tests for auth module",
    "feat: implement real-time collaboration",
    "fix: handle edge cases in code editor",
    "style: enhance navbar responsiveness",
    "feat: add AI proctoring module",
    "docs: add setup instructions",
    "fix: resolve authentication token expiry",
    "refactor: clean up component structure",
    "feat: add candidate scoring system",
    "style: update color palette for dark mode",
    "fix: improve WebRTC connection stability",
    "feat: implement feedback collection form",
    "docs: update README with features list",
    "fix: resolve CORS issues in API layer",
    "style: add micro-animations to buttons",
    "feat: add interview timer component",
    "refactor: modularize API endpoint handlers",
    "fix: handle null pointer exceptions safely",
    "feat: add question bank management page",
    "style: improve mobile responsiveness",
    "docs: add contribution guidelines",
    "fix: resolve state management race condition",
    "feat: implement code syntax highlighting",
    "style: polish landing page hero section",
    "fix: improve error handling in forms",
    "feat: add recruiter dashboard analytics",
    "refactor: optimize bundle size",
    "fix: resolve hydration errors in Next.js",
    "feat: add email notification system",
    "style: update typography scale globally",
    "docs: document Convex database schema",
    "fix: handle concurrent session conflicts",
    "feat: add whiteboard collaboration tool",
    "refactor: extract reusable custom hooks",
    "fix: resolve memory leaks in video stream",
    "feat: add interview result export feature",
    "style: add loading skeleton components",
    "fix: handle network disconnection gracefully",
    "feat: implement role-based access control",
    "refactor: improve TypeScript strict types",
    "docs: add API endpoint documentation",
    "fix: resolve build warnings and lint errors",
    "feat: add candidate search and filter",
    "style: improve button hover effects",
    "fix: resolve date timezone issues",
    "feat: add live coding environment",
    "fix: resolve Monaco editor layout bug",
    "style: add glassmorphism card effects",
    "feat: integrate Clerk authentication",
    "fix: improve sign-in redirect flow",
    "feat: add behavioral interview module",
    "refactor: separate layout and page logic",
    "fix: resolve Convex mutation error handling",
    "style: enhance dashboard grid layout",
    "feat: add readiness score indicator",
    "docs: update deployment instructions",
    "fix: patch security headers in middleware",
    "feat: add AI response analysis feature",
    "style: animate hero section on load",
    "fix: correct interview status transitions",
    "feat: add session replay functionality",
    "refactor: consolidate API utility functions",
    "fix: resolve dark mode flicker on load",
    "feat: add proctor signal clarity monitor",
    "style: polish recruiter dashboard cards",
    "fix: handle expired interview links",
    "feat: add candidate onboarding flow",
    "docs: add environment variable guide",
    "fix: resolve WebSocket reconnection logic",
    "style: improve accessibility contrast ratios",
    "feat: add interview feedback templates"
)

# Date range: April 26 to June 23, 2026
$startDate = [datetime]"2026-04-26"
$endDate   = [datetime]"2026-06-23"

# Create/init CHANGELOG.md if missing
$changelogPath = "$repoPath\CHANGELOG.md"
if (-not (Test-Path $changelogPath)) {
    $initContent = "# Changelog`n`nAll notable changes to InterviewHub will be documented in this file.`n"
    $initContent | Out-File -FilePath $changelogPath -Encoding UTF8
}

$currentDate  = $startDate
$totalCommits = 0
$skippedDays  = 0
$usedMessages = @{}

Write-Host "Generating backdated commits from $($startDate.ToString('yyyy-MM-dd')) to $($endDate.ToString('yyyy-MM-dd'))..." -ForegroundColor Cyan

while ($currentDate -le $endDate) {
    # Skip roughly 1 day per week (~14% chance)
    $roll = Get-Random -Minimum 1 -Maximum 8
    if ($roll -eq 4) {
        Write-Host "  Skipping $($currentDate.ToString('yyyy-MM-dd'))" -ForegroundColor DarkGray
        $skippedDays++
        $currentDate = $currentDate.AddDays(1)
        continue
    }

    # 1 to 3 commits per day
    $numCommits = Get-Random -Minimum 1 -Maximum 4

    # Generate sorted random hours for that day (9 AM - 10 PM)
    $hours = @()
    for ($i = 0; $i -lt $numCommits; $i++) {
        $hours += Get-Random -Minimum 9 -Maximum 23
    }
    $hours = $hours | Sort-Object

    for ($i = 0; $i -lt $numCommits; $i++) {
        $minute = Get-Random -Minimum 0  -Maximum 60
        $second = Get-Random -Minimum 0  -Maximum 60
        $hour   = $hours[$i]

        $commitDateTime = $currentDate.AddHours($hour).AddMinutes($minute).AddSeconds($second)
        $dateStr = $commitDateTime.ToString("yyyy-MM-dd HH:mm:ss") + " +0530"

        # Pick a commit message
        do {
            $msgIndex = Get-Random -Minimum 0 -Maximum $commitMessages.Count
        } while ($usedMessages.ContainsKey($msgIndex) -and $usedMessages.Count -lt $commitMessages.Count)
        $usedMessages[$msgIndex] = $true
        if ($usedMessages.Count -ge $commitMessages.Count) { $usedMessages = @{} }

        $commitMsg = $commitMessages[$msgIndex]

        # Append a small entry to CHANGELOG.md
        $entry = "`n### $($commitDateTime.ToString('yyyy-MM-dd HH:mm')) - $commitMsg"
        Add-Content -Path $changelogPath -Value $entry

        git add CHANGELOG.md | Out-Null

        $env:GIT_AUTHOR_DATE    = $dateStr
        $env:GIT_COMMITTER_DATE = $dateStr

        git commit -m $commitMsg | Out-Null

        Remove-Item Env:GIT_AUTHOR_DATE    -ErrorAction SilentlyContinue
        Remove-Item Env:GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

        $totalCommits++
        Write-Host "  [$($currentDate.ToString('MM-dd'))] ($($i+1)/$numCommits) $commitMsg" -ForegroundColor Green
    }

    $currentDate = $currentDate.AddDays(1)
}

Write-Host "`nDone! Created $totalCommits commits ($skippedDays days skipped)." -ForegroundColor Cyan
Write-Host "Pushing to GitHub (main)..." -ForegroundColor Yellow

git push origin main

Write-Host "`nYour GitHub contribution graph should now be green from April 26 to June 23!" -ForegroundColor Green
