window.SwarmSong = window.SwarmSong || {};
(function(NS){
  const P={};
  P.xpForLevel=l=>Math.round(280*Math.pow(l,1.52));
  P.addXp=(state,amount)=>{
    state.xp+=amount; let leveled=false;
    while(state.level<40 && state.xp>=P.xpForLevel(state.level)){
      state.xp-=P.xpForLevel(state.level); state.level++; leveled=true;
      state.currencies.gems += state.level%5===0?5:1;
      state.currencies.food += 150*state.level;
    }
    return leveled;
  };
  P.canPay=(state,cost)=>Object.entries(cost).every(([k,v])=>(state.currencies[k]||0)>=v);
  P.pay=(state,cost)=>{if(!P.canPay(state,cost))return false;Object.entries(cost).forEach(([k,v])=>state.currencies[k]-=v);return true;};
  P.reward=(state,reward)=>Object.entries(reward||{}).forEach(([k,v])=>state.currencies[k]=(state.currencies[k]||0)+v);
  P.islandCount=state=>Object.values(state.islands).filter(x=>x.unlocked).length;
  P.discoveredCount=state=>Object.keys(state.discovered||{}).length;
  P.metric=(state,type)=> type==='level'?state.level : type==='collection'?P.discoveredCount(state) : type==='island'?P.islandCount(state) : (state.stats[type]||0);
  P.ensureDaily=(state)=>{
    const d=new Date(); const key=[d.getFullYear(),d.getMonth()+1,d.getDate()].join('-');
    if(state.daily.date!==key){
      const seed=parseInt(key.replace(/-/g,''),10); const r=NS.Utils.seeded(seed); const pool=[...NS.DAILY_POOL]; const ids=[];
      while(ids.length<3&&pool.length){const i=Math.floor(r()*pool.length);ids.push(pool.splice(i,1)[0].id);} state.daily={date:key,ids,claimed:{}};
      ['dailyPlace','dailyFeed','dailyCollect','dailyBreed','dailyMix'].forEach(k=>state.stats[k]=0);
    }
  };
  P.offline=(state)=>{
    const now=Date.now(); const secs=Math.min(60*60*12,Math.max(0,(now-(state.lastSeen||now))/1000));
    let coins=0;
    for(const m of state.monsters){ if(m.placed){const base=14+(m.level||1)*4; const form=NS.FORMS.find(f=>f.id===m.form)||NS.FORMS[0]; coins+=base*form.coin*secs/60;} }
    coins=Math.floor(coins); if(coins>0) state.currencies.coins+=coins; return {secs,coins};
  };
  NS.Progression=P;
})(window.SwarmSong);
