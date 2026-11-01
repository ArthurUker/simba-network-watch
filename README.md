# SIMBA Network Watch

A lightweight, single-page network speed and video buffering monitor for SIMBA Telecom 5G/4G users in Singapore.

**Live preview (Cloudflare Workers):** https://simba-network-watch.renkangguo.workers.dev/

## Features (v2.0)

- Mobile-first, one-tap speed test and bottom action bar for iPhone
- One-tap video buffering marker without automatically consuming data
- Simple performance summary and a compact 24-hour / all-time trend
- Advanced settings collapsed by default; existing v1 local records retained
- Download throughput and HTTP round-trip latency sampling against Cloudflare's speed test endpoint
- Manually select 5G / 4G (browsers cannot reliably determine the radio network)
- Optional 5-, 15-, and 30-minute tests while the browser tab remains active
- Mark video buffering events, view a simple historical chart and export CSV
- Locally stored records in the browser's `localStorage`
- Mobile-friendly single-file static site; no server or framework dependency

## Quick start

Open the live site in Safari on an iPhone, disable Wi-Fi first to ensure traffic is measured on the SIMBA cellular connection, then mark the current 5G/4G connection and tap **开始测速**. Select video platform in Settings before using **记录卡顿**. Network type is manually tagged, not detected or switched by the webpage.

## GitHub Pages

1. Create a **public** GitHub repository named `simba-network-watch`.
2. Keep `index.html` and `README.md` at the repository root on `main` (both are already present).
3. Open **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Choose `main` and `/(root)`; save. Once publication finishes, visit `https://<GITHUB_USERNAME>.github.io/simba-network-watch/`.

All changes to `index.html` in the selected branch will update the GitHub Pages site.

## Cloudflare

The Cloudflare Workers site linked above runs the redesigned v2.0 interface and was deployed independently of GitHub. Pushes to this repository **will not automatically update that Cloudflare Workers deployment** until a GitHub Actions / Wrangler deployment pipeline is explicitly configured.

The site can alternatively be hosted on Cloudflare Pages by creating a Pages project connected to this repo and setting build command to none, build output directory to `/` (or a directory holding `index.html`, depending on the dashboard configuration).

## Network-test caveats

- Test traffic consumes cellular data. Light mode is approximately 2.5 MB per successful test; standard mode approximately 11 MB, plus possible overhead or traffic from failed tests.
- Measurements are to Cloudflare, not to YouTube, TikTok, Netflix, or other video services. They cannot definitively establish video-specific throttling or SIMBA policy limits.
- HTTP request timings are not the same as ICMP ping or packet loss tests.
- Safari on iOS does not guarantee scheduled testing in the background or when the phone is locked.
- Tests and notes are stored on the device, not in a shared account. Clearing browser storage deletes history.
- This project is independent from and not endorsed by SIMBA Telecom or Cloudflare.

## Security and privacy

No API tokens or personal credentials are required. Download requests go to Cloudflare's public speed test service, which receives normal network metadata such as the connecting IP address. Site hosting may also generate server access logs.

## License

No open-source license has been selected. Publishing source code in a public repository does not automatically grant reuse or redistribution rights.