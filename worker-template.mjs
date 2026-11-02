// Cloudflare Worker template. Replace the placeholder token below with JSON.stringify(index.html).
const html=__HTML_JSON__;
const serviceWorkerSource=__SERVICE_WORKER_JSON__;
const manifest={"name":"Network Watch — 多运营商网络诊断","short_name":"Network Watch","description":"本地网速、跨境连接、应用体验和漫游分析","start_url":"/?source=homescreen","scope":"/","id":"/","display":"standalone","display_override":["standalone"],"background_color":"#f6f8f7","theme_color":"#0a7460","orientation":"any","lang":"zh-CN","icons":[{"src":"/icon-180.png","sizes":"192x192","type":"image/png","purpose":"any maskable"},{"src":"/icon.svg","sizes":"any","type":"image/svg+xml","purpose":"any"}]};
const iconSvg="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 192 192\"><rect x=\"2\" y=\"2\" width=\"188\" height=\"188\" rx=\"44\" fill=\"#0a7460\"/><path d=\"M27 103H56L68 82 87 127 103 64 126 115 143 91H163\" fill=\"none\" stroke=\"#f9fffd\" stroke-width=\"12\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg>";
const iconPngBase64="iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAEU0lEQVR42u3dQU7kMBRF0cRixIwdtsQWYBWwBSR2yIwpPW2pJbqpxI6/37lD1FKqnHf9vosUvW0AgEz22V/g/dOvL7epLp+v7zsBhB2TSrELPZJl2IUeyTLsgo9kEXbBR7IIu+AjWYQm/Jidnllqwo9kCXbBR/JI1IQfyW3QhB/JEjThR7IETfiRLEETfiRL0IQfyRI04UeyBE34kSxBs2RIpvUyC6jQAk34kSxBE34kS+AMAGcAuz9SW0ADQAPY/ZHaAhoAGsDuj9QW0ADQAAABjD8IHIM0ADQAQADjDwLHIA0ADQAQACAAECqAAzASD8IaABoAIABAAIAAAAEAAgAEAAgAEAAgAEAAgAAAAQACAAQACAAQAKjCnSWYj4+Xt79+9vD8aGE0QGb4v/s5CLB8+ElAgPjwk4AAS4ffjE8ADdDh34IAywQfBABxCAAQAFqAAAIMApAIBAAIoAVAAKEFAQACaBQQAPgG3wj7Zgft9YRmr93aU6Ua4NRAGisIED87V5OAtAToEhbBIoDwF9mhyUoAwQIBVgjyw/OjT3YIQB5t1Yc7Aa5x7Yfnx2VDfeVfwvOLsBtvWIWxpNfrHHWQH7HGLS24lZhRspFrOOJaTfjXFuKs9/3x8nbJGva+pkPwoBtTWcCrX3vP6zdh1QLJaIBJxZpl/l9dniakWiC5OTQACaPHpiZ4NYOS9HhEz/fahH++UF39TbSZdv/e98QIpAViw79tgx6FGP2sx0y7/2yzdJXHOJZ5Fqja921vfehshS+k33pPKr/vNuOCJh8of/pazvpINDH8XQWoHH5fQMmhJYe/9/setQ5HWyB19+8+AlUefVJaIDn88QLM1n5HQuUhOQJE7mDWjgDT3eirvjwyIpirbRwtcZHs/tatewPMulgjPmcXLgJMeVMTQtbrPa66di0hdEf/ulr67rzy+7+zgGsG1keckzQAam8Qq29eBFg0CGe83oTmJgCMQNACqec2ApAqNvwE0ALR4ScAnAEsgdZK3f0JcPEYNDJw/7pW6i8rCUDc6N/U+y+SDoSp4uMGHkvRAAAB7MQggBATwBKAANACBABpCACBJgBAAHRpAW1BgFgJhJ8AsRII/5x4FsihWAMABAAIABAAIABAAIAAAAEAAgAEAAgAEAAgAEAAgAAAAQACAAQAKgnw+fq+Ww4k8GfWNQA0AEAAgABAsAAOwkg6AGsAaABLAAIYgxA4/mgAaABLAAIYgxA4/mgAaICfGgOssvtrAGiAW80Bqu/+GgAa4KhBQNXd/78bgARYMfw/GoFIgNXC7wwAZ4BeZgGz7/43NQAJsEr4bx6BSIAVwn/oDEACVA//4UMwCVA5/IcFIAEqh/8UAUiAquE/TQASoGL4t23buoT2/unXl9uEmYN/egNoA1QLfzcBSIAqWRoSUiMRZt1Eh+7SRMBs08MlYwoRMMvYfPmcTgahv/L6Ux1UySD00QKQQtgBABjDbzgz/C/8T060AAAAAElFTkSuQmCC";
export default {
 async fetch(request) {
  const url=new URL(request.url);
  if(request.method!=="GET")return new Response("Method Not Allowed",{status:405,headers:{allow:"GET"}});
  if(url.pathname==="/manifest.webmanifest")
   return new Response(JSON.stringify(manifest),{headers:{"content-type":"application/manifest+json; charset=utf-8","cache-control":"public, max-age=3600","x-content-type-options":"nosniff"}});
  if(url.pathname==="/sw.js")
   return new Response(serviceWorkerSource,{headers:{"content-type":"application/javascript; charset=utf-8","cache-control":"no-store","service-worker-allowed":"/","x-content-type-options":"nosniff"}});
  if(url.pathname==="/icon.svg")
   return new Response(iconSvg,{headers:{"content-type":"image/svg+xml; charset=utf-8","cache-control":"public, max-age=604800","x-content-type-options":"nosniff"}});
  if(url.pathname==="/icon-180.png")
   return new Response(Uint8Array.from(atob(iconPngBase64),char=>char.charCodeAt(0)),{headers:{"content-type":"image/png","cache-control":"public, max-age=604800","x-content-type-options":"nosniff"}});
  if(url.pathname==="/api/network-info"){
   const cf=request.cf||{};
   const country=typeof cf.country==="string"&&/^[A-Z]{2}$/.test(cf.country)&&cf.country!=="XX"?cf.country:"";
   const asn=Number.isInteger(cf.asn)&&cf.asn>0?cf.asn:null;
   const organization=typeof cf.asOrganization==="string"?cf.asOrganization.slice(0,90):"";
   const colo=typeof cf.colo==="string"&&/^[A-Z]{3}$/.test(cf.colo)?cf.colo:"";
   const protocol=typeof cf.httpProtocol==="string"?cf.httpProtocol.slice(0,20):"";
   const edgeRtt=Number.isFinite(cf.clientTcpRtt)?cf.clientTcpRtt:Number.isFinite(cf.clientQuicRtt)?cf.clientQuicRtt:null;
   return new Response(JSON.stringify({country,asn,organization,colo,protocol,edgeRtt}),{headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","referrer-policy":"no-referrer"}});
  }
  if(url.pathname==="/api/ping")return new Response(null,{status:204,headers:{"cache-control":"no-store","x-content-type-options":"nosniff"}});
  if(url.pathname==="/"||url.pathname==="/index.html")
   return new Response(html,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache, no-store, must-revalidate","x-network-watch-version":"4.6","x-content-type-options":"nosniff","referrer-policy":"no-referrer"}});
  return new Response("Not Found",{status:404,headers:{"content-type":"text/plain; charset=utf-8"}});
 }
};
