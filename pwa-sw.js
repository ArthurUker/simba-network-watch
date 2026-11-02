// Network Watch v4.6 app-shell fallback only; never cache network diagnostics or speed transfers.
const CACHE="network-watch-shell-v46";
self.addEventListener("install",event=>{
 self.skipWaiting();
 event.waitUntil(caches.open(CACHE).then(cache=>fetch("/",{cache:"reload"}).then(response=>{if(response.ok)return cache.put("/",response)})).catch(()=>{}));
});
self.addEventListener("activate",event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("network-watch-shell-")&&k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET"||event.request.mode!=="navigate")return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put("/",copy)).catch(()=>{}))}
  return response
 }).catch(async()=>{
  const cached=await caches.match("/");
  if(cached)return cached;
  return new Response("<!doctype html><meta charset=utf-8><title>Network Watch</title><p>当前离线，请恢复网络后打开。</p>",{headers:{"content-type":"text/html; charset=utf-8"}})
 }));
});