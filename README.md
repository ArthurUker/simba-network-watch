# Network Watch (formerly SIMBA Network Watch)

A mobile-first, multi-carrier network diagnostic dashboard. Supports SIMBA, China Unicom, China Mobile, China Telecom, Singtel, and other providers, with manual location-aware domestic/cross-market reporting. **v4.1**

**Live site:** https://simba-network-watch.renkangguo.workers.dev/

**Development traceability:** [Version history](./CHANGELOG.md) · [GitHub-first development and deployment process](./DEVELOPMENT.md) · [All commits](https://github.com/ArthurUker/simba-network-watch/commits/main/)

## v4.1 — carrier-neutral, origin-aware monitoring

- Select the **actual measurement country/region** (e.g. China mainland or Singapore) and **carrier** (e.g. China Unicom or SIMBA) before a run. Both fields are user labels, not inferred from ASN, GPS or radio modem.
- For the **seven supported website markets**, same-market and other-market labels are derived from the origin selected **at scan time**. Changing your origin later does not relabel old measurements. For unsupported origin markets there is no matching domestic test site, and the UI says so.
- **This is not proof of actual domestic or international routing.** A China-market website can use an overseas CDN and vice versa. The download baseline uses Cloudflare and may be served internationally; it is not a verified domestic speed test.
- Download charts default to a display-only **five-sample moving median with a smooth SVG curve**, faint underlying original points and a switch back to the raw polyline. Exported and stored Mbps values remain unmodified.
- Country, carrier, network type and market classification are preserved per new measurement and included in CSV. Legacy records without a trustworthy origin remain unclassified.
- The existing URL and repository name retain SIMBA for backwards compatibility but the app itself is provider-neutral.

## Dashboard-first experience

- A single overview showing Cloudflare baseline speed (Mbps), browser requests to 7 website markets, requests to 6 everyday service categories, and video-segment simulation results.
- One-tap **Full diagnosis** from the first screen, with four visible progress stages. Section results update progressively.
- Direct cards and category chips navigate to results. Test settings stay collapsed by default.
- Network type is **unlabeled by default**. A browser cannot reliably distinguish 4G/LTE from 5G, identify a carrier, or verify physical location. The user selects these manually.
- Short interpretation, compact speed trend, recent runs, and manual video buffering markers.
- Existing localStorage data uses the previous `simba-network-watch-v3` key to retain history.

## Measurement types and limits

| Module | What it measures | What it does NOT show |
| --- | --- | --- |
| Cloudflare HTTP baseline | 30/45/60/120-second window of distributed downloads, median and P10 speed, HTTP request times | A physically verified domestic destination, radio-level throughput, ICMP Ping |
| Location-relative website markets | 7 market categories, 14 websites, 2 restricted browser probes each; categorized relative to the user's selected origin | Actual domestic or cross-border bandwidth, physical IP route, HTTP 200 status |
| Application scenarios | 6 categories, 17 popular website frontends | Native app activity, real video-stream throughput |
| 20s video segment simulator | Repeated download sample speeds and slow segment counts | YouTube/Netflix/TikTok playback quality |
| User-configured regional endpoint | Optional HTTPS+CORS download to independently verified regional test servers | Independently verified location or routing |

**Critical distinction:** Selecting China mainland + China Unicom labels China-market sites as same-market; selecting Singapore + SIMBA makes Singapore-market sites same-market. These are **website market categories**, not verified network routes. An opaque `no-cors` browser response only means the request yielded an opaque response. It does **not** prove HTTP success, application availability or that the server is in the website's advertised country. The interface reports **request returned**, never an invented cross-border Mbps.

The local budget defaults to 80 MB for a 60-second test. A budget cap can terminate downloads earlier; full diagnosis adds probe and segment traffic. Background/locked Safari is not a reliable monitoring environment.

## Technical

Single self-contained static `index.html` with localStorage and no frontend framework. Download measurement uses Cloudflare's publicly available `__down` HTTP endpoint. Website probing uses browser `HEAD` `no-cors` where permissible. No account is needed and the measurement history is not sent to our server; contacted services still receive normal network metadata.

The Cloudflare Workers site is currently deployed independently of GitHub; updating the repository alone does not automatically publish to Workers. GitHub Pages can alternatively be enabled from **Settings → Pages → Deploy from a branch → main → /(root)**.

## Design references

Reworked the information hierarchy from scratch after reviewing open-source UX patterns:

- [Uptime Kuma](https://github.com/louislam/uptime-kuma): dashboard health summary and drill-down hierarchy.
- [LibreSpeed](https://github.com/librespeed/speedtest): immediately visible core network metrics.
- [Speedtest Tracker](https://github.com/alexjustesen/speedtest-tracker): time-series results and session history.

These are design references. The UI and JavaScript in this repository are original; no third-party source code or visual assets were copied.

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for the existing copyright and license terms. This independent project is not endorsed by SIMBA, Cloudflare or the services it tests.
