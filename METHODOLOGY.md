# Network Watch — Measurement and Target-Selection Methodology

Version: **5.1**, 2026-11-04. The repository code and this document, not the visual status badges, are the authoritative description of how the tool measures.

## 1. Core principle: separate different questions

Network Watch distinguishes **HTTP baseline throughput** to a Cloudflare speedtest service, **browser-restricted website probes** and **user-managed CORS-enabled throughput nodes**. These are distinct experiments and do not yield a single valid “international network quality” score.

| Measurement | What is observed | What cannot be established |
|---|---|---|
| HTTP baseline download to speed.cloudflare.com/__down | Application payload bytes / elapsed transfer time; median and P10 sampled speeds | Cellular radio link speed, Wi-Fi PHY speed, ISP advertised tier, distance/physical country of Cloudflare service |
| HTTP baseline request times | Round-trip HTTP request duration | Raw ICMP Ping, radio RSRP, modem latency alone |
| Website market and app probes | Promise resolution or failure of a browser `HEAD` request with `mode: 'no-cors'` | HTTP status code, complete page loading, login/playback availability, real remote-country bandwidth |
| User-configured HTTPS speed nodes | Transfer speed measured from CORS-visible payload when a test server actually supports it | Independently verified physical location, unless separately audited |
| Provider and network labels | What user manually selected | Verified SIM operator, roaming network, Wi-Fi SSID, LTE vs 5G radio access |

**An opaque response is not an HTTP 200 response and cannot prove website usability.** A browser CORS restriction, captive portal, CDN, local cache or block can affect interpretation. Probes cannot see app-level playback or regional routing, and they should never be reported as actual country-to-country throughput.

## 2. Current target catalogue — fixed, manually selected, NOT statistically representative

The exact predeclared catalogue is coded in `REGIONS` and `APPS` in [index.html](./index.html), and displayed in the Network Watch interface under **跨境连接 → 选站依据与完整测试名单**.

**Seven website market categories, two public HTTPS domains per market:**

- Singapore: Gov.sg, CNA
- Malaysia: The Star, Malay Mail
- Mainland China: Baidu, Bilibili
- Japan: Yahoo Japan, Rakuten
- United States: Google, Wikipedia
- United Kingdom: BBC, The Guardian
- Australia: ABC Australia, Sydney Morning Herald

**Six application categories, seventeen websites in total:**

- General websites: Google, Wikipedia, CNA
- Video: YouTube, Netflix, Bilibili
- Social: Instagram, Facebook, Reddit, Weibo
- Messaging: WhatsApp Web, Telegram Web
- Productivity: GitHub, Microsoft, ChatGPT
- Shopping: Amazon, Shopee

These are **website market categories**, not claims about where the responding server physically resides. Popularity, site size and brand do not establish independence from a given ISP, CDN or region. The current two-per-market sample **overrepresents news sites in Malaysia, the UK and Australia** and does not control for private peering, CDN locations or regional restrictions. It is a transparency improvement, **not** a guarantee of neutrality. Do not rank countries or operators based on the counts.

### Rules implemented in v4.8

1. **Predeclare all targets.** Results do not determine which websites enter the test. No success-based cherry-picking or hidden replacement of difficult websites.
2. **Run two separate rounds.** The complete catalogue is attempted in each round, not two immediate requests to each site.
3. **Rotate/interleave reproducibly.** A recorded integer seed derives a deterministic group rotation and per-group website ordering. Source algorithm: `two-round-balanced-v1`. Together with the roster version `fixed-roster-2026-11-03` and source code, the test order is reproducible.
4. **Preserve the provenance.** Each site result stores the seed, roster version, round and order; these are exported alongside the original request duration and result. Older records without these fields stay marked as legacy/unknown.
5. **No unsupported claims.** A resolved opaque browser fetch is labeled **不透明响应**; never “HTTP success”, “working website”, or remote speed.

The schedule improves temporal balance but does **not** eliminate sample selection, CDN, protocol or time-of-day bias. The randomization source is not a cryptographic randomness source and is not needed to be one.

### Proposed validation ladder for a statistically stronger comparison

A more defensible comparison should combine:
- A *fixed, published* stratified panel within each market (for example government/public services, commercial, independent content), with multiple autonomous systems and CDN providers, audited availability, and documented replacements;
- Independently managed **CORS-enabled speed-test backends** deployed in each target country, with observable server identity, region, ASN/hosting, version, response headers and bandwidth capacity;
- At least two independent server operators per market, identical sampling schedules, warm-up and load controls;
- Multiple repetitions at day/night and on different days, alternating cellular/Wi-Fi and operators **from the same device and place**;
- Separate results for single-stream performance, parallel-stream capacity, idle latency, latency under load, P10 stability, and packet-loss proxies. Browser HTTP request errors are not packet-loss measurements.

This validation ladder is **not yet implemented** by the v4.8 site, because third-party site HEAD requests cannot act as controlled multi-country data-transfer servers.

