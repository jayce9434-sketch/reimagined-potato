window.SwarmSong = window.SwarmSong || {};
(function(NS){
  const KEY='swarm_symphony_save_v1';
  function fresh(){
    const now=Date.now();
    return {
      version:NS.VERSION, created:now,lastSeen:now,level:1,xp:0,
      currencies:{coins:12000,food:1200,gems:20,storm:0},
      islands:{moss:{unlocked:true,castle:0},rain:{unlocked:false,castle:0},ember:{unlocked:false,castle:0},frost:{unlocked:false,castle:0},aurora:{unlocked:false,castle:0},tempest:{unlocked:false,castle:0}},
      monsters:[], breedJobs:{}, nurseryJobs:{},
      discovered:{}, quests:{}, stats:{placed:0,castle:0,dailyPlace:0,dailyFeed:0,dailyCollect:0,dailyBreed:0,dailyMix:0,breeds:0,hatches:0},
      daily:{date:'',ids:[],claimed:{}},
      settings:{music:70,sfx:80,master:100,reducedMotion:false},
      selectedIsland:'moss', tutorialDone:false
    };
  }
  function load(){
    try{
      const raw=localStorage.getItem(KEY); if(!raw) return fresh();
      const s=JSON.parse(raw); const f=fresh();
      return Object.assign(f,s,{currencies:Object.assign(f.currencies,s.currencies||{}),islands:Object.assign(f.islands,s.islands||{}),settings:Object.assign(f.settings,s.settings||{}),stats:Object.assign(f.stats,s.stats||{})});
    }catch(e){return fresh();}
  }
  function save(state){ state.lastSeen=Date.now(); localStorage.setItem(KEY,JSON.stringify(state)); }
  function reset(){ localStorage.removeItem(KEY); return fresh(); }
  function exportSave(state){
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='swarm-symphony-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function importSave(file,cb){
    const r=new FileReader();r.onload=()=>{try{const s=JSON.parse(r.result);localStorage.setItem(KEY,JSON.stringify(s));cb(null,s);}catch(e){cb(e);}};r.readAsText(file);
  }
  NS.Save={fresh,load,save,reset,exportSave,importSave,KEY};
})(window.SwarmSong);
