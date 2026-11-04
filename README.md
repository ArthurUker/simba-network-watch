# Network Watch (formerly SIMBA Network Watch)

A mobile-first, multi-carrier network diagnostic dashboard. Supports SIMBA, China Unicom, China Mobile, China Telecom, Singtel, and other providers, with manual location-aware domestic/cross-market reporting. **v5.1**

**Live site:** https://simba-network-watch.renkangguo.workers.dev/

**Development traceability:** [Version history](./CHANGELOG.md) · [GitHub-first development and deployment process](./DEVELOPMENT.md) · [All commits](https://github.com/ArthurUker/simba-network-watch/commits/main/)

## v5.1 — Mainland China / China Unicom degraded-network recovery

**Root-cause boundaries:** The public site currently uses `*.workers.dev`; the connected Cloudflare account has no registered zones or Worker custom domains. Public mainland network measurements indicate that the `workers.dev` domain may be blocked or unreliable. **A self-hosted CDN fallback cannot fix a domain that cannot be reached in the first place.** A separately hosted, verified mainland-accessible domain/backend is required for reliable operation; do not assume that attaching any arbitrary overseas domain guarantees mainland connectivity.

- A bounded `GET /api/health` returns the serving Worker version and diagnostic metadata without caching. The page tests the same-origin health route and displays an explicit **connection failure / possibly offline-cached shell** warning if it cannot reach the Worker.
- `GET /api/down?bytes=...` accepts up to 6 MB per request, serves an uncacheable octet-stream response, and is a **same-origin fallback** download test. Its data is generated at the Cloudflare edge **outside mainland China** under normal global routing, not at a local Chinese server. It measures a different path from `speed.cloudflare.com`.
- Advanced settings now allow **Auto**, **This Worker** and **External Cloudflare**. Auto prefers the Worker for `CN` physical country labels or detected public-IP country. Elsewhere, a short external-preflight attempt chooses Cloudflare if reachable and falls back to this Worker when unavailable. In-run failures can trigger one fallback for Auto.
- Every speed run stores `downloadSource`, `downloadFallbackReason`, and sample `source` fields; CSV exports the source for the raw speed samples. If the server switches during a run, the earlier samples are excluded from the new server's summary, so speed statistics never mix incompatible endpoints.
- No valid download samples means the run is reported **部分失败**, not “completed”; the previous successful run remains available but is not replaced by invented zeros. Visible diagnostics and retry buttons make network/API failure explicit.
- The PWA shell now uses a **bounded 5.5-second navigation attempt** and, if it falls back to cached HTML, uses an `x-network-watch-offline` response marker and the app's self-check to warn the user. SW cache namespace updated to `network-watch-shell-v51`. Network/API traffic is not cached.
- Simulated integration tests covered CN → Worker selection with the external endpoint unreachable; non-CN → automatic fallback to Worker; and Worker + external down → **partial failure** with no fabricated speed. Worker health and download route sizes / validation also tested.

### Mainland deployment limitation

The Cloudflare account does not currently own/manage a domain zone, so the Worker cannot be given a new custom domain in this account without onboarding a domain. An Internet-facing site hosted on a **mainland server with the appropriate domain/ICP setup** and a local measurement backend is the reliable architecture for Chinese SIM testing. Keep the Cloudflare Worker as an overseas comparator, not the exclusive primary entrypoint. If the entire `workers.dev` hostname is unreachable, the user must use the independently hosted entrypoint; neither this release nor HTTP retries can bypass a blocked hostname.

## v5.0 — Desktop real-time speed-test workstation and measured upload

The desktop homepage (≥1080 CSS px) now opens on a **speed-test performance board**, not six oversized navigation cards. It shows a prominent download percentile and optional upload throughput; idle / download-loaded HTTP timing and timing inflation; P10 and P50 download statistics; transfer usage; a continually updating measured sample chart; the current stage and progress; the reported public-IP region/ASN; and manual Wi-Fi/5G/4G context. A compact strip of six feature destinations remains below the test board. The left sidebar and all cross-border/roaming diagnostics remain intact.

- **Start speed test** runs the existing foreground HTTP baseline directly from the desktop home. **Full diagnosis** remains a separate action; **Stop** cancels an in-progress test.
- Select **Single-request stability** vs **four-parallel aggregate throughput** without leaving home. These test different properties and their Mbps are not directly comparable.
- The prominent completed download value uses **sample P90 where v4.9+ records support it** and explicitly labels this choice; historical median-only results are labelled P50 instead. During live sampling, the number represents the current request / current sample statistic, not a final P90.
- Optional upload now uses a deliberately constrained **same-origin Cloudflare Worker `POST /api/upload`** as a fallback-free direct test: two 500 KB messages, each verified against the server's returned byte count. The server does not store the data; it rejects oversized bodies and foreign browser origins. The reported number includes HTTP overhead and is not a dedicated high-capacity uplink benchmark.
- New run metadata uses `methodVersion=http-baseline-v50`, with `uploadSource` recorded. v4.9 historical RTT arrays remain readable; earlier methods are never silently reinterpreted.
- All other dashboard content remains accessible in detail pages. The **iPhone home** stays a compact six-menu app launcher, without the desktop-only measurement board.
- The PWA shell cache was rotated to `network-watch-shell-v50`.
- This is an original implementation referencing [Cloudflare Speedtest](https://github.com/cloudflare/speedtest) design and methodology, **not** a copy or bundle of that project's measurement engine.

### Accuracy limits

Download uses `speed.cloudflare.com/__down`; idle/loaded HTTP requests use the site's own Worker `/api/ping`; optional upload uses its `/api/upload`. They can be routed differently. The local HTTP metric is not ICMP Ping, browser Resource Timing network-only RTT, RSRP/RSSI or a trustworthy end-to-end country route. 500 KB upload payloads can **underestimate high uplink capacity**, and no packet-loss score is fabricated. The legacy v4.9 and v5.0 latency method shares the same-origin RTT semantics, while v4.8 uses a different earlier endpoint.

Simulated JavaScript, route and event tests verified the desktop controls, v5.0 upload response, result rendering and history. Production deployment details are maintained in [CHANGELOG.md](./CHANGELOG.md).

## v4.9 — Result-first performance dashboard and separate loaded HTTP latency

- The **网速测试** detail view now puts download P50 and (optional) upload speed first, then shows HTTP idle latency, concurrent-download HTTP latency, inflation, idle jitter, download P10/P90, concurrent-upload HTTP latency and consumed download MB.
- During the actual transfer, the page shows the **current test-request Mbps** and the sample count. These are not network-wide device traffic measurements.
- The baseline first sends four small **same-origin Worker /api/ping** requests for idle HTTP timing, then launches a Worker probe concurrently with each downloaded Cloudflare block; only requests overlapping the transfer are accepted as loaded HTTP samples. Optional upload uses its own concurrent probes.
- The Worker ping endpoint is **not the same server/route as the Cloudflare download endpoint** and timing includes browser and HTTP overhead. The method is a practical application-level congestion indicator, not ICMP ping, TCP queue tracing or an identical implementation of speed.cloudflare.com.
- P10 is a low-speed sample percentile; P50 is the median, and P90 is an interpolated upper percentile. They describe **discrete transfer samples**, not the vendor's entire formal test methodology.
- **Correct backward compatibility:** old v4.8 HTTP timing samples were collected from tiny speed-test downloads, so historical values are **not** retroactively shown as v4.9 idle Worker latency. Old raw download histories remain intact.
- CSV now includes a per-run summary and raw same-origin idle/download-loaded/upload-loaded HTTP RTT samples for runs with `methodVersion=http-baseline-v49`.
- Upload remains **explicit opt-in** and can be unavailable due to endpoint/CORS restrictions; an unavailable result is not zero upload bandwidth. Existing mobile, Wi-Fi, 5G, desktop, cross-border and roaming pages remain available.
- Simulated end-to-end tests covered sampled and four-stream modes, HTTP timing provenance, request budgets, upload failure and CSV. Real iPhone and desktop browsers still need external validation.

## v4.8 — Auditable target selection and multiple speed-measurement profiles

**Public protocol:** [METHODOLOGY.md](./METHODOLOGY.md) explains site inclusion, the exact 7-market/14-site and 6-category/17-site rosters, known news/CDN/market selection biases, browser limitations, open-source reference architectures (Ookla methodology, LibreSpeed, M-Lab ndt7 and Cloudflare Speedtest), data retention and a future multi-provider validation ladder.

- A visible **target-selection audit** now lists every predeclared region/app website and its hostname before users run a test. No destination is dropped or replaced based on the result.
- A **two-round balanced schedule** uses a recorded seed and fixed roster version (`fixed-roster-2026-11-03`) to rotate/alternate targets across regions and time. Each target gets one attempt per round; an opaque browser fetch is never reported as a verified HTTP 200 response. A record of round, order, seed and request method is written to the CSV and saved for the current scan.
- In advanced local speed settings, switch between **time-distributed single-request stability samples** (default) and **4-concurrent-request HTTP throughput**. Both use the same Cloudflare baseline, obey the browser's transfer cap, retain the raw samples and carry `profile`, `streams` and `methodVersion` metadata.
- The concurrent mode resembles a multi-connection capacity probe, but is **not an Ookla Speedtest clone** (no independently selected nearest test-server fleet, no TCP-level diagnostics). Never interpret website HEAD probes as destination-country speed.
- The original roster is explicitly **not a statistically unbiased sample**: some markets overrepresent news publishers. To support defensible carrier rankings, independent verified CORS-enabled speed-test backends and a stratified audited host panel are still required.
- Tests verified two independent rounds per site (14 market sites, 17 app sites), reproducible plan/provenance data, single-vs-parallel profile records, traffic budget accounting and profile/round export in CSV.

## v4.7 — Wi-Fi speed testing and desktop workstation layout

**New Wi-Fi workflow:**

- Open the mobile **网速测试** menu, then **Wi-Fi 专项测速**; desktop users can open **Wi-Fi 测速** directly from the new sidebar.
- Connect the device to Wi-Fi in **system settings first**. The page labels the next run `Wi-Fi` (manual). On browsers that positively report `cellular` it warns and prevents a misattributed Wi-Fi test. iPhone Safari generally cannot reliably identify the physical radio type or SSID.
- Run the existing Cloudflare HTTP baseline (download speed, P10, request-time latency and optional upload), now stored as a new chronological record in `speedRuns`. The previous latest `local` result and existing history key remain for compatibility.
- Compare the latest Wi-Fi result with the latest 4G / 5G result, including their timestamps and speed-difference percentage. This is a **historical** comparison, not simultaneously controlled testing. The page also displays the Wi-Fi trend and the last eight speed tests.
- The standard speed-test page offers a manual mode selector: Wi-Fi, 5G, 4G/LTE or Ethernet. Selection **does not change the device connection**.
- CSV now exports the original sample points from every retained speed run (up to 80 runs), including connection type and observation context. Existing prior results are migrated into the speed-history list only once when available.
- The HTTP download target is a Cloudflare test endpoint, which may be served outside the user's physical location. This is **not** a Wi-Fi signal or LAN link-speed measurement, and the webpage cannot read SSID, RSSI/RSRP, RF channel, negotiated PHY rate, router make or other-app throughput.

**Desktop UI:** On browser widths 1080px and wider, the layout becomes a dashboard workstation with a sticky left navigation sidebar, right content workspace, larger status preview, three-column function cards and roomier chart/results panels. Medium and mobile layouts remain responsive; the iPhone home keeps six compact entries without adding a seventh row.

**Test coverage:** JavaScript parsed, no duplicate IDs, six home cards and desktop sidebar nodes verified, Wi-Fi test and subsequent 5G test simulated to completion, independent Wi-Fi vs 5G results retained, Wi-Fi trend rendered, CSV exported both networks, and page navigation supported. Real hardware Wi-Fi/5G measurements and physical-browser screenshot testing are still required for end-to-end verification.

## v4.6 — Adaptive iPhone Web App

- The mobile home now flexes with the available dynamic viewport (`100dvh`) and safe areas: six menu tiles grow to use taller screens instead of leaving a large blank lower area. Short iPhones keep comfortable minimum touch targets and scroll if needed rather than clipping controls.
- The Web App manifest uses `display: standalone`, an app name, icon, start URL and scope. A 192×192 PNG and SVG icon are served by the Cloudflare Worker; the iPhone page includes Apple-specific Web App metadata.
- The tiny `+` button in the header opens iPhone installation instructions. **In Safari**, open the page → Share → Add to Home Screen → enable **Open as Web App** → Add. An in-app browser may not expose this flow, so open Safari first.
- Network-first service worker caches only the last page shell for offline fallback and **does not cache speed tests, origin checks, API calls, or traffic samples**. Actual diagnostics require an active connection.
- All existing service functions, roaming context, history schema, local/cross-market tests, PWA-independent browser mode and GitHub commit history remain intact. Version/deployment and test boundaries are recorded in CHANGELOG.md.

## v4.5 — One-screen iPhone launcher

- The iPhone home page is further compressed: four metrics in one summary row, six function entries in a 2×3 grid (~74 CSS px per tile on typical phones), one full diagnosis action and a settings shortcut.
- Mobile home-only rules remove the long summary, history and footer from view. Full detail pages retain rich, scrollable content and network testing settings.
- The running full diagnosis remains cancellable from the bottom status bar; live progress percentage is also visible on the main action instead of opening a large home progress panel.
- Tested by simulated interface interactions and deployed to Cloudflare as described in CHANGELOG.md. A physical iPhone Safari visual QA is still outstanding, and some shorter browser viewports may still require scrolling.

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