## 3. Speed measurement modes

**Single request / time-distributed stability sampling (default):**
- Sequence of HTTP downloads from Cloudflare `/__down`;
- Download duration and cap are explicit user settings; the client samples at intervals over a chosen window;
- Reports median sample speed, P10 speed and individual recorded samples;
- The test measures HTTP application throughput and is sensitive to the chosen request/chunk size and timing.

**Four concurrent HTTP requests / aggregate throughput (opt-in):**
- At each sampling step, split the requested bytes into four partitions and issue four concurrent fetches to the **same** Cloudflare test service;
- Aggregate measured received bytes and divide by wall-clock elapsed time for the batch;
- Still obey the preconfigured total download budget, using actual received bytes;
- Record `profile=parallel`, `streams=4` and `methodVersion=http-baseline-v48`, including these fields in CSV;
- This is **closer to maximum multi-connection HTTP capacity**, but is *not an Ookla implementation*, does not automatically choose between independent servers, and does not prove a specific end-to-end cross-border route. **Do not compare the two profiles as if they had identical definitions.**

Upload may be attempted explicitly through Cloudflare `/__up`; it can fail because of cross-origin or endpoint restrictions. A missing upload result does not equal zero bandwidth.

## 3C. v5.1 network source selection, mainland fallback and non-mixed samples

- The site still originates at `simba-network-watch.renkangguo.workers.dev`. The current Cloudflare account has no active managed zone/custom Worker domain. Public evidence indicates `workers.dev` may be unreachable from mainland China, including some China Unicom connections. This is a **delivery limitation, not just an in-page JavaScript error**.
- Default **Auto** chooses this Worker's same-origin `/api/down` endpoint first when current physical location or observed public-IP country is `CN`. Otherwise it probes the external Cloudflare speed-test endpoint briefly. If unavailable, Auto falls back to this Worker's `/api/down`. User can override Auto via advanced settings.
- A Worker test payload is capped at 6,000,000 bytes/request, returns application/octet-stream with no-store/no-transform and explicit byte length, and does not require access to `speed.cloudflare.com`. **This Worker remains on Cloudflare's global edge; it is not a mainland domestic throughput server.**
- Every point records which actual endpoint returned data. If an Auto switch occurs mid-test, earlier point samples are removed from the final speed distribution and a method note is logged. Download budget still counts all received bytes; historic successful reports are never overwritten by a run with zero valid download samples.
- A same-origin health request detects apparent offline PWA shell when live networking is unavailable. The SW has a 5.5-second timeout before falling back to cached HTML or a truthful offline message. **If the hostname itself cannot be reached and no service worker is installed, none of these client-side changes can run.**
- A proper mainland comparison requires a locally hosted, legally compliant, independently reachable entrypoint and speed endpoint, followed by China Unicom + other ISP field validation. The global Cloudflare Worker should be retained as the **international** comparison target, not marketed as a domestic server.
- The code continues to avoid inventing signal strength, packet loss, HTTP success from opaque fetches, or country-to-country bandwidth.

## 3B. v5.0 desktop speedboard and bounded Worker upload

- At desktop widths ≥1080 CSS px the main page prioritizes the actual download/upload/latency numbers, live chart, manual test-profile selection and control buttons rather than a menu grid. On phones the six-item compact launchpad is preserved.
- The large completed download number uses the **P90 percentile of individual measured download HTTP sample rates** when the stored run contains a valid P90; old records use their stored median (P50), with a different label. These are not directly Cloudflare's proprietary headline values.
- Optional uploads target this site's own `/api/upload` Worker endpoint via `POST`, not Cloudflare's public `/__up`. The server parses at most 1 MB per request, acknowledges the accepted byte length and discards it immediately; the browser tests two 500 KB transfers. Success means the submitted bytes reached the Worker endpoint. Reported Mbps uses payload bytes divided by elapsed whole-request time, **including HTTP latency and server work**, so it can substantially underestimate high upload bandwidth.
- The upload endpoint accepts same-origin browser requests, checks posted size and returns an uncacheable JSON receipt; it stores neither payload nor IP in a database. Public endpoint exposure still consumes Worker usage and should be protected with platform-level controls if traffic grows.
- The v5.0 record adds `methodVersion=http-baseline-v50` and `uploadSource=Same-origin Worker /api/upload` when available; historical v4.9 data is retained and displayed according to the original sampling definition.
- **Neither the dashboard layout nor the Worker upload path constitutes the official Cloudflare Speedtest engine.** Official `@cloudflare/speedtest` can collect Resource Timing and loaded latency at repeated intervals while dynamically ramping transfer sizes. This app still performs simpler HTTP-based sampling.

## 3A. v4.9 HTTP latency method and percentile dashboard

