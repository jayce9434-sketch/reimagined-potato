window.SwarmSong = window.SwarmSong || {};
(function(NS){
  const U={tab:'island',breedA:'',breedB:'',devMode:'add'};
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  U.init=()=>{
    $$('.tab-btn').forEach(b=>b.onclick=()=>{U.tab=b.dataset.tab;U.renderPanels();});
    $('#btn-sound').onclick=()=>NS.Audio.resume();
    $('#btn-settings').onclick=()=>U.modalSettings();
    $('#btn-dev').onclick=()=>U.modalDev();
    $('#btn-help').onclick=()=>U.modalHelp();
    $('#modal-close').onclick=()=>U.closeModal();
    $('#modal').addEventListener('click',e=>{if(e.target.id==='modal')U.closeModal();});
    U.renderAll(); if(NS.Game.offline&&NS.Game.offline.coins>0)U.toast('Offline earnings: '+NS.Utils.format(NS.Game.offline.coins)+' Coins');
  };
  U.renderAll=()=>{U.renderTop();U.renderIslandNav();U.renderStage();U.renderPanels();};
  U.renderTop=()=>{
    const s=NS.Game.state;$('#player-level').textContent='Level '+s.level;$('#xp-fill').style.width=(100*s.xp/NS.Progression.xpForLevel(s.level))+'%';
    for(const k of Object.keys(NS.CURRENCIES)){$(`#cur-${k}`).textContent=NS.Utils.format(s.currencies[k]);}
  };
  U.renderIslandNav=()=>{
    const s=NS.Game.state,wrap=$('#island-nav');wrap.innerHTML=NS.ISLANDS.map(i=>{
      const unlocked=s.islands[i.id].unlocked, active=i.id===NS.Game.current;
      return `<button class="island-pill ${active?'active':''} ${unlocked?'':'locked'}" data-island="${i.id}" aria-label="${i.name}"><span>${i.name}</span><small>${unlocked?'Open':'Lv '+i.level}</small></button>`;
    }).join('');
    $$('#island-nav [data-island]').forEach(b=>b.onclick=()=>{const id=b.dataset.island;if(s.islands[id].unlocked)NS.Game.switchIsland(id);else U.modalUnlock(id);});
  };
  U.renderStage=()=>{
    const isl=NS.Game.island(),s=NS.Game.islandState();$('#island-title').textContent=isl.name;$('#island-desc').textContent=isl.desc;$('#stage').dataset.theme=isl.theme;
    $('#castle-name').textContent=NS.CASTLE_NAMES[s.castle];$('#beds').textContent=NS.Game.bedsUsed()+' / '+NS.Game.bedsMax()+' beds';
    const castle=$('#castle');castle.innerHTML=`<div class="castle-tower lv${s.castle}"><div class="castle-cap"></div><div class="castle-window"></div><div class="castle-door"></div></div><button id="upgrade-castle">Upgrade Castle</button>`;$('#upgrade-castle').onclick=NS.Game.upgradeCastle;
    const placed=NS.Game.state.monsters.filter(m=>m.placed&&m.island===isl.id);const grid=$('#performers');
    grid.innerHTML=placed.length?placed.map(inst=>U.monsterStage(inst)).join(''):`<div class="empty-stage"><strong>Your island is quiet.</strong><span>Open Market or Nursery and place performers to build the song.</span></div>`;
    $$('#performers .performer').forEach(el=>{el.onclick=e=>{if(e.target.closest('button,input'))return;U.modalMonster(el.dataset.uid);};});
  };
  U.monsterStage=inst=>{const m=NS.MONSTERS.find(x=>x.id===inst.species);return `<div class="performer" data-uid="${inst.uid}" title="${m.name}">${NS.Art.monsterSVG(m,inst.form)}<div class="nameplate"><b>${m.name}</b><span>Lv ${inst.level}</span></div><button class="coin-bubble" data-collect="${inst.uid}">${NS.Utils.format(NS.Game.coinAmount(inst))} C</button></div>`;};
  U.renderPanels=()=>{
    $$('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===U.tab));
    const p=$('#panel'); if(U.tab==='island')p.innerHTML=U.panelIsland();if(U.tab==='market')p.innerHTML=U.panelMarket();if(U.tab==='breed')p.innerHTML=U.panelBreed();if(U.tab==='book')p.innerHTML=U.panelBook();if(U.tab==='quests')p.innerHTML=U.panelQuests(); U.bindPanel();
  };
  U.panelIsland=()=>{
    const unplaced=NS.Game.state.monsters.filter(m=>!m.placed && NS.MONSTERS.find(x=>x.id===m.species).islands.includes(NS.Game.current));
    return `<div class="panel-head"><div><h2>Collection Box</h2><p>Stored performers that can live on ${NS.Game.island().name}.</p></div></div><div class="card-grid">${unplaced.length?unplaced.map(inst=>{const m=NS.MONSTERS.find(x=>x.id===inst.species);return `<article class="monster-card">${NS.Art.monsterSVG(m,inst.form)}<h3>${m.name}</h3><p>${NS.FORMS.find(f=>f.id===inst.form).name} | ${m.part}</p><button data-place="${inst.uid}">Place</button></article>`;}).join(''):'<div class="empty-card">No stored performers for this island yet.</div>'}</div>`;
  };
  U.panelMarket=()=>{
    const list=NS.MONSTERS.filter(m=>m.islands.includes(NS.Game.current));
    return `<div class="panel-head"><div><h2>Market</h2><p>Build your orchestra, then use the Nectar Kitchen to keep feeding performers.</p></div></div><div class="kitchen"><div><h3>Nectar Kitchen</h3><p>Convert earned Coins into feeding Nectar.</p></div><button data-nectar="small">1,200 Nectar | 5,000 Coins</button><button data-nectar="large">5,500 Nectar | 20,000 Coins</button><button data-nectar="grand">22,000 Nectar | 70,000 Coins</button></div><div class="card-grid">${list.map(m=>`<article class="monster-card">${NS.Art.monsterSVG(m,'common')}<h3>${m.name}</h3><p>${m.part}</p><div class="tags">${m.elements.map(e=>`<span>${e}</span>`).join('')}</div><button data-buy="${m.id}">${NS.Utils.format(m.baseCost)} Coins</button></article>`).join('')}</div>`;
  };
  U.panelBreed=()=>{
    const job=NS.Game.state.breedJobs[NS.Game.current],nur=NS.Game.state.nurseryJobs[NS.Game.current],owned=NS.Game.state.monsters.filter(x=>x.island===NS.Game.current||NS.MONSTERS.find(m=>m.id===x.species).islands.includes(NS.Game.current));
    const opts=owned.map(x=>{const m=NS.MONSTERS.find(y=>y.id===x.species);return `<option value="${m.id}">${m.name} (${x.form})</option>`;}).join('');
    return `<div class="panel-head"><div><h2>Breeding Hollow and Nursery</h2><p>Combine parent traits. Higher player levels unlock chances for rarer forms.</p></div></div><div class="breed-layout"><section class="facility"><h3>Breeding Hollow</h3>${job?U.jobHTML(job,'breed'):`<label>Parent A<select id="breed-a"><option value="">Choose</option>${opts}</select></label><label>Parent B<select id="breed-b"><option value="">Choose</option>${opts}</select></label><button id="start-breed">Start Breed</button>`}</section><section class="facility"><h3>Nursery</h3>${nur?U.jobHTML(nur,'nursery'):'<div class="incubator empty-incubator">Nursery slot is empty.</div>'}</section></div>`;
  };
  U.jobHTML=(j,kind)=>{const m=NS.MONSTERS.find(x=>x.id===j.monsterId),ready=Date.now()>=j.end;return `<div class="job">${NS.Art.monsterSVG(m,j.form)}<h4>${kind==='breed'?'Mysterious Egg':m.name}</h4><p class="timer" data-end="${j.end}">${ready?'Ready':U.time(j.end-Date.now())}</p>${ready&&kind==='nursery'?'<button id="hatch-now">Hatch</button>':ready?'<span>Moving to Nursery...</span>':`<button data-skip="${kind}">Finish with Prisms</button>`}</div>`;};
  U.panelBook=()=>{
    const total=NS.MONSTERS.length*NS.FORMS.length,found=NS.Progression.discoveredCount(NS.Game.state);
    return `<div class="panel-head"><div><h2>Field Guide</h2><p>${found} / ${total} forms discovered.</p></div></div><div class="book-grid">${NS.MONSTERS.map(m=>`<article class="book-row"><div class="book-art">${NS.Art.monsterSVG(m,'common')}</div><div><h3>${m.name}</h3><p>${m.part}</p><div class="forms">${NS.FORMS.map(f=>`<span class="${NS.Game.state.discovered[m.id+':'+f.id]?'found':''}">${f.name}</span>`).join('')}</div></div></article>`).join('')}</div>`;
  };
  U.panelQuests=()=>{
    NS.Progression.ensureDaily(NS.Game.state);
    const main=NS.QUESTS.map(q=>U.questCard(q,false)).join(''), daily=NS.Game.state.daily.ids.map(id=>U.questCard(NS.DAILY_POOL.find(q=>q.id===id),true)).join('');
    return `<div class="panel-head"><div><h2>Goals</h2><p>Long-term quests and a rotating daily set.</p></div></div><h3 class="section-label">Daily</h3><div class="quest-list">${daily}</div><h3 class="section-label">Milestones</h3><div class="quest-list">${main}</div>`;
  };
  U.questCard=(q,daily)=>{const n=NS.Progression.metric(NS.Game.state,q.type),claimed=daily?NS.Game.state.daily.claimed[q.id]:NS.Game.state.quests[q.id],done=n>=q.target;return `<article class="quest-card"><div><h3>${q.name}</h3><p>${q.goal}</p><div class="progress"><span style="width:${Math.min(100,n/q.target*100)}%"></span></div><small>${Math.min(n,q.target)} / ${q.target}</small></div><button data-quest="${q.id}" data-daily="${daily?1:0}" ${!done||claimed?'disabled':''}>${claimed?'Claimed':'Claim'}</button></article>`;};
  U.bindPanel=()=>{
    $$('[data-place]').forEach(b=>b.onclick=()=>NS.Game.place(b.dataset.place));$$('[data-buy]').forEach(b=>b.onclick=()=>NS.Game.buyStarter(b.dataset.buy));$$('[data-nectar]').forEach(b=>b.onclick=()=>NS.Game.buyNectar(b.dataset.nectar));
    $('#start-breed')&&($('#start-breed').onclick=()=>{const a=$('#breed-a').value,b=$('#breed-b').value;if(!a||!b||a===b)return U.toast('Choose two different parent species.');NS.Game.startBreed(a,b);});
    $$('[data-skip]').forEach(b=>b.onclick=()=>NS.Game.skipJob(b.dataset.skip));$('#hatch-now')&&($('#hatch-now').onclick=()=>NS.Game.hatch());
    $$('[data-quest]').forEach(b=>b.onclick=()=>{if(NS.Quests.claim(NS.Game.state,b.dataset.quest,b.dataset.daily==='1')){NS.Audio.fx('collect');NS.Game.save();U.renderAll();}});
    $$('[data-collect]').forEach(b=>b.onclick=e=>{e.stopPropagation();NS.Game.collect(b.dataset.collect);});
  };
  U.modalMonster=uid=>{const inst=NS.Game.state.monsters.find(x=>x.uid===uid),m=NS.MONSTERS.find(x=>x.id===inst.species),amount=NS.Game.coinAmount(inst);U.openModal(`<div class="monster-modal">${NS.Art.monsterSVG(m,inst.form)}<h2>${m.name}</h2><p>${NS.FORMS.find(f=>f.id===inst.form).name} | Level ${inst.level} | ${m.part}</p><p>This performer visibly uses its ${m.part} when its musical part fires.</p><div class="modal-actions"><button id="m-feed">Feed</button><button id="m-collect">Collect ${NS.Utils.format(amount)} Coins</button><button id="m-box">Move to Box</button></div><label class="mixer">Part Volume <input id="m-volume" type="range" min="0" max="1.5" step="0.05" value="${inst.volume}"></label><label class="check"><input id="m-muted" type="checkbox" ${inst.muted?'checked':''}> Mute performer</label></div>`);$('#m-feed').onclick=()=>{NS.Game.feed(uid);U.closeModal();};$('#m-collect').onclick=()=>{NS.Game.collect(uid);U.closeModal();};$('#m-box').onclick=()=>{NS.Game.box(uid);U.closeModal();};$('#m-volume').oninput=e=>NS.Game.setMixer(uid,'volume',e.target.value);$('#m-muted').onchange=e=>NS.Game.setMixer(uid,'muted',e.target.checked);};
  U.modalUnlock=id=>{const i=NS.ISLANDS.find(x=>x.id===id);U.openModal(`<div class="unlock-modal"><h2>${i.name}</h2><p>${i.desc}</p><div class="unlock-meta"><span>Required level: ${i.level}</span><span>Cost: ${NS.Utils.costText(i.cost)}</span></div><button id="unlock-island" ${NS.Game.state.level<i.level?'disabled':''}>Unlock Island</button></div>`);$('#unlock-island').onclick=()=>{NS.Game.unlockIsland(id);U.closeModal();};};
  U.modalSettings=()=>{const s=NS.Game.state.settings;U.openModal(`<h2>Sound and Display</h2><label>Master ${s.master}%<input id="set-master" type="range" min="0" max="2000" value="${s.master}"></label><label>Music ${s.music}%<input id="set-music" type="range" min="0" max="2000" value="${s.music}"></label><label>SFX ${s.sfx}%<input id="set-sfx" type="range" min="0" max="2000" value="${s.sfx}"></label><label class="check"><input id="set-motion" type="checkbox" ${s.reducedMotion?'checked':''}> Reduce motion</label><div class="modal-actions"><button id="export-save">Export Save</button><label class="file-btn">Import Save<input id="import-save" type="file" accept="application/json"></label></div>`);['master','music','sfx'].forEach(k=>{$('#set-'+k).oninput=e=>{s[k]=Number(e.target.value);NS.Audio.applySettings();NS.Game.save();};});$('#set-motion').onchange=e=>{s.reducedMotion=e.target.checked;document.documentElement.classList.toggle('reduced',s.reducedMotion);NS.Game.save();};$('#export-save').onclick=()=>NS.Save.exportSave(NS.Game.state);$('#import-save').onchange=e=>NS.Save.importSave(e.target.files[0],(err,data)=>{if(err)return U.toast('Could not import that save.');NS.Game.state=data;NS.Audio.setState(data);NS.Game.current=data.selectedIsland||'moss';U.closeModal();U.renderAll();});};
  U.modalDev=()=>{U.openModal(`<h2>Developer Console</h2><p>Use this local-only panel to add or set any currency amount for testing and sandbox play.</p><label>Currency<select id="dev-cur">${Object.entries(NS.CURRENCIES).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select></label><label>Amount<input id="dev-amount" type="number" min="0" value="1000"></label><div class="modal-actions"><button id="dev-add">Add Amount</button><button id="dev-set">Set Exact Amount</button></div><hr><button class="danger" id="dev-reset">Reset All Save Data</button>`);setTimeout(()=>{$('#dev-add').onclick=()=>NS.Game.devCurrency('add',$('#dev-cur').value,$('#dev-amount').value);$('#dev-set').onclick=()=>NS.Game.devCurrency('set',$('#dev-cur').value,$('#dev-amount').value);$('#dev-reset').onclick=()=>{if(confirm('Reset all local save data? This cannot be undone unless you exported a save.')){NS.Game.reset();U.closeModal();}};},0);};
  U.modalHelp=()=>U.openModal(`<h2>How to Play</h2><p>Build each island as a living band. Every insect has a visible performance action tied to the sound it makes. Breed combinations, hatch eggs, place performers, feed them to level 20, upgrade castles for more beds, complete the Field Guide, and unlock the late-game islands.</p><p>Tap any placed performer to change its individual volume or mute it. Use the Developer Console whenever you want exact sandbox currency amounts.</p><p>The soundtrack is generated in real time with original synthesized instruments and patterns. No copyrighted My Singing Monsters audio or artwork is included.</p>`);
  U.openModal=html=>{$('#modal-body').innerHTML=html;$('#modal').classList.add('show');};U.closeModal=()=>$('#modal').classList.remove('show');
  U.toast=msg=>{const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(U.toastTimer);U.toastTimer=setTimeout(()=>t.classList.remove('show'),2600);};
  U.time=ms=>{const s=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(s/60),r=s%60;return m+':'+String(r).padStart(2,'0');};
  U.tick=()=>{$$('.timer[data-end]').forEach(el=>{const left=Number(el.dataset.end)-Date.now();el.textContent=left<=0?'Ready':U.time(left);});$$('[data-collect]').forEach(b=>{const inst=NS.Game.state.monsters.find(x=>x.uid===b.dataset.collect);if(inst)b.textContent=NS.Utils.format(NS.Game.coinAmount(inst))+' C';});U.renderTop();};
  NS.UI=U;
})(window.SwarmSong);
