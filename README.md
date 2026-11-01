# SIMBA Network Watch

A mobile-first diagnostic tool for exploring **SIMBA Telecom 5G/4G performance in Singapore**.

**Live application:** https://simba-network-watch.renkangguo.workers.dev/

**Version:** 3.0

## What it actually measures

1. **Singapore/local link:** repeated HTTP downloads to Cloudflare's speed test endpoint for **30 / 45 / 60 / 120 seconds**, configurable download budget, sample median / P10, HTTP round-trip time, jitter approximation, and optional upload endpoint.
2. **Cross-region website probes:** seven website-market groups — Singapore, Malaysia, mainland China, Japan, United States, United Kingdom, and Australia. Two sites per region, two browser HEAD requests each.
3. **Common usage categories:** normal websites, streaming-video homepages, social networking, messaging, office/development, and shopping.
4. **Video segment simulation:** approximately 20 seconds of repeated Cloudflare data transfers, counting slow segments. This is **not** a measurement of actual playback inside YouTube, Netflix or TikTok.
5. **Optional true regional throughput probes:** enter controlled HTTPS endpoints in the form `JP|https://your-host.example/down`. The endpoint must return roughly the `bytes` query parameter's size and allow CORS. Users must independently verify where servers actually run.
6. CSV export; local record storage; manual buffering markers; support reading v1 historic measurements.

## Important limitations

**Do not read website probes as regional bandwidth results.** Browser `no-cors` opaque responses cannot expose HTTP status, and even an HTTP error page may look like a completed request. Sites that reject browser HEAD requests may appear unsuccessful even when regular navigation works.

A domain's market affiliation does **not** prove the test's network path or endpoint location. CDN traffic may be served from within Singapore. For per-country bandwidth, configure a trusted physically regional test endpoint. The application does **not** automatically identify 4G/5G radio, inspect native apps, measure ICMP loss, measure routing, or prove video-specific SIMBA throttling.

Safari may interrupt tests on screen lock or when the page is backgrounded. Disable Wi-Fi to test SIMBA cellular data. Tests consume mobile traffic: the local test's default budget is 60 MB (actual usage may have protocol overhead, and interrupted tests can consume data). A configured remote endpoint test consumes additional data.

Test records are kept in browser localStorage, not a server database. The Cloudflare speed test host and visited target domains will see normal connection metadata such as IP address. No SIMBA account login is required.

## Deployment

Static, single-file `index.html`. The existing Cloudflare Workers service is currently deployed manually and is **not automatically linked** to GitHub.

GitHub Pages can be enabled from repository **Settings → Pages → Deploy from a branch → main → /(root)**.

## License

No open-source license has been selected. The public source is viewable, but no license to redistribute has been granted.

Independent project; not endorsed by SIMBA, Cloudflare, or the websites tested.