As of v4.9, the speed-test detail panel shows **download P50, optional upload, idle HTTP latency, download-loaded HTTP latency, download-delay increase, jitter, download P10/P90, optional upload-loaded HTTP latency and downloaded bytes**.

- **Idle timing:** Four sequential no-store GET requests to the same-origin Cloudflare Worker `/api/ping` before downloads. The Worker returns HTTP 204 (no content). Client measures wall-clock elapsed time via `performance.now()`. Failed probes are not replaced by zero.
- **Under-download timing:** One `/api/ping` GET is launched concurrently with each actual Cloudflare `/__down` transfer. Only a probe whose interval overlaps the download wall-clock interval contributes to the loaded group. The display is the median of successful overlapping samples. The sampled HTTP request may begin/end early in a long transfer, and browser scheduling can affect results.
- **Under-upload timing:** If upload is manually enabled and its CORS-enabled endpoint is available, a same-origin `/api/ping` request is similarly launched during each upload. Otherwise this value is not measured.
- **Inflation:** `median(downloadLoadedRtts) − median(idleRtts)`, in milliseconds. Negative values are possible and not clamped.
- **Idle jitter:** Median absolute difference between consecutive successful idle HTTP RTTs, **not** RFC3550 jitter or ICMP jitter.
- **Download statistics:** P10 floor-ranked low-speed sample (legacy-compatible), P50 median, P90 linearly interpolated quantile of individual HTTP download sample Mbps. Upload speed, if available, is the median of upload transfer results.
- **Source distinction:** Idle/loaded delay is to the same-origin Worker, whereas download/upload throughput uses `speed.cloudflare.com`. These services may be served from different network paths and can be affected by HTTP and JavaScript scheduling. The test does not prove native radio queueing, country-to-country speed, or physical server geography.
- **Persistence:** New results set `methodVersion=http-baseline-v49`, and include full `latencies`, `downloadLoadedRtts` and `uploadLoadedRtts` arrays. Historical v4.8 latency readings come from tiny cross-origin Cloudflare download operations, **not** the Worker idle test. The new UI leaves old idle/loaded metrics unmeasured rather than mislabeling them. CSV includes raw RTTS for new runs.
- **Comparison:** Current code implements its own lightweight HTTP probes and visual layout; it does **not** bundle, fork, or claim identical results to Cloudflare Speedtest's open-source measurement engine, nor does it collect TCP or WebRTC packet loss.

## 4. Reference implementations and methodological differences

- **Ookla official:** [Server selection](https://s1.ooklaserver.org/help/guides/how-does-speedtest-select-a-server) selects among nearby candidates using measured response time; [Speedtest methodology](https://s1.ooklaserver.org/help/guides/how-does-speedtest-measure-my-network-speeds) describes adaptive chunks and multiple TCP connections, with ping/download/upload.
- **LibreSpeed**, [GitHub repository](https://github.com/librespeed/speedtest) and [technical docs](https://github.com/librespeed/speedtest/blob/master/doc.md): open-source browser speed test, self-hostable server backend, download/upload/ping/jitter, optional multi-server selection using latency.
- **M-Lab ndt7**, [protocol specification](https://github.com/m-lab/ndt-server/blob/main/spec/ndt7-protocol.md): an intentionally **single-TCP-stream**, WebSocket-based diagnostic to a managed test server with TCP-level statistics, not a multi-stream headline-speed benchmark.
- **Cloudflare Speedtest**, [open-source engine](https://github.com/cloudflare/speedtest): browser Resource Timing, adaptive bandwidth sample sets, and optional loaded latency. Different methodology from Ookla and ndt7.

These descriptions inform our own design. **No Ookla proprietary source code is included**, and no third-party speed-test library is embedded into this application.

## 5. Practical operator comparison protocol

To compare SIMBA and China Unicom (or Wi-Fi and cellular), keep the phone/computer, physical site, window, server/protocol profile and data budget constant, then alternate operators, repeating during comparable time windows. Record the **SIM home operator, visited roaming carrier, physical location, observed public-IP market and ASN**, but do not infer packet route from a single IP geolocation.

Report per-profile median, P10, variability and error conditions separately. Always retain individual runs and the corresponding roster version.

## 6. Privacy, reproducibility and known limitations

- Results are saved in the current browser's local storage, not in a project-hosted analytics database.
- Websites and speed-test servers may receive normal HTTP metadata, including the IP used for the request.
- The Cloudflare Worker public-IP inspection endpoint returns estimated country and ASN, but not the raw address in the JSON payload.
- Your browser cannot reliably reveal cellular signal RSRP/SINR, device-wide traffic use, current true radio RAT or iPhone Wi-Fi SSID.
- The server-side Worker and client are versioned on GitHub. Tests are subject to real-world browser CORS, VPN, throttling, device thermal and network conditions; scripted validation alone is not equivalent to a real carrier test.

For questions or discrepancies, compare the version number, test profile, roster/seed, chosen location/operator and raw CSV before interpreting differences.
