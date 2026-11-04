// Network Watch v5.1: network-first pages with bounded refresh and honest offline cache.
const CACHE="network-watch-shell-v51";
const TIMEOUT_MS=5500;
self.addEventListener("install",event=>{
 self.skipWaiting();
 // Do not delay activation waiting on a potentially blocked workers.dev domain.
 event.waitUntil(Promise.resolve());
});
self.addEventListener("activate",event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("network-watch-shell-")&&k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET"||event.request.mode!=="navigate")return;
 event.respondWith((async()=>{
  const ctl=new AbortController();
  const timer=setTimeout(()=>ctl.abort(),TIMEOUT_MS);
  try{
   const response=await fetch(new Request(event.request,{signal:ctl.signal}),{cache:"no-store"});
   if(!response.ok)throw Error("Network returned "+response.status);
   const copy=response.clone();
   event.waitUntil(caches.open(CACHE).then(cache=>cache.put("/",copy)).catch(()=>{}));
   return response
  }catch(error){
   const cached=await caches.match("/");
   if(cached){
    const headers=new Headers(cached.headers);
    headers.set("x-network-watch-offline","1");
    headers.set("cache-control","no-store");
    return new Response(await cached.text(),{headers,status:200});
   }
   return new Response("<!doctype html><html lang=zh-CN><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>Network Watch 离线</title><body style='font:16px system-ui;padding:24px;max-width:520px;margin:auto'><h2>无法连接 Network Watch</h2><p>当前 workers.dev 入口可能在此运营商网络下不可访问。请检查网络，或改用已部署的国内可达域名。</p><button onclick='location.reload()' style='padding:12px;border:1px solid #aaa'>重试</button></body></html>",{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","x-network-watch-offline":"1"}})
  }finally{clearTimeout(timer)}
 })());
});