# Network Watch (formerly SIMBA Network Watch)

A mobile-first, multi-carrier network diagnostic dashboard. Supports SIMBA, China Unicom, China Mobile, China Telecom, Singtel, and other providers, with manual location-aware domestic/cross-market reporting. **v4.4**

**Live site:** https://simba-network-watch.renkangguo.workers.dev/

**Development traceability:** [Version history](./CHANGELOG.md) · [GitHub-first development and deployment process](./DEVELOPMENT.md) · [All commits](https://github.com/ArthurUker/simba-network-watch/commits/main/)

## v4.4 — Unified feature menu and concise mobile dashboard

- The mobile home page now contains **one compact total-network preview** (last measured download, same-origin HTTP latency, observed IP region and ASN network organization). The overview deliberately avoids inventing a network quality score from limited signals.
- A uniform **six-tile feature menu** opens: baseline speed test, cross-region website probes, application scenarios, roaming context, local history, and CSV export. The full status panel is accessible from **View details** in the top overview.
- The large six-card auto-detected status panel now lives exclusively in **Network status details**; manual SIM/visited-network/location fields are in **Roaming analysis**; speed chart and duration/budget settings are in **Speed test**; long recent-result list and CSV download are in **History**.
- The home page shows **full-diagnosis progress only during/after an initiated run**, not an idle block of empty gauges. A single full-diagnosis button remains available.
- Every detail page uses the same content card treatment, smaller headers and a consistent **Return home** navigation pattern. The mobile tile heights were reduced to fit more useful actions on screen.
- Existing test logic, `simba-network-watch-v3` localStorage history, roaming labels, ASN and HTTP health API, upload/download behavior and user-configured regional test nodes are preserved.
- Tests for v4.4 covered JavaScript parse, unique element IDs, menu navigation to all six functions, switching to settings, a simulated full diagnosis with 14 regional and 17 application website targets, history rendering and CSV export.
- Cloudflare website publication is separate from GitHub source commits. The deployment ID and associated commit are recorded in [CHANGELOG.md](./CHANGELOG.md).

## v4.3 — Automatic observable connection status and live test telemetry

- A compact **network status** dashboard appears above the diagnostic tabs. Manual location, SIM owner and roaming configuration remain available behind a collapsible section, so old forms no longer dominate the initial mobile view.
- Automatically queries the same-origin Cloudflare Worker for **IP-geolocated country, incoming ASN and ASN owning organization, Cloudflare edge colo and HTTP protocol**, and optional edge transport RTT. These identify the **visible public IP path**, not the actual SIM operator, visited carrier or physical location.
- Performs three lightweight same-origin `GET /api/ping` requests to show median HTTP request duration, variation and errors. This is **not ICMP Ping** and is not radio latency alone.
- Where `navigator.connection` is supported, shows the browser-reported connection type and **effective performance class** (such as `4g`). That `4g` label **does not prove LTE and can also appear on Wi-Fi/5G**. iOS Safari currently does not implement this API.
- **Live Mbps while this site's download test is actively transferring:** uses a streaming `ReadableStream` reader with a buffered fallback. Shows current request's measured transfer-rate estimate, and after completion labels the value **last test sample**, not device-wide background speed.
- Incremental sample-driven trend during a running test; original samples remain untouched. Refreshes ASN/geolocation and HTTP timing on manual refresh, supported browser connection changes, and return to the foreground.
- Signal bars, RSRP, RSRQ, SINR, SIM ownership, and exact LTE/5G RAT cannot be read by normal iPhone webpages. It deliberately displays **unsupported**, not invented results. The entire device's traffic from other apps is not observable.
- Preserves `simba-network-watch-v3` history, v4.2 roaming origin categories, and v4.2 preferences. The Cloudflare Worker source for `/api/network-info` and `/api/ping` is versioned in [worker-template.mjs](./worker-template.mjs).

**Data usage:** The initial status refresh uses only a few small HTTP requests. An actual speed test transfers data and remains subject to the selected transfer budget. This is foreground-only; Safari can suspend pages in the background.

## v4.2 — International roaming and egress diagnostics

**Example: SIMBA SIM in mainland China roaming**

| Dimension | Example | How recorded |
| --- | --- | --- |
| Phone physical country | Mainland China | User selects |
| SIM home provider | SIMBA | User selects |
| SIM home country | Singapore | User selects |
| Visited radio network | China Telecom (SIMBA's listed preferred roaming partner) | User confirms manually from phone |
| Roaming status | International roaming | User selects |
| Public IP geolocation as seen by this Cloudflare Worker | May be Singapore, mainland China or elsewhere | Same-origin egress API |

The dashboard keeps **two independent site-market categories**: whether the market matches the physical country, and whether it matches the observed public-IP country. These are **not proof of local breakout, home-routed data, or the physical location of the end server**. Cloudflare IP geolocation is an estimate; VPN/proxies, gateway routing and CDN location can change interpretation.

A serverless same-origin endpoint at /api/network-info returns the client IP's **estimated** country, ASN and AS organization **without returning the complete IP address** or writing it to persistent server storage. The client refreshes this at the beginning of each diagnostic run and can refresh manually. If the check fails, egress country is unknown; previously recorded test attribution is not replaced.

The website still runs as a manually deployed Cloudflare Worker, not an automatically updated GitHub Pages build. A **pure static HTML host without the companion endpoint** can still show a diagnostic page, but public egress observation will be unavailable.

**How to test this case:** choose mainland China as physical location, SIMBA as SIM provider, international roaming as connection mode, Singapore as SIM home, then enter the actual visited network if known. Press the IP-check button to observe IP country before interpreting country categories. SIMBA's China roaming listing currently names **China Telecom** as its preferred operator; do not assume the handset has actually attached to it.

Older v4.1 measurements without a recorded egress IP country remain unknown for egress-based classification. Existing localStorage measurements are retained.

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
