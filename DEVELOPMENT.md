# Development and Release Workflow

## Source of truth

GitHub repository: https://github.com/ArthurUker/simba-network-watch  
Default branch: `main`. Every completed development change should be committed to GitHub **during that work session**, before deploying the changed code.

**Important:** ChatGPT does not continuously run or push changes while the conversation is inactive. For work it performs in a conversation, the process below is the standard to follow.

## Change control

1. Read current files from GitHub; work from the current branch and latest blob SHA (never assume an old local file is current).
2. For a feature or fix, make a focused change. Group related edits into a logical commit; avoid mixing unrelated feature work.
3. Run available static/interaction tests; note whether browser/iPhone/network tests have or have not been run. Don't label a simulated test a real carrier-network test.
4. Commit the corresponding source to GitHub with a descriptive message. Prefer `feat:`, `fix:`, `perf:`, `refactor:`, `test:`, and `docs:`.
5. Verify GitHub commit SHA and re-read the modified file or diff after each update.
6. Update [CHANGELOG.md](./CHANGELOG.md) for meaningful releases or user-visible behavior changes, linking to the corresponding exact commit(s).
7. Only then deploy the checked-in version to Cloudflare. Verify deployment activation and record the source commit SHA, deployed version, timestamp and test status in the release summary.
8. If deploying fails, clearly report that GitHub is newer than Cloudflare. Do not claim synchronization or success without verification.

## Cloudflare deployment state

The current `simba-network-watch.renkangguo.workers.dev` website is served by a **manually deployed Cloudflare Worker**. GitHub commits do **not** automatically update it. A GitHub Actions + Cloudflare API token workflow or Cloudflare Git integration would need to be configured first.

When automating deployment later:
- Use GitHub Actions with scoped Cloudflare secrets, not hardcoded credentials.
- Publish only after basic code checks pass; avoid exposing account secrets in the static HTML.
- Record the source commit SHA in deployment logs or application metadata.
- For repeatable releases consider adding version tags and GitHub Releases.

## Historical versions

The full change-by-change source history is available at https://github.com/ArthurUker/simba-network-watch/commits/main/ and the milestone index is in CHANGELOG.md. Major versions currently exist as commits, not necessarily as Git tags or formal Releases.

## Measurement integrity

Keep the distinctions explicit: short HTTP downloads are not full network quality; browser opaque HEAD requests do not establish website success or a server's physical country; synthetic video chunks are not YouTube/TikTok playback; mobile Safari cannot reliably measure while backgrounded. Preserve existing client-side data when changing storage keys.
