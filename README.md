# SIMBA Network Watch

A mobile-first network diagnostics dashboard for SIMBA users in Singapore. **v4.0**

**Live site:** https://simba-network-watch.renkangguo.workers.dev/

## Dashboard-first experience

- A single overview showing local speed (Mbps), browser requests to 7 website markets, requests to 6 everyday service categories, and video-segment simulation results.
- One-tap **Full diagnosis** from the first screen, with four visible progress stages. Section results update progressively.
- Direct cards and category chips navigate to results. Test settings stay collapsed by default.
- Network type is **unlabeled by default**. An iPhone browser cannot reliably distinguish 4G/LTE from 5G.
- Short interpretation, compact speed trend, recent runs, and manual video buffering markers.
- Existing localStorage data uses the previous `simba-network-watch-v3` key to retain history.

## Measurement types and limits

| Module | What it measures | What it does NOT show |
| --- | --- | --- |
| Local Singapore | 30/45/60/120-second window of distributed Cloudflare download samples, median and P10 speed, HTTP request times | Radio-level or continuous saturated throughput, ICMP Ping |
| Cross-border website markets | 7 markets, 14 websites, 2 restricted browser probes each | Actual destination-country bandwidth / physical IP route / HTTP 200 status |
| Application scenarios | 6 categories, 17 popular website frontends | Native app activity, real video-stream throughput |
| 20s video segment simulator | Repeated download sample speeds and slow segment counts | YouTube/Netflix/TikTok playback quality |
| User-configured regional endpoint | Optional HTTPS+CORS download to independently verified regional test servers | Independently verified location or routing |

**Critical distinction:** an opaque `no-cors` browser response only means the request yielded an opaque response. It does **not** prove HTTP success, application availability or that the server is in the website's advertised country. The interface reports **request returned**, never an invented cross-border Mbps.

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

No open-source license has been selected. Public source visibility does not grant redistribution rights. This independent project is not endorsed by SIMBA, Cloudflare or the services it tests.
