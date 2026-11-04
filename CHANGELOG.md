# SIMBA Network Watch — Version History

This file is a human-readable index of the Git commit history. **GitHub commits and diffs are the authoritative record.** Milestone commits below are not Git tags, release objects, or automatically deployed builds.

Project: https://github.com/ArthurUker/simba-network-watch  
Full history: https://github.com/ArthurUker/simba-network-watch/commits/main/

## v5.1 — China Unicom / Mainland connection degradation & refresh recovery (2026-11-04)

**Cause diagnosis:** Production uses only `simba-network-watch.renkangguo.workers.dev`, and the connected Cloudflare account has **zero managed DNS zones or Worker Custom Domains**. Independent measurements show substantial blocking/interference of `workers.dev` in mainland China; global Cloudflare routing does not provide ordinary mainland edge servers. No JavaScript patch can guarantee that an unresolvable/blocked origin hostname works. The app was also hardcoded to external `speed.cloudflare.com/__down` even when the shell loaded. This release improves graceful degradation when the site itself is reachable; a mainland-accessible self-hosted domain/backend remains necessary for reliability.

- [b4ee484](https://github.com/ArthurUker/simba-network-watch/commit/b4ee4842b72fdb753112cf4d4d5e310c8dd45fa2) — Added bounded same-origin `GET /api/down?bytes=...` (max 6MB; no-store/no-transform) and `GET /api/health` version probe. Test responses contain only generated data; no China-local speed server is implied.
- [b304e54](https://github.com/ArthurUker/simba-network-watch/commit/b304e54502bcb6fd7971d5c44853540ffeed497b) — New endpoint source selector, connection warning UI and retry/endpoint-diagnosis surfaces.
- [086feb4](https://github.com/ArthurUker/simba-network-watch/commit/086feb4c0861ba366975557d94cac48592e0939d) — Default auto selection prefers Worker source for mainland physical/observed-IP location; external benchmark failures fall back to Worker; error runs report partial failure instead of success; per-run source metadata preserved.
- [f332a7f](https://github.com/ArthurUker/simba-network-watch/commit/f332a7f0b99c0f81a9ed0fb2d188890360b254cc) — PWA navigation request times out after 5.5s and reveals cached/offline fallback rather than waiting indefinitely; rotated shell cache to `network-watch-shell-v51`.
- [686a0b0](https://github.com/ArthurUker/simba-network-watch/commit/686a0b0894f7d4cbfc798cdbe6a1400d77be1c57) — Final deployed application source: initial same-origin self-check, user-facing retry actions, actual server provenance, and prevention of mixed-server speed samples.
- README and [METHODOLOGY.md](./METHODOLOGY.md) updated with mainland delivery limitations and a domestic deployment requirement.

**Deployment:** Cloudflare Worker `simba-network-watch`, deployment `bab2fad0-ee29-45c7-a9d1-c580cf9729f0` created **2026-11-04 12:21:25 UTC** (20:21:25 China Standard Time). Version `bf6e3714-d23a-4d25-ae21-d4b0020fe0dc` receives **100% traffic** and subdomain is enabled according to Cloudflare API. Source built from GitHub `index.html` commit `686a0b0`, Worker template `b4ee484`, PWA script `f332a7f`.

**Tests:** JS parsed and 208 unique DOM IDs validated; simulated mainland `CN` test ran through Worker with no external Cloudflare requests, auto mode on a non-CN market switched from failed external endpoint to Worker, and neither endpoint succeeding resulted in `部分失败` with no invented speed. A Worker route mock returned 1,048,576 requested bytes (200), rejected invalid or oversized values (400/413), returned health JSON (5.1) and the correct version header. Cloudflare's actual headless browser opened the new public site and fetched `/api/health` and `/api/down?bytes=262144` successfully (HTTP 200, exactly 262144 bytes). This did **not** test China Unicom, China mainland DNS blocking, or a real phone: the public `workers.dev` hostname can still be unavailable even though the deployment succeeded.

**Next infrastructure dependency:** provision or connect a legally compliant, independently reachable Chinese-domain frontend + local speed server (e.g. mainland VPS with appropriate ICP filing) and use the existing global Cloudflare Worker only as a cross-border comparator. The current Cloudflare account has no zones to attach a custom domain through the connected API. Attaching an overseas custom domain alone does not guarantee mainland accessibility.

## v5.1 — Mainland China degraded-network recovery (2026-11-04)

- [b4ee484](https://github.com/ArthurUker/simba-network-watch/commit/b4ee4842b72fdb753112cf4d4d5e310c8dd45fa2) — Same-origin bounded Worker `/api/down` and uncached `/api/health` plus version header.
- [b304e54](https://github.com/ArthurUker/simba-network-watch/commit/b304e54502bcb6fd7971d5c44853540ffeed497b) — Mainland warnings, test-source selection and endpoint diagnostics interface.
- [086feb4](https://github.com/ArthurUker/simba-network-watch/commit/086feb4c0861ba366975557d94cac48592e0939d) — Automatic mainland/blocked-external fallback and recorded source provenance.
- [f332a7f](https://github.com/ArthurUker/simba-network-watch/commit/f332a7f0b99c0f81a9ed0fb2d188890360b254cc) — 5.5-second PWA navigation timeout, honest offline fallback and cache rotation.
- [686a0b0](https://github.com/ArthurUker/simba-network-watch/commit/686a0b0894f7d4cbfc798cdbe6a1400d77be1c57) — Final deployed application source: explicit source labels, connectivity controls and prevention of mixed-server throughput statistics.
- README and METHODOLOGY updated to distinguish foreign Worker download from a genuine mainland-hosted node.

**Production deployment:** Cloudflare Worker `simba-network-watch`; deployment `bab2fad0-ee29-45c7-a9d1-c580cf9729f0`, created 2026-11-04 12:21:25 UTC (20:21:25 Asia/Shanghai). Version `bf6e3714-d23a-4d25-ae21-d4b0020fe0dc` receives 100% of traffic, according to Cloudflare API. Original domain retained.

**Actual online browser validation:** Cloudflare Browser Rendering loaded the production URL and executed uncached same-origin requests. Health returned `version=5.1`; `GET /api/down?bytes=262144` returned HTTP 200 with exactly **262144 bytes**. Script syntax, unique DOM IDs and simulated China Unicom selection/non-China external failure/total outage flows passed. **Not verified using a physical China Unicom SIM or mainland Internet route.** This Cloudflare account lists no managed DNS zones or Worker custom domains. The `workers.dev` public entrypoint may itself be inaccessible over mainland carriers; frontend fallback cannot cure a blocked hostname.

## v5.0 — Desktop results-first live speed workstation (2026-11-03)

- [278bb46](https://github.com/ArthurUker/simba-network-watch/commit/278bb466bf7dfc4595179ad5315351f92b456e65) — Desktop home performance board: large download and upload metrics, idle/download-loaded latency and inflation, P10/P50, live download curve, progress, manual mode selector, context metadata and compact six-function utility cards.
- [cca908f](https://github.com/ArthurUker/simba-network-watch/commit/cca908f175a8c6a3f7178c99a0b4a856cc5cee6a) — Wired all desktop interactions and live update hooks: start speed/full scan, stop, single-vs-four-stream mode, upload opt-in, advanced settings, sampling chart, last-result labels, and state transitions.
- [797068b](https://github.com/ArthurUker/simba-network-watch/commit/797068b4fdb3b0ae94939197103f3af37a7b6d81) — Added constrained, same-origin Worker `POST /api/upload` (up to 1MB/request; 500KB used per test), validates source origin and uploaded byte receipt, returns no-store JSON; updates `x-network-watch-version: 5.0`.
- [5bc0133](https://github.com/ArthurUker/simba-network-watch/commit/5bc01335b8ec0233061e1fdfa4bff131d016a5d6) — Exact deployed v5.0 `index.html`, switching opt-in upload to the same-origin endpoint and recording `methodVersion=http-baseline-v50` and upload source. v4.9 historical HTTP idle/loaded metrics are retained with their definitions.
- [a768212](https://github.com/ArthurUker/simba-network-watch/commit/a768212e73905d122cad5294b7b3069540ce85e3) — Rotated PWA shell cache to `network-watch-shell-v50`.
- README and METHODOLOGY updated to explain the result-first design, upload payload sizing and remaining methodological differences from official Cloudflare Speedtest.

- [1b3526e](https://github.com/ArthurUker/simba-network-watch/commit/1b3526e49ffc76e9a46ddc99b93c013a96512514) — Visual QA fix: prevents desktop title and three action controls from squeezing into a narrow column at a 1152px-wide window. **This is the final deployed application commit.**

**Latest production deployment:** Cloudflare Worker `simba-network-watch`, deployment `eeb8d243-3a97-4e63-9df7-352b90c630f2`, created **2026-11-03 07:42:36 UTC** (15:42:36 Singapore time). Version `a417b6ef-c340-41c8-b07e-4ea32f5fa011` receives **100% traffic** and the public subdomain is enabled. Built from `index.html` at `1b3526e`, Worker template at `797068b` and SW at `a768212`.

**Prior initial deployment:** `faf1a10a-11e8-4abf-a7f0-6e44895120b7` (15:38:38 SGT) at `5bc0133`, superseded by the corrected deployment above.

**Actual browser rendering QA:** Cloudflare Browser Rendering opened the public `?v=5.0` URL and returned real rendered HTML plus a desktop screenshot. The page contained the v5.0 speedboard. At 1152×720 the initial layout squashed the heading; this was corrected in `1b3526e` and a second live screenshot showed a horizontal title and working layout. No real carrier measurements or physical-device tests were performed.

**Simulated verification:** JavaScript syntax + 199 unique DOM IDs; desktop initial state, manual profile/optional upload controls, 4-stream download, actual same-origin Worker upload receipt, RTT and raw chart rendering completed in a simulated environment; source status correctly transitions back to ready. Worker response routing separately tested for a 500,000-byte accepted upload (200 with byte receipt), oversize (413), foreign browser Origin (403), wrong method (405), root HTML (200, version=5.0) and ping (204). External production URL fetching through the verification browser was unavailable, so **real desktop visual QA and carrier measurements are not claimed**; deployment was verified through the Cloudflare API.

**Limitations:** This is **inspired by** Cloudflare's result-first UX but is not its upstream `@cloudflare/speedtest` engine. P90 here is the 90th percentile of individual measured HTTP transfer sample speeds, not necessarily Cloudflare's calculation. Optional Worker upload involves two 500KB HTTP round trips and may underestimate fast uplinks. Download uses `speed.cloudflare.com/__down`, while latency and uploads use this project's own Cloudflare Worker and can take different network paths. Do not interpret opaque website probes as guaranteed app availability or geographic link capacity.

## v4.9 — Unified speed dashboard, HTTP idle & loaded latency (2026-11-03)

- [a226051](https://github.com/ArthurUker/simba-network-watch/commit/a226051bdc3a10ba23b063f7c219bae387479bff) — Redesigned speed test detail into a coherent result-first panel: download P50, opt-in upload, idle/load HTTP delay, delay inflation, jitter, P10/P90 and download data usage; responsive iPhone/desktop presentation.
- [10215dc](https://github.com/ArthurUker/simba-network-watch/commit/10215dcb9110d7a9c378471bf38afaf00f5f578b) — Implemented same-origin Worker /api/ping idle and overlapping download/upload HTTP timing probes, stored raw RTT lists, sample percentiles and method `http-baseline-v49`, updated real-time feedback and detailed CSV export.
- [7777588](https://github.com/ArthurUker/simba-network-watch/commit/77775888d4308b420cd5406303ae68d02dcc8823) — Exact deployed `index.html` source; prevent historical v4.8 speed-test download timing from being relabeled as v4.9 Worker idle delay.
- Documentation updates: v4.9 README and METHODOLOGY.md now specify percentile calculations, HTTP paths, overlap sampling, limitations and legacy migration behavior.

**Production deployment:** Cloudflare Worker `simba-network-watch`, deployment `71ebc6e9-7f9b-4100-903e-03d406466e76` created **2026-11-03 06:15:08 UTC** (14:15:08 Singapore time), version `ebfd81c1-9db9-4498-8671-c32563b5757c`, 100% traffic confirmed by Cloudflare API, Workers subdomain enabled. GitHub `index.html` at source commit `7777588` plus unchanged tracked Worker template and service worker were assembled and published.

**Validation:** JavaScript syntax and DOM ID checks; mocked same-origin HTTP 204 ping latency and sampled HTTP download completed; concurrent 4-stream mode completed; result stored with separate idle vs download-loaded timing, P10/P50/P90 and `http-baseline-v49` method; CSV exported raw idle and loaded RTT records. Simulated upload endpoint failure preserved `uploadSpeed=null` and an explicit error rather than fabricating zero. The independent external URL fetch was unavailable in the verification tool; production Worker deployment was verified by its API, but real iPhone/desktop rendering and actual SIMBA/Wi-Fi performance remain unverified.

**Measurement constraints:** The speed payload is downloaded from `speed.cloudflare.com`, while HTTP idle and loaded probes go to this site's own Cloudflare Worker `/api/ping`. They may have differing routing and scheduling. HTTP load overlap is a useful application-level timing indicator, **not** ICMP ping, TCP-queue delay or the official Cloudflare Speedtest algorithm. The optional upload may be blocked by CORS. Old v4.8 RTT is not displayed as new idle RTT.

## v4.8 — Auditable target selection and Speedtest-inspired benchmark profiles (2026-11-03)

- [aa9c132](https://github.com/ArthurUker/simba-network-watch/commit/aa9c132576078e29c6e666b051265d104a1c2563) — Page-level transparency: full website/app target roster, explicit selection limitations, source-visible audit section and speed-profile selector.
- [2b6b83b](https://github.com/ArthurUker/simba-network-watch/commit/2b6b83b30122f442c0dcfe7f8b65a41cb6e34490) — Two-round staggered test schedule using recorded seed and fixed roster version, original order and round saved with every site probe, CSV provenance rows.
- [106da5b](https://github.com/ArthurUker/simba-network-watch/commit/106da5b2dab49c428447636307e3216c49fe4128) — Optional four-concurrent-request aggregate throughput test, retaining the single-request distributed-stability method, transfer budget, original samples and mode metadata.
- [bd248a9](https://github.com/ArthurUker/simba-network-watch/commit/bd248a9e8259983f655d2fb9bd7b8672cebc13e7) — Opaque cross-site HEAD requests explicitly labeled **unverifiable**, not website-success or remote bandwidth.
- [9fc2186](https://github.com/ArthurUker/simba-network-watch/commit/9fc2186b9dfbc7700c43f139cb378f1945426c5c) — [METHODOLOGY.md](./METHODOLOGY.md): formal limitations and process; Ookla public methodology, LibreSpeed, M-Lab NDT7 and Cloudflare test-engine references; roadmap for credible server stratification.
- [620a51c](https://github.com/ArthurUker/simba-network-watch/commit/620a51c3c20eedbbaf1bfdb397f8c3e0a3699251) — Final v4.8 application source deployed: direct methodology link in the site's audit section.
- [f4e2fdd](https://github.com/ArthurUker/simba-network-watch/commit/f4e2fddcdd34a93ad050a7e96a44dfe72fb585b3) — README v4.8 release notes and known sample-selection bias.

**Cloudflare deployment:** worker `simba-network-watch`; deployment `6271cd36-e7a5-41b2-9c75-6b9facf62aea` created **2026-11-03 05:55:34 UTC** (13:55:34 Asia/Singapore), version `98d73618-a260-4d0d-adea-71778c931e9b`. Cloudflare API reports **100% traffic rollout** and confirms the Worker subdomain is enabled. The Worker was built from `index.html` at GitHub commit `620a51c` with the existing version-controlled `worker-template.mjs` and `pwa-sw.js`.

**Simulated regression evidence:** Parsed script without syntax errors; 14/14 regional and 17/17 app targets each received **two attempts in separate rounds** (28 and 34 total, respectively), saved algorithm, seed and provenance; single-vs-four-concurrent local HTTP runs completed, original sample profiles and transferred bytes stored; CSV contained source-roster, seed, round, profile and stream count. No simulated runtime errors. Browser-level public HTTP opening failed in the verification environment; real iOS/desktop and live carriers were not exercised.

**Interpretation:** The pre-selected roster is transparent, **not statistically unbiased**. Browser opaque responses are not proof that a website is usable or that a target market is reachable via a local server. The four-request profile is not official Ookla Speedtest. Fair international bandwidth tests require independent verified CORS-capable nodes in each country, more diverse operators and stratified site categories.

## v4.7 — Wi-Fi speed testing and responsive desktop UI (2026-11-03)

- [4dd6dac](https://github.com/ArthurUker/simba-network-watch/commit/4dd6dac8dbae2ca84f4c726e841ef13fa4d412ee) — New dedicated Wi-Fi speed and comparison page; quick Wi-Fi, 5G, 4G and Ethernet mode selectors; large-screen desktop sidebar and results workspace.
- [0890df7](https://github.com/ArthurUker/simba-network-watch/commit/0890df7b2b56c7701aef85fa3950307f908b8765) — Persist each completed local speed test as a distinct `speedRuns` snapshot, show Wi-Fi vs 4G/5G historical comparison and timeline, draw Wi-Fi sample graph, and export *all* retained raw speed samples to CSV.
- [83d6eb5](https://github.com/ArthurUker/simba-network-watch/commit/83d6eb50264635cdfc14a6825dce8541d0051914) — Dedicated Wi-Fi test button returns the actual diagnostic completion promise to callers.
- [b5406c1](https://github.com/ArthurUker/simba-network-watch/commit/b5406c1b7a9816b62839ac3ab19f488c5381087d) — iPhone-friendly home menu text and prominent Wi-Fi specialty entry within speed-test details. **Exact deployed application source commit.**
- [f623a56](https://github.com/ArthurUker/simba-network-watch/commit/f623a56258708c1e113a74b5a6982dbe1952ed98) — Updated project README with Wi-Fi test and desktop UI usage/accuracy limitations.

**Cloudflare deployment:** Worker `simba-network-watch`, deployment `9cabf3cd-2130-4349-9538-9a0c217c7bd1` created 2026-11-03 01:54:37 UTC (09:54:37 Singapore time), version `6136ef1b-a4b4-470d-9411-e5dfb98902fd`, 100% traffic confirmed by Cloudflare API. Built from GitHub source `index.html` commit `b5406c1`, together with the previously committed `worker-template.mjs` and `pwa-sw.js` files. GitHub commits preceded deployment.

**Test coverage:** JavaScript syntax + DOM uniqueness check; simulated Wi-Fi local download completed and saved as `kind=wifi` / `network=Wi-Fi`; subsequent 5G local download completed separately; independent Wi-Fi and cellular speed histories, trend graph and CSV export checked; all six existing home menu entries retained, new desktop sidebar navigation rendered in source. Real Wi-Fi and cellular test measurements and visual screenshots in physical desktop/iPhone browsers were **not** executed. Independent web fetch of the public URL was not available from the verification environment.

**Limits:** Connection type is manually selected and must match the device's actual Wi-Fi/4G/5G state. Where a browser definitively reports cellular, the Wi-Fi-specific action warns instead of attributing the result to Wi-Fi. iPhone Safari generally cannot detect SSID, Wi-Fi RF signal strength, channel or negotiated link speed. Cloudflare HTTP throughput is not Wi-Fi LAN throughput, and historical Wi-Fi and cellular measurements are not synchronized experiments.

## v4.6 — Adaptive Web App / iPhone Home Screen (2026-11-02)

- [018bbb7](https://github.com/ArthurUker/simba-network-watch/commit/018bbb780fbf4f8343ef21c6534c9d7d6f0b87c9) — Actual deployed `index.html`: iPhone dynamic-viewport adaptive launchpad using `100dvh`, safe-area insets, proportional 2×3 menu resizing and short-screen fallback; a compact “add to Home Screen” guide; Web App meta and service worker registration.
- [9997206](https://github.com/ArthurUker/simba-network-watch/commit/9997206eb2b2bb996b70fd70391f91b0b7a6b943) — Version-controlled `pwa-sw.js` with network-first navigation and offline shell fallback, bypassing API and test payload caching.
- [cfc8593](https://github.com/ArthurUker/simba-network-watch/commit/cfc85935ed3f8d7baa4303202ed65e57020c6718) — Version-controlled Worker routing for PWA manifest, same-origin service worker and icon assets (SVG and 192×192 PNG) while retaining HTTP diagnostics endpoints.
- **Deployment:** Cloudflare Worker `simba-network-watch`, deployment `9eb7fc46-151d-4113-9cce-00d1f6a97dd0` created 2026-11-02 00:43:33 UTC (08:43:33 Singapore time); version `bebdc68b-e72f-4f8b-af5d-69368426b240` receives 100% traffic. The Worker was assembled from the above GitHub source files, committed before deployment.
- **Tests:** JS syntax/DOM-ID checks, mocked iPhone-style navigation through six feature destinations and a complete test run, install modal, SW registration, manifest, SVG/PNG icon endpoint, no-store API and ping route checks. These passed in controlled tests.
- **Limitations:** iPhone Safari real-device visual testing and publicly fetched URL verification have not been completed; external URL fetch was inaccessible to the validation tool. On short browser viewports, some scrolling remains preferable to clipping controls. Offline caching covers the application shell only; network diagnostics themselves require internet access.

## v4.5 — iPhone compact single-screen launcher (2026-11-02)

- [4550a6b](https://github.com/ArthurUker/simba-network-watch/commit/4550a6b9c11fbc92ab8e57735a2b9c77964557f9) — Exact deployed application source: home-only iPhone compact layout with four horizontally arranged overview metrics, two-column × three-row fixed-height menu tiles, reduced header spacing, and primary action. Hide long home notes, full progress card and footer on phones; retain detailed functionality and scrolling in secondary pages.
- The full-run action shows a percentage directly on the disabled start button while running and resets on completion. The foreground stop control remains available.
- Tested syntax and unique DOM element IDs; simulated navigation to all six pages and a complete run with 14 region sites / 17 app sites, preserving local measurements.
- Published to Cloudflare Worker `simba-network-watch` on 2026-11-02 00:34:50 UTC (08:34:50 Singapore time), deployment `4a59509e-7f09-4fde-8f40-03f8d0f1e460`, version `e9b2a874-4633-4111-a390-c9261fa62712`, 100% traffic confirmed by Cloudflare API. Existing version-controlled Worker template unchanged.
- Browser-based visual inspection on a real iPhone has **not** been completed. "One screen" is a responsive layout target; actual available viewport varies by iPhone size, Safari toolbars and Dynamic Type settings.

## v4.4 — Unified compact dashboard and feature navigation (2026-11-02)

- [b0a513a](https://github.com/ArthurUker/simba-network-watch/commit/b0a513a83004d823ddfd9afce53f904ba403500c) — Reorganized the mobile home into a concise network summary and six consistent feature tiles; moved detailed status and manual roaming controls into dedicated pages.
- [91ec5c2](https://github.com/ArthurUker/simba-network-watch/commit/91ec5c2345ff1ff9de3fcaa08d0ecec5a06058aa) — Connected feature navigation and routing, session history, CSV menu, detailed status, settings shortcut and full-diagnosis progress.
- [3ab4246](https://github.com/ArthurUker/simba-network-watch/commit/3ab4246ec4278d59dbee25a3ed618571fd6a111f) — Tightened mobile tile heights and layout density. **Exact deployed application code commit.**
- [f90de1a](https://github.com/ArthurUker/simba-network-watch/commit/f90de1a2107b64ab3fcf12c595188514c4eaa5b0) — Updated README to describe v4.4 interaction and tests.

**Cloudflare deployment:** Worker `simba-network-watch` deployment `c26f8598-3d68-4c77-8fbd-519204c181f0` at 2026-11-01 23:54:35 UTC (2026-11-02 07:54:35 Asia/Singapore). API confirms latest version `d5e74115-238c-44a8-9c73-a89458af17dd` receives 100% traffic. The published Worker combines `index.html` from commit `3ab4246` and the existing tracked [Worker template](./worker-template.mjs), SHA `8ec274543a53e3571f9c97c3b9ece38bf0992f85`.

**Testing:** JavaScript parsed successfully; unique HTML IDs; simulated iPhone-like DOM navigation to status, roaming, local speed, region, app and history pages; simulated complete diagnostic, 14 market websites and 17 application websites, CSV export and settings route. All passed in the simulated harness. Real iPhone Safari visual/browser testing is still outstanding; an external public URL fetch was not accessible from the verification environment and therefore has not independently confirmed on-device rendering.

**Data integrity:** Existing `simba-network-watch-v3` localStorage data schema and original measurement behavior retained. Network health is not fabricated from signal strength or browser status. Source remains GitHub-first, Cloudflare deployed manually after commits.

## v4.3 — Auto-detected public network and live HTTP telemetry (2026-11-02)

- [7af8d2b](https://github.com/ArthurUker/simba-network-watch/commit/7af8d2b3f05338ec124f22474da1ea5afcd75358) — Compact iPhone-first network status panel; manual location, SIM and roaming forms collapsed by default.
- [a9ac48f](https://github.com/ArthurUker/simba-network-watch/commit/a9ac48f5ff3f172b56aa87f151659e2d2791f8c8) — Cloudflare Worker adds colo, HTTP protocol, optional edge RTT and lightweight no-store /api/ping.
- [788dbfe](https://github.com/ArthurUker/simba-network-watch/commit/788dbfe6575907bb95e8d5f27cf5418a44b2768f) — Automatic ASN organization and IP region, supported browser connection API, repeated HTTP latency tests, and active test-rate display.
- [0db575f](https://github.com/ArthurUker/simba-network-watch/commit/0db575fea706325457079000fb9fb371b27a25d7) — Stream HTTP download chunks to update test speed during data receipt without additional traffic; retain buffered response fallback.
- [22039f5](https://github.com/ArthurUker/simba-network-watch/commit/22039f53fee8d3449b813f174932676b83968fec) — Clearly show manual SIM / roaming provenance and distinguish HTTP RTT from optional Cloudflare edge transport RTT.
- [48caf91](https://github.com/ArthurUker/simba-network-watch/commit/48caf91b13a7984fe8d5df139d5d74a954413e8b) — Draw speed trend progressively during test; refresh network identity on supported connection changes / browser foreground return.
- [e596ee3](https://github.com/ArthurUker/simba-network-watch/commit/e596ee3ac786dd44ced259ffe3540aeecb16034a) — README capabilities, data limits, and Safari restrictions.

**Production deployment:** Cloudflare Worker `simba-network-watch`, deployment `35a4cdf6-c5f4-474e-b75a-b26bde2b685c` at 2026-11-01 23:18:18 UTC (2026-11-02 07:18 SGT). Cloudflare API reports 100% rollout. Source app `index.html` at [48caf91](https://github.com/ArthurUker/simba-network-watch/commit/48caf91b13a7984fe8d5df139d5d74a954413e8b) and Worker template at [a9ac48f](https://github.com/ArthurUker/simba-network-watch/commit/a9ac48f5ff3f172b56aa87f151659e2d2791f8c8), both committed before deployment.

**Validation:** JavaScript syntax and DOM ID uniqueness, simulated iPhone without Network Information API, stream-based HTTP test-rate updates, per-sample chart updating, unchanged test-session storage, and Worker route checks for /api/network-info and /api/ping. Browser-level public HTTP access and real physical-device cellular signal tests were not verified.

**Accuracy boundaries:** A public-IP ASN/organization is not reliably the SIM carrier or visited roaming radio network. Safari cannot read LTE/5G RAT, Wi-Fi or cellular signal bars, RSRP, RSRQ or SINR. The displayed "live download" exists only during app-initiated HTTP transfers; it is not the total cellular data rate of other apps. Browser effectiveType `4g` where available means a performance tier, not LTE.

## v4.2 — International roaming, visited network and IP egress (2026-11-02)

- [89538da](https://github.com/ArthurUker/simba-network-watch/commit/89538da722b6684138ec64dc32b0cd0b9a842e83) — Roaming mode, SIM home country, visited network and public IP egress fields in compact mobile UI.
- [88b6fc1](https://github.com/ArthurUker/simba-network-watch/commit/88b6fc1a197dc296cfc4688fb9881c86550cedbd) — IP egress observation from Cloudflare, persisted per-test roaming metadata, and refresh before a run.
- [edbe38c](https://github.com/ArthurUker/simba-network-watch/commit/edbe38c8df73e5b9b3ba3d285e9b607184e340dd) — Separate physical-origin market and public-IP market labels in regional results.
- [502cb70](https://github.com/ArthurUker/simba-network-watch/commit/502cb701d7902303668ed7ca75eaaf610360b4b7) — Full CSV roaming fields and evidence context.
- [887e0dd](https://github.com/ArthurUker/simba-network-watch/commit/887e0dd163da698b1a7a6f7fb10aab7354e75225) — Most recent application code commit; handle unknown IP region codes.
- [7bc8fa5](https://github.com/ArthurUker/simba-network-watch/commit/7bc8fa52bc9ae5ea06f042d706bbd831ffe39a24) — Version-controlled [Cloudflare Worker source template](./worker-template.mjs), including same-origin /api/network-info endpoint (estimated IP country and ASN, never a raw IP response).
- [a68b1fc](https://github.com/ArthurUker/simba-network-watch/commit/a68b1fcb0e3d7e22bf147240e7ea14ded05fda8c) — Usage documentation and routing caveats.
- [02204ab](https://github.com/ArthurUker/simba-network-watch/commit/02204ab6f711793a832e3aff0bd40ea209d00ec3) — Clarify the distinction between SIM home provider and visited radio carrier.

**Live deployment:** Cloudflare Worker `simba-network-watch`; deployment ID `0a4d729b-52e2-4a6a-a991-1d11f808b8c1` at 2026-11-01 22:58:39 UTC (2026-11-02 06:58 SGT). Cloudflare reports 100% rollout to the newest Worker version. Source artifacts: `index.html` at application commit `02204ab`, `worker-template.mjs` at `7bc8fa5`. Changes were pushed to GitHub before Cloudflare publication.

**Validation:** Simulated Singapore-egress / SIMBA-home / China-visited China Telecom roaming; Chinese website displays physical-market-same / egress-market-different and Singapore website the reverse. Confirmed persisted context, original throughput results and CSV evidence, Worker route tests, unknown country handling and no raw visitor IP in endpoint payload. Real phone/roaming traffic and independent public URL browsing were not verified.

**Limitations:** A Cloudflare-estimated public IP country is not proof of physical location, actual network path, local breakout or home routing; classifications are market-relative indicators. No automatic detection of SIM ownership, radio attachment or roaming status is claimed.

## v4.1 — Multi-carrier, location-relative reporting and smoother charts (2026-11-02)

- [db7896f](https://github.com/ArthurUker/simba-network-watch/commit/db7896f5873e2675278a7c63c43d6b2353ece6d3) — Removed SIMBA-only product wording; added measurement country and carrier selector with China Unicom and other carriers.
- [7bbc22f](https://github.com/ArthurUker/simba-network-watch/commit/7bbc22f2728ea6da1fcec6c072e96833d46ab51e) — Saved country and carrier per test, migrated previous browser preferences.
- [8437ee4](https://github.com/ArthurUker/simba-network-watch/commit/8437ee478ecd10dfb70a989f933e5a5a79b96b6f) — Classified website markets relative to country **at test time**, without retroactive reinterpretation.
- [9b20a23](https://github.com/ArthurUker/simba-network-watch/commit/9b20a23181cce8f4957444ec8391d9cfd1e289a6) — Added display-only 5-sample rolling median and smooth curve, with original samples and a raw-trend toggle.
- [459684f](https://github.com/ArthurUker/simba-network-watch/commit/459684fe1800f4e57e3503843b2be42cf9a35d93) — Exported country, carrier, market classification, and original throughput values in CSV.
- [e75625b](https://github.com/ArthurUker/simba-network-watch/commit/e75625b6f6ff5e284fb9e0d01ec5ce72cd91784c) — Updated documentation and measurement limits.
- [78856fa](https://github.com/ArthurUker/simba-network-watch/commit/78856fa85a5411bf6076c646a1b1a39b283bd181) — Clarified Cloudflare-only baseline to prevent confusing it with a verified domestic node.

**Production deployment:** Cloudflare Worker `simba-network-watch`, deployment `4a3aa7a0-8546-4cb6-861d-6601fd564d4a` at 2026-11-01 22:38:21 UTC (2026-11-02 06:38 SGT), source application commit [`78856fa`](https://github.com/ArthurUker/simba-network-watch/commit/78856fa85a5411bf6076c646a1b1a39b283bd181); Cloudflare API reports 100% rollout. Live HTTP/browser validation remains separate.

**Scope caveat:** "same-market / cross-market" is a site-market categorization, not verified server geography or cross-border traffic. Cloudflare baseline is not guaranteed to be in the selected country. The previous `simba-network-watch-v3` history key is retained.

**Validation:** Static JavaScript syntax check, simulated full-run checks for China mainland + China Unicom and Singapore + SIMBA, preserved historical scan attribution after switching origin, smooth and raw chart rendering, and origin-aware CSV contents. Real China Unicom / SIMBA network verification and on-device Safari screenshot testing were not performed in this development session.

## v4.0 — Dashboard-first interface (2026-11-01)

- [e4fd9e0](https://github.com/ArthurUker/simba-network-watch/commit/e4fd9e038813a4d23a0b4c227bf25e5bbb9541f5) — Redesigned mobile-first dashboard with four at-a-glance results and visible four-stage progress.
- [0b413a1](https://github.com/ArthurUker/simba-network-watch/commit/0b413a1dafdda6b9ed53d89a563f76ab31aba6c0) — Added seven-market and six-service result chips, explicit manual network labeling, and actionable insights. **Latest v4 app-code commit.**
- [5cb46a1](https://github.com/ArthurUker/simba-network-watch/commit/5cb46a1c233c08336b37651b04172697fdc9307f) — Updated README, limitations, and design reference notes.
- Deployment: v4 app manually uploaded to Cloudflare Workers on 2026-11-01 at 14:57:22 UTC; Workers API reported 100% rollout. The GitHub repository is **not** presently configured for automated Cloudflare deployment.

## v3.0 — Multi-stage diagnostics (2026-11-01)

- [8d9890c](https://github.com/ArthurUker/simba-network-watch/commit/8d9890c6fa1af469936c09e660fb6280ca1f65ca) — Long-duration local bandwidth sampling, seven-market browser probes, six application categories, and export.
- [ee47b66](https://github.com/ArthurUker/simba-network-watch/commit/ee47b66771a187e1ebcb0f745f935693a6d373a1) — Optional real-download measurements from user-supplied HTTPS/CORS region endpoints and legacy records preservation.
- [e44cbce](https://github.com/ArthurUker/simba-network-watch/commit/e44cbce2a4022c585a434659b59495392b731e42) — Fixed region endpoint settings restoration and active diagnosis stage.
- [1cb0b5c](https://github.com/ArthurUker/simba-network-watch/commit/1cb0b5c0858bfc95e9cbaefc06b1650205019c27) — Twenty-second video chunk simulation and timed exports.
- [0b8ec2c](https://github.com/ArthurUker/simba-network-watch/commit/0b8ec2c349d2aaaa1e5d326927a954f817990114) — Documentation for multi-stage test limits.
- [f1cad3e](https://github.com/ArthurUker/simba-network-watch/commit/f1cad3ebd284f8b505504d4a13a3c7af5e898515) — Adaptive sample sizes for bandwidth tests under a fixed data budget. **Latest v3 app-code commit.**

## v2.1 — iPhone Safari fixes (2026-11-01)

- [4742a70](https://github.com/ArthurUker/simba-network-watch/commit/4742a70fd5e06754ae6db07983c65da4204f56fc) — Fixed undeclared variables in history rendering, separated successful throughput results from UI errors, condensed mobile layout.
- [cc57fdc](https://github.com/ArthurUker/simba-network-watch/commit/cc57fdcbc8d96b53eecc47b076bef185d8d5f0ae) — Documented v2.1 fixes.

## v2.0 — Mobile-first single-action interface (2026-11-01)

- [fc88209](https://github.com/ArthurUker/simba-network-watch/commit/fc882095ec4eec0bf11f6833c92db44e0feba5f1) — Introduced large one-tap test and buffering marker actions, streamlined mobile UI, short history and trend view.
- [282653b](https://github.com/ArthurUker/simba-network-watch/commit/282653b98e5ddc53bbc3fbbc962671bb2ee36de7) — Updated v2 documentation.

## v1.0 — Initial published prototype (2026-11-01)

- [f41e8d7](https://github.com/ArthurUker/simba-network-watch/commit/f41e8d75d609d71ed211450980b5501e0781b309) — Repository's initial commit.
- [48ec5b8](https://github.com/ArthurUker/simba-network-watch/commit/48ec5b8c331ab9c4d002b0b646de1926d5501ab8) — Published initial static web app in `index.html`.
- [f345415](https://github.com/ArthurUker/simba-network-watch/commit/f345415e22411b319423d5321b067ee9deaf2b4a) — Expanded project documentation.

## Repository housekeeping

- [7610bf6](https://github.com/ArthurUker/simba-network-watch/commit/7610bf61ae80ff4a644fce8dbacc385cfa29113a) — Fixed README license statement to agree with the pre-existing MIT `LICENSE` file.
- The source code versions above exist as immutable Git commits; **no version tags or formal GitHub Releases are claimed here**.
- See [DEVELOPMENT.md](./DEVELOPMENT.md) for the requested GitHub-first change and deployment traceability workflow.
