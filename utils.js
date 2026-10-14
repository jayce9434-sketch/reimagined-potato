window.SwarmSong = window.SwarmSong || {};
(function(NS){
  const U = {};
  U.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  U.format=(n)=>Math.floor(n).toLocaleString('en-US');
  U.uid=()=>Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-4);
  U.pick=(arr)=>arr[Math.floor(Math.random()*arr.length)];
  U.hash=(s)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
  U.seeded=(seed)=>{let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};};
  U.costText=(cost)=>Object.entries(cost).map(([k,v])=>`${U.format(v)} ${NS.CURRENCIES[k].name}`).join(' + ');
  U.now=()=>Date.now();
  U.escape=(s)=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  NS.Utils=U;
})(window.SwarmSong);
