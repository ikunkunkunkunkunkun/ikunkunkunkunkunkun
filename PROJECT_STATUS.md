# Project Status

- Current goal: Make the two-column profile metrics accurate against the authenticated GitHub account data.
- Completed work: Kept the top split quote and illustration and short introduction. Split the generated metrics into two cards in one row: personal/activity data on the left, languages/contribution calendar on the right. Kept compact project links and visit counter.
- Key technical decisions: Use GitHub-supported HTML table layout with 50% columns and one distinct metrics SVG per column. The second metrics action uses `base: ""` to avoid repeating profile data. Both action steps now use a repository secret backed by the authenticated user's token for account-wide access; `GITHUB_TOKEN` remains only the committer token. Forks are included in repository counts.
- Core file changes: `README.md`, `assets/profile-art.png`, `.github/workflows/snake.yml`, `.github/workflows/metrics.yml`.
- Verification: The authenticated GitHub API reports 12 public repositories and 15 owned repositories in total, including 3 private ones. The `METRICS_TOKEN` repository secret is present; workflow regeneration and comparison of displayed counts are pending.
- Known issues: The account-wide token is an OAuth credential stored as a GitHub Actions secret and can be revoked or expire; if that happens, the metrics workflow will need a replacement secret. GitHub may cache the profile page briefly after a push.
- Failed or abandoned approaches: The first snake workflow used the wrong `outputs` input and lacked `contents: write`; both were corrected and the workflow rerun successfully.
- Next steps: Open the profile page and refresh if GitHub still shows cached README content; revise wording, project selection, or colors if desired.
