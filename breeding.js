window.SwarmSong = window.SwarmSong || {};
(function(NS){
  const B={};
  const byId=id=>NS.MONSTERS.find(m=>m.id===id);
  B.available=state=>NS.MONSTERS.filter(m=>state.discovered[m.id+':common']);
  B.findResult=(islandId,aId,bId,state)=>{
    const a=byId(aId), b=byId(bId); if(!a||!b)return null;
    const elems=[...new Set([...a.elements,...b.elements])];
    const candidates=NS.MONSTERS.filter(m=>m.islands.includes(islandId) && m.elements.every(e=>elems.includes(e)) && m.elements.length<=Math.max(2,Math.min(4,elems.length)));
    const score=m=>m.elements.length*6+(m.rarity==='uncommon'?2:m.rarity==='rare'?5:m.rarity==='epic'?8:m.rarity==='mythic'?12:0);
    candidates.sort((x,y)=>score(y)-score(x));
    let pool=candidates.slice(0,Math.min(6,candidates.length)); if(!pool.length)pool=[a,b];
    const roll=Math.random(); const pick=pool[Math.floor(Math.pow(Math.random(),1.6)*pool.length)]||pool[0];
    let form='common';
    if(state.level>=25 && roll<0.012) form='stormtouched';
    else if(state.level>=18 && roll<0.055) form='epic';
    else if(state.level>=10 && roll<0.16) form='rare';
    const time=Math.round(pick.breed*(form==='rare'?1.25:form==='epic'?1.6:form==='stormtouched'?2.1:1));
    return {monsterId:pick.id,form,seconds:time};
  };
  B.start=(state,islandId,aId,bId)=>{
    if(state.breedJobs[islandId])return {ok:false,msg:'The Breeding Hollow is busy.'};
    const res=B.findResult(islandId,aId,bId,state); if(!res)return {ok:false,msg:'Pick two valid parents.'};
    state.breedJobs[islandId]={...res,aId,bId,start:Date.now(),end:Date.now()+res.seconds*1000};
    state.stats.breeds++; state.stats.dailyBreed++; return {ok:true,res};
  };
  B.finishBreed=(state,islandId)=>{
    const j=state.breedJobs[islandId]; if(!j||Date.now()<j.end)return null;
    delete state.breedJobs[islandId]; const incubation=Math.max(20,Math.round(j.seconds*.72))*1000; state.nurseryJobs[islandId]={monsterId:j.monsterId,form:j.form,start:j.end,end:j.end+incubation}; return j;
  };
  B.hatch=(state,islandId)=>{
    const j=state.nurseryJobs[islandId]; if(!j||Date.now()<j.end)return null;
    delete state.nurseryJobs[islandId];
    const m=byId(j.monsterId); const inst={uid:NS.Utils.uid(),species:m.id,form:j.form,level:1,island:islandId,placed:false,x:0,y:0,muted:false,volume:1,coins:0,lastCollect:Date.now()};
    state.monsters.push(inst); state.discovered[m.id+':'+j.form]=true; state.stats.hatches++; NS.Progression.addXp(state,45+m.elements.length*25); return inst;
  };
  NS.Breeding=B;
})(window.SwarmSong);
