window.SwarmSong = window.SwarmSong || {};
(function(NS){
  class AudioEngine{
    constructor(){this.ctx=null;this.master=null;this.music=null;this.sfx=null;this.timer=null;this.step=0;this.bar=0;this.next=0;this.state=null;this.island='moss';this.running=false;this.noiseBuffer=null;}
    ensure(){
      if(this.ctx) return;
      const AC=window.AudioContext||window.webkitAudioContext; this.ctx=new AC();
      this.master=this.ctx.createGain();this.music=this.ctx.createGain();this.sfx=this.ctx.createGain();
      this.music.connect(this.master);this.sfx.connect(this.master);this.master.connect(this.ctx.destination);
      const len=this.ctx.sampleRate*1.5,b=this.ctx.createBuffer(1,len,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;this.noiseBuffer=b;
    }
    setState(s){this.state=s;this.applySettings();}
    applySettings(){if(!this.ctx||!this.state)return;const x=this.state.settings;this.master.gain.value=(x.master||100)/100;this.music.gain.value=(x.music||0)/100;this.sfx.gain.value=(x.sfx||0)/100;}
    resume(){this.ensure(); if(this.ctx.state==='suspended')this.ctx.resume(); if(!this.running){this.running=true;this.step=0;this.next=this.ctx.currentTime+.06;this.timer=setInterval(()=>this.schedule(),25);} }
    stop(){this.running=false;clearInterval(this.timer);this.timer=null;}
    setIsland(id){this.island=id;this.step=0;this.bar=0;}
    midi(n){return 440*Math.pow(2,(n-69)/12);}
    env(node,t,a=.006,d=.18,v=.18){node.gain.setValueAtTime(0,t);node.gain.linearRampToValueAtTime(v,t+a);node.gain.exponentialRampToValueAtTime(.0001,t+a+d);}
    osc(freq,t,d=.16,type='sine',gain=.13,out=this.music){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);this.env(g,t,.008,d,gain);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.04);}
    noise(t,d=.12,gain=.08,filter=900,out=this.music){const s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();s.buffer=this.noiseBuffer;f.type='bandpass';f.frequency.value=filter;f.Q.value=.7;this.env(g,t,.003,d,gain);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+d+.03);}
    part(m,inst,t,step,island,bar){
      const vol=(inst.volume==null?1:inst.volume)*.55; if(inst.muted||vol<=0)return;
      const seed=NS.Utils.hash(m.id+island.id), scale=island.scale;
      const progressions={moss:[0,3,4,0],rain:[0,4,2,5],ember:[0,2,4,1],frost:[0,3,1,4],aurora:[0,4,5,3],tempest:[0,5,3,4]};
      const prog=progressions[island.id]||progressions.moss, base=prog[bar%prog.length]%scale.length;
      const motif=[0,1,2,1,3,2,4,2], degree=(base+motif[(step+(seed%4))%motif.length])%scale.length, root=island.key+scale[degree], f=this.midi(root);
      const hit=(div,off=0)=>step%div===off;
      switch(m.role){
        case 'drum': if(hit(4,0)||hit(8,6)){this.noise(t,.1,.16*vol,160);this.osc(80,t,.12,'sine',.18*vol);} break;
        case 'click': if(hit(4,seed%4))this.noise(t,.035,.14*vol,2200); break;
        case 'clack': if(hit(8,seed%4)||hit(8,(seed+5)%8)){this.noise(t,.055,.16*vol,1300);this.osc(f*2,t,.06,'triangle',.06*vol);} break;
        case 'pluck': if(hit(2,seed%2))this.osc(f*(step%4===0?1:2),t,.14,'triangle',.14*vol); break;
        case 'bell': if(hit(4,seed%4)){this.osc(f*2,t,.5,'sine',.11*vol);this.osc(f*3.01,t,.35,'sine',.04*vol);} break;
        case 'bass': if(hit(4,0)){this.osc(this.midi(island.key-12+scale[(base+(step/4|0)%2)%scale.length]),t,.32,'sawtooth',.09*vol);} break;
        case 'hum': if(hit(8,0)||hit(8,4)){this.osc(f,t,.5,'sine',.08*vol);this.osc(f*1.5,t,.45,'sine',.04*vol);} break;
        case 'reed': if(hit(4,seed%4)){this.osc(f,t,.22,'square',.05*vol);this.osc(f*2,t,.2,'sine',.03*vol);} break;
        case 'shaker': if(step%2===seed%2)this.noise(t,.04,.07*vol,5200); break;
        case 'gong': if(hit(8,0)){this.osc(f/2,t,.85,'sine',.12*vol);this.osc(f*1.51,t,.7,'triangle',.04*vol);} break;
        case 'arp': if(step%2===0){const n=island.key+12+scale[(base+motif[(step/2+seed)%motif.length])%scale.length];this.osc(this.midi(n),t,.13,'triangle',.1*vol);} break;
        case 'synth': if(hit(4,seed%4)){this.osc(f,t,.2,'sawtooth',.07*vol);this.osc(f*2,t,.16,'square',.025*vol);} break;
        case 'chord': if(hit(8,0)){[0,2,4].forEach((o,i)=>this.osc(this.midi(island.key+scale[(base+o)%scale.length]+(i===2?12:0)),t,.72,'sine',.055*vol));} break;
        case 'lead': if(step%2===seed%2){const seq=[0,2,4,3,5,4,2,1];const n=island.key+12+scale[(base+seq[(step/2|0)%seq.length])%scale.length];this.osc(this.midi(n),t,.18,'sawtooth',.06*vol);} break;
        case 'drone': if(hit(16,0)){this.osc(this.midi(island.key+scale[base]),t,1.8,'sine',.05*vol);this.osc(this.midi(island.key+scale[(base+2)%scale.length]+12),t,1.8,'sine',.03*vol);} break;
      }
      if((m.role!=='drone') && (step%2===seed%2)) setTimeout(()=>NS.Art.pulse(inst.uid),Math.max(0,(t-this.ctx.currentTime)*1000));
    }
    schedule(){
      if(!this.ctx||!this.state)return; const island=NS.ISLANDS.find(i=>i.id===this.island)||NS.ISLANDS[0]; const spb=60/island.bpm/4;
      while(this.next<this.ctx.currentTime+.12){
        const placed=this.state.monsters.filter(x=>x.placed&&x.island===island.id);
        for(const inst of placed){const m=NS.MONSTERS.find(x=>x.id===inst.species);if(m)this.part(m,inst,this.next,this.step%16,island,this.bar);}
        if(island.id==='rain' && this.step%2===1)this.noise(this.next,.055,.012,5200,this.music);
        if(island.id==='tempest' && this.step===0 && this.bar%4===3){this.noise(this.next,.7,.055,110,this.music);this.osc(46,this.next,.9,'sine',.045,this.music);}
        if(island.id==='frost' && this.step===0 && this.bar%2===0)this.osc(this.midi(island.key+24),this.next,.8,'sine',.025,this.music);
        this.step=(this.step+1)%16;if(this.step===0)this.bar++;this.next+=spb;
      }
    }
    fx(kind){this.resume();const t=this.ctx.currentTime+.01; if(kind==='buy'){this.osc(660,t,.08,'sine',.16,this.sfx);this.osc(880,t+.06,.12,'sine',.12,this.sfx);} else if(kind==='hatch'){[523,659,784].forEach((f,i)=>this.osc(f,t+i*.06,.25,'triangle',.13,this.sfx));} else if(kind==='feed'){this.noise(t,.05,.08,3200,this.sfx);this.osc(440,t,.08,'sine',.08,this.sfx);} else if(kind==='collect'){this.osc(880,t,.08,'sine',.1,this.sfx);this.osc(1320,t+.04,.09,'sine',.08,this.sfx);} else if(kind==='unlock'){[392,523,659,784].forEach((f,i)=>this.osc(f,t+i*.08,.45,'triangle',.11,this.sfx));} else {this.osc(520,t,.08,'sine',.08,this.sfx);} }
  }
  NS.Audio=new AudioEngine();
})(window.SwarmSong);
