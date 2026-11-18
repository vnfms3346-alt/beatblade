/* 리듬 브레이커즈 앱(PWA) 서비스워커 — 게임 화면(html)·version.json은 항상 새로 받고(브라우저 캐시도 건너뜀 no-store)(오프라인일 때만 저장본),
   그림·효과 파일은 저장본을 먼저 보여 주고 뒤에서 새로 받아 둠. 영상·소리(mp4/mp3)와 다른 사이트(Firebase 등)는 건드리지 않음. */
const C='bb-app-v5';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(/\.(mp4|mp3|webm|m4a)$/i.test(u.pathname)||r.headers.has('range'))return;
  if(r.mode==='navigate'||/\.html$|\/$|version\.json$|sw\.js$/.test(u.pathname)){
    e.respondWith(fetch(r.mode==='navigate'?new Request(r.url,{cache:'no-store',credentials:'same-origin'}):r,{cache:'no-store'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./'))));return}
  e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>{const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>m);return m||net})));
});
