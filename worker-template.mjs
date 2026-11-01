// Cloudflare Worker template. Replace the placeholder token below with JSON.stringify(index.html).
const html=__HTML_JSON__;
export default {
 async fetch(request) {
  const url=new URL(request.url);
  if(request.method!=="GET")return new Response("Method Not Allowed",{status:405,headers:{allow:"GET"}});
  if(url.pathname==="/api/network-info"){
   const cf=request.cf||{};
   const country=typeof cf.country==="string"&&/^[A-Z]{2}$/.test(cf.country)&&cf.country!=="XX"?cf.country:"";
   const asn=Number.isInteger(cf.asn)&&cf.asn>0?cf.asn:null;
   const organization=typeof cf.asOrganization==="string"?cf.asOrganization.slice(0,90):"";
   return new Response(JSON.stringify({country,asn,organization}),{headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","referrer-policy":"no-referrer"}});
  }
  if(url.pathname==="/"||url.pathname==="/index.html")
   return new Response(html,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache, no-store, must-revalidate","x-content-type-options":"nosniff","referrer-policy":"no-referrer"}});
  return new Response("Not Found",{status:404,headers:{"content-type":"text/plain; charset=utf-8"}});
 }
};
