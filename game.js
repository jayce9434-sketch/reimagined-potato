window.SwarmSong = window.SwarmSong || {};
(function(NS){
  const G={state:null,current:'moss',selectedMonster:null,offline:null};
  G.init=()=>{
    G.state=NS.Save.load(); NS.Progression.ensureDaily(G.state); G.offline=NS.Progression.offline(G.state); G.current=G.state.selectedIsland||'moss';
    if(new URLSearchParams(location.search).has('demo')) G.demo(new URLSearchParams(location.search).get('demo'));
    NS.Audio.setState(G.state); NS.Audio.setIsland(G.current); NS.UI.init(); G.tick(); setInterval(G.tick,1000); setInterval(()=>NS.Save.save(G.state),6000);
    document.addEventListener('pointerdown',()=>NS.Audio.resume(),{once:true});
  };
  G.demo=(mode)=>{
    const target=NS.ISLANDS.find(i=>i.id===mode)?mode:'tempest'; G.current=target;G.state.selectedIsland=target;G.state.level=30;
    for(const i of NS.ISLANDS)G.state.islands[i.id]={unlocked:true,castle:5};
    G.state.currencies={coins:9999999,food:999999,gems:9999,storm:9999};
    const species=NS.MONSTERS.filter(m=>m.islands.includes(target)).slice(0,14);
    G.state.monsters=species.map((m,idx)=>({uid:'demo'+idx,species:m.id,form:idx%7===0?'stormtouched':idx%5===0?'epic':idx%3===0?'rare':'common',level:10+idx%11,island:target,placed:true,x:0,y:0,muted:false,volume:1,coins:500,lastCollect:Date.now()-60000}));
    G.state.discovered={};for(const m of G.state.monsters)G.state.discovered[m.species+':'+m.form]=true;
  };
  G.save=()=>NS.Save.save(G.state);
  G.island=()=>NS.ISLANDS.find(i=>i.id===G.current);
  G.islandState=()=>G.state.islands[G.current];
  G.bedsUsed=()=>G.state.monsters.filter(m=>m.placed&&m.island===G.current).reduce((s,inst)=>s+(NS.MONSTERS.find(x=>x.id===inst.species)?.beds||1),0);
  G.bedsMax=()=>G.island().beds[G.islandState().castle];
  G.switchIsland=(id)=>{if(!G.state.islands[id].unlocked)return;G.current=id;G.state.selectedIsland=id;NS.Audio.setIsland(id);G.save();NS.UI.renderAll();NS.Audio.fx('tap');};
  G.unlockIsland=(id)=>{const isl=NS.ISLANDS.find(i=>i.id===id);if(!isl||G.state.islands[id].unlocked)return;if(G.state.level<isl.level)return NS.UI.toast('Reach level '+isl.level+' first.');if(!NS.Progression.pay(G.state,isl.cost))return NS.UI.toast('You need '+NS.Utils.costText(isl.cost)+'.');G.state.islands[id].unlocked=true;G.current=id;G.state.selectedIsland=id;NS.Progression.addXp(G.state,500);NS.Audio.fx('unlock');G.save();NS.UI.renderAll();};
  G.upgradeCastle=()=>{const s=G.islandState(),isl=G.island();if(s.castle>=5)return NS.UI.toast('Castle is fully upgraded.');const next=s.castle+1;const cost=isl.castleCosts[next];const cur=G.current==='aurora'||G.current==='tempest'?'gems':'coins';const c={[cur]:cost};if(!NS.Progression.pay(G.state,c))return NS.UI.toast('Not enough '+NS.CURRENCIES[cur].name+'.');s.castle++;G.state.stats.castle++;NS.Progression.addXp(G.state,160+next*70);NS.Audio.fx('unlock');G.save();NS.UI.renderAll();};
  G.buyStarter=(speciesId,form='common')=>{const m=NS.MONSTERS.find(x=>x.id===speciesId);if(!m||!m.islands.includes(G.current))return;const formDef=NS.FORMS.find(f=>f.id===form)||NS.FORMS[0];if(G.state.level<formDef.unlock)return NS.UI.toast('That form unlocks at player level '+formDef.unlock+'.');const cost={coins:Math.round(m.baseCost*formDef.mult)};if(form==='stormtouched')cost.storm=Math.max(20,m.elements.length*18);if(!NS.Progression.pay(G.state,cost))return NS.UI.toast('Not enough currency.');const inst={uid:NS.Utils.uid(),species:m.id,form,level:1,island:G.current,placed:false,x:0,y:0,muted:false,volume:1,coins:0,lastCollect:Date.now()};G.state.monsters.push(inst);G.state.discovered[m.id+':'+form]=true;NS.Progression.addXp(G.state,35);NS.Audio.fx('buy');G.save();NS.UI.renderAll();};
  G.place=(uid)=>{const inst=G.state.monsters.find(x=>x.uid===uid);if(!inst)return;const m=NS.MONSTERS.find(x=>x.id===inst.species);if(G.bedsUsed()+m.beds>G.bedsMax())return NS.UI.toast('Upgrade the castle for more beds.');inst.island=G.current;inst.placed=true;inst.lastCollect=Date.now();G.state.stats.placed++;G.state.stats.dailyPlace++;NS.Progression.addXp(G.state,20);NS.Audio.fx('tap');G.save();NS.UI.renderAll();};
  G.box=(uid)=>{const inst=G.state.monsters.find(x=>x.uid===uid);if(!inst)return;inst.placed=false;G.save();NS.UI.renderAll();};
  G.feed=(uid)=>{const inst=G.state.monsters.find(x=>x.uid===uid);if(!inst||inst.level>=20)return;const cost=Math.round(25*Math.pow(inst.level,1.55));if(G.state.currencies.food<cost)return NS.UI.toast('Not enough Nectar.');G.state.currencies.food-=cost;inst.level++;G.state.stats.dailyFeed++;NS.Progression.addXp(G.state,15+inst.level*2);NS.Audio.fx('feed');G.save();NS.UI.renderAll();};
  G.collect=(uid)=>{const inst=G.state.monsters.find(x=>x.uid===uid);if(!inst)return;const amount=G.coinAmount(inst),bonus=G.bonusAmount(inst);if(amount<1&&!bonus.gems&&!bonus.storm)return NS.UI.toast('This performer is still earning.');G.state.currencies.coins+=amount;G.state.currencies.gems+=bonus.gems;G.state.currencies.storm+=bonus.storm;inst.lastCollect=Date.now();G.state.stats.dailyCollect++;NS.Audio.fx('collect');G.save();NS.UI.renderAll();let msg='Collected '+NS.Utils.format(amount)+' Coins';if(bonus.gems)msg+=' + '+bonus.gems+' Prisms';if(bonus.storm)msg+=' + '+bonus.storm+' Stormglass';NS.UI.toast(msg+'.');};
  G.coinAmount=(inst)=>{const mins=Math.min(240,(Date.now()-(inst.lastCollect||Date.now()))/60000);const f=NS.FORMS.find(x=>x.id===inst.form)||NS.FORMS[0];return Math.floor(mins*(8+inst.level*4)*f.coin);};
  G.bonusAmount=(inst)=>{const mins=Math.min(240,(Date.now()-(inst.lastCollect||Date.now()))/60000);const form=NS.FORMS.find(x=>x.id===inst.form)||NS.FORMS[0];let gems=0,storm=0;if(inst.level>=12)gems=Math.floor(mins/Math.max(38,92-inst.level*2)/Math.max(1,1.6/form.coin));if(inst.island==='aurora'&&inst.level>=15)storm=Math.floor(mins/Math.max(18,48-inst.level)/Math.max(1,1.5/form.coin));return {gems,storm};};
  G.buyNectar=(tier)=>{const packs={small:{coins:5000,food:1200},large:{coins:20000,food:5500},grand:{coins:70000,food:22000}},p=packs[tier];if(!p)return;if(G.state.currencies.coins<p.coins)return NS.UI.toast('Not enough Coins.');G.state.currencies.coins-=p.coins;G.state.currencies.food+=p.food;NS.Audio.fx('buy');G.save();NS.UI.renderAll();};
  G.startBreed=(a,b)=>{const r=NS.Breeding.start(G.state,G.current,a,b);if(!r.ok)return NS.UI.toast(r.msg);NS.Audio.fx('tap');NS.Progression.addXp(G.state,20);G.save();NS.UI.renderAll();};
  G.hatch=()=>{const inst=NS.Breeding.hatch(G.state,G.current);if(!inst)return NS.UI.toast('The egg is not ready yet.');NS.Audio.fx('hatch');G.save();NS.UI.renderAll();};
  G.skipJob=(kind)=>{const jobs=kind==='breed'?G.state.breedJobs:G.state.nurseryJobs;const j=jobs[G.current];if(!j)return;const remaining=Math.max(0,(j.end-Date.now())/1000),cost=Math.max(1,Math.ceil(remaining/60));if(G.state.currencies.gems<cost)return NS.UI.toast('Not enough Prisms.');G.state.currencies.gems-=cost;j.end=Date.now();G.save();G.tick();};
  G.setMixer=(uid,key,val)=>{const inst=G.state.monsters.find(x=>x.uid===uid);if(!inst)return;if(key==='volume')inst.volume=Number(val);if(key==='muted')inst.muted=!!val;G.state.stats.dailyMix++;G.save();};
  G.devCurrency=(mode,key,amount)=>{amount=Math.max(0,Math.floor(Number(amount)||0));if(!NS.CURRENCIES[key])return;if(mode==='set')G.state.currencies[key]=amount;else G.state.currencies[key]+=amount;G.save();NS.UI.renderAll();NS.UI.toast(NS.CURRENCIES[key].name+' updated.');};
  G.reset=()=>{G.state=NS.Save.reset();G.current='moss';NS.Audio.setState(G.state);NS.Audio.setIsland(G.current);G.save();NS.UI.renderAll();NS.UI.toast('Save data reset.');};
  G.tick=()=>{
    NS.Progression.ensureDaily(G.state);
    for(const isl of NS.ISLANDS){if(NS.Breeding.finishBreed(G.state,isl.id))NS.Save.save(G.state);}
    NS.UI.tick();
  };
  NS.Game=G;
})(window.SwarmSong);
