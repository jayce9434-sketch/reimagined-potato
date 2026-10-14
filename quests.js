window.SwarmSong = window.SwarmSong || {};
(function(NS){
  const Q={};
  Q.claim=(state,id,daily=false)=>{
    const list=daily?NS.DAILY_POOL:NS.QUESTS, q=list.find(x=>x.id===id); if(!q)return false;
    const claimed=daily?state.daily.claimed:(state.quests||{}); if(claimed[id])return false;
    if(NS.Progression.metric(state,q.type)<q.target)return false;
    claimed[id]=true; NS.Progression.reward(state,q.reward); return true;
  };
  NS.Quests=Q;
})(window.SwarmSong);
