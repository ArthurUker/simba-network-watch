# SIMBA Network Watch — Version History

This file is a human-readable index of the Git commit history. **GitHub commits and diffs are the authoritative record.** Milestone commits below are not Git tags, release objects, or automatically deployed builds.

Project: https://github.com/ArthurUker/simba-network-watch  
Full history: https://github.com/ArthurUker/simba-network-watch/commits/main/

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
