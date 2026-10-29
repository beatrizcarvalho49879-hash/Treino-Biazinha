const C="biazinha-v2";
const CORE=["./","index.html","manifest.json","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("biazinha-")&&x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// páginas: busca a versão nova quando há internet e usa a cópia guardada offline; o resto: cópia guardada primeiro
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  const save=res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res};
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(save).catch(()=>caches.match(r).then(h=>h||caches.match("index.html"))));return}
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(save).catch(()=>hit);return hit||net}))});
