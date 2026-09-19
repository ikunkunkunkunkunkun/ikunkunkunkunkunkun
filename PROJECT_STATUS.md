# Project Status

- Current goal: Add a working contribution snake animation to the GitHub profile README.
- Completed work: Kept the top split quote and illustration and short introduction. Split the generated metrics into two cards in one row. Updated the snake workflow from the broken v1 output to the documented v3 light/dark SVG outputs and embedded the animation between the introduction and metrics.
- Key technical decisions: Use GitHub-supported HTML table layout with 50% columns and one distinct metrics SVG per column. The second metrics action uses `base: ""` to avoid repeating profile data. Both action steps now use a repository secret backed by the authenticated user's token for account-wide access; `GITHUB_TOKEN` remains only the committer token. Forks are included in repository counts.
- Core file changes: `README.md`, `assets/profile-art.png`, `.github/workflows/snake.yml`, `.github/workflows/metrics.yml`.
- Verification: The old `gh-pages` snake SVG was only 48×96 and contained four snake cells, with no contribution grid. V3 workflow run `35430575725` succeeded; the new SVG is 880×192 with a full contribution grid and both light/dark files present on `gh-pages`. Metrics run `35430368890` succeeded and repository count matched GitHub GraphQL.
- Known issues: The account-wide token is an OAuth credential stored as a GitHub Actions secret and can be revoked or expire; if that happens, the metrics workflow will need a replacement secret. GitHub may cache the profile page briefly after a push.
- Failed or abandoned approaches: The first snake workflow used the wrong `outputs` input and lacked `contents: write`; both were corrected and the workflow rerun successfully.
- Next steps: Open the profile page and refresh if GitHub still shows cached README content; revise wording, project selection, or colors if desired.
