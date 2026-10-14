window.SwarmSong = window.SwarmSong || {};
(function(NS){
  const A={};
  const palettes={
    common:['#7fd06c','#313b2e','#f6e5a9'],rare:['#7cbcff','#3c2d68','#f6dcff'],epic:['#ff9b4d','#4a214f','#ffe6a1'],stormtouched:['#75f1ff','#182147','#d7fbff']
  };
  function p(form,i){return (palettes[form]||palettes.common)[i%3];}
  function svgWrap(body,cls){return `<svg class="bug-svg ${cls}" viewBox="0 0 160 150" aria-hidden="true">${body}</svg>`;}
  function eyes(){return `<circle cx="65" cy="50" r="7" fill="#fff"/><circle cx="95" cy="50" r="7" fill="#fff"/><circle cx="66" cy="51" r="3"/><circle cx="94" cy="51" r="3"/>`;}
  A.monsterSVG=(m,form='common')=>{
    const c1=p(form,0),c2=p(form,1),c3=p(form,2), stroke='#17221d';
    const wing=`fill="${c3}" fill-opacity=".78" stroke="${stroke}" stroke-width="4"`;
    const body=`fill="${c1}" stroke="${stroke}" stroke-width="5"`;
    const dark=`fill="${c2}" stroke="${stroke}" stroke-width="5"`;
    let s='';
    switch(m.art){
      case 'ant': case 'termite':
        s=`<g class="legs" stroke="${stroke}" stroke-width="6" stroke-linecap="round"><path d="M58 92L28 120M64 101L41 136M102 92L132 120M96 101L119 136"/></g><ellipse class="abdomen soundpart" cx="118" cy="86" rx="31" ry="27" ${dark}/><ellipse cx="80" cy="83" rx="25" ry="23" ${body}/><circle class="head soundpart" cx="48" cy="70" r="25" ${body}/><path d="M38 47Q25 25 16 31M57 47Q70 25 79 31" fill="none" stroke="${stroke}" stroke-width="5"/>${eyes().replace(/65/g,'39').replace(/95/g,'56').replace(/50/g,'66').replace(/66/g,'40').replace(/94/g,'55').replace(/51/g,'67')}`;break;
      case 'cricket': case 'cicada': case 'icecicada':
        s=`<path class="wing soundpart" d="M76 77Q30 38 31 103Q54 122 82 91Z" ${wing}/><path class="wing soundpart" d="M84 77Q130 38 129 103Q106 122 78 91Z" ${wing}/><ellipse cx="80" cy="91" rx="23" ry="38" ${body}/><circle cx="80" cy="50" r="25" ${dark}/><path d="M67 28Q58 8 45 12M93 28Q102 8 115 12" fill="none" stroke="${stroke}" stroke-width="5"/>${eyes()}`;break;
      case 'moth': case 'wintermoth': case 'atlasmoth': case 'lacewing':
        s=`<path class="wing soundpart" d="M76 67Q14 13 19 100Q36 131 75 99Z" ${wing}/><path class="wing soundpart" d="M84 67Q146 13 141 100Q124 131 85 99Z" ${wing}/><ellipse cx="80" cy="90" rx="18" ry="42" ${body}/><circle cx="80" cy="46" r="22" ${dark}/><path d="M69 29Q56 6 44 13M91 29Q104 6 116 13" fill="none" stroke="${stroke}" stroke-width="4"/>${eyes()}`;break;
      case 'beetle': case 'ladybug': case 'divingbeetle': case 'scarab':
        s=`<ellipse class="shell soundpart" cx="80" cy="92" rx="48" ry="43" ${body}/><path d="M80 51V133" stroke="${stroke}" stroke-width="5"/><circle cx="80" cy="49" r="25" ${dark}/><path d="M67 29L55 12M93 29L105 12" stroke="${stroke}" stroke-width="5"/>${eyes()}`;break;
      case 'mantis': case 'prismantis': case 'assassin':
        s=`<g stroke="${stroke}" stroke-width="7" stroke-linecap="round"><path class="arm soundpart" d="M65 75L33 61L18 88"/><path class="arm soundpart" d="M95 75L127 61L142 88"/><path d="M68 112L43 138M92 112L117 138"/></g><ellipse cx="80" cy="92" rx="22" ry="36" ${body}/><path d="M55 35L80 20L105 35L98 61L62 61Z" ${dark}/>${eyes()}`;break;
      case 'mosquito': case 'mayfly': case 'dragonfly': case 'damselfly': case 'glaciergnat': case 'stormglass':
        s=`<path class="wing soundpart" d="M74 70Q22 20 17 65Q35 91 73 87Z" ${wing}/><path class="wing soundpart" d="M86 70Q138 20 143 65Q125 91 87 87Z" ${wing}/><path class="wing soundpart" d="M74 84Q22 69 27 111Q49 127 75 101Z" ${wing}/><path class="wing soundpart" d="M86 84Q138 69 133 111Q111 127 85 101Z" ${wing}/><ellipse cx="80" cy="90" rx="15" ry="42" ${body}/><circle cx="80" cy="45" r="20" ${dark}/><path class="proboscis soundpart" d="M80 54L80 86" stroke="${stroke}" stroke-width="5"/>${eyes()}`;break;
      case 'strider': case 'snowflea':
        s=`<g class="legs soundpart" stroke="${stroke}" stroke-width="6" stroke-linecap="round"><path d="M66 76L24 45M67 85L16 87M68 95L28 130M94 76L136 45M93 85L144 87M92 95L132 130"/></g><ellipse cx="80" cy="87" rx="26" ry="43" ${body}/><circle cx="80" cy="45" r="21" ${dark}/>${eyes()}`;break;
      default:
        s=`<path class="wing soundpart" d="M74 75Q27 27 24 85Q43 112 74 98Z" ${wing}/><path class="wing soundpart" d="M86 75Q133 27 136 85Q117 112 86 98Z" ${wing}/><ellipse cx="80" cy="91" rx="25" ry="41" ${body}/><circle cx="80" cy="49" r="24" ${dark}/>${eyes()}`;
    }
    const h=NS.Utils.hash(m.id); const mark=h%5;
    if(mark===0) s += `<circle cx="80" cy="96" r="8" fill="${c3}" opacity=".85"/><circle cx="80" cy="116" r="5" fill="${c3}" opacity=".75"/>`;
    if(mark===1) s += `<path d="M58 88Q80 76 102 88M57 106Q80 94 103 106" fill="none" stroke="${c3}" stroke-width="6" opacity=".8"/>`;
    if(mark===2) s += `<path d="M68 30L59 12M92 30L101 12" stroke="${c3}" stroke-width="6" stroke-linecap="round"/>`;
    if(mark===3) s += `<circle cx="55" cy="88" r="5" fill="${c3}"/><circle cx="105" cy="88" r="5" fill="${c3}"/><circle cx="80" cy="110" r="5" fill="${c3}"/>`;
    if(mark===4) s += `<path d="M49 72Q80 91 111 72" fill="none" stroke="${c3}" stroke-width="5" stroke-linecap="round"/>`;
    if((h>>3)%3===0) s += `<path d="M54 42Q80 26 106 42" fill="none" stroke="${c3}" stroke-width="4" opacity=".8"/>`;
    if(form==='stormtouched') s += `<path d="M20 22L31 9L40 25L52 11" fill="none" stroke="#bffaff" stroke-width="4" class="spark"/>`;
    return svgWrap(s,'art-'+m.art);
  };
  A.pulse=(uid)=>{
    const el=document.querySelector(`[data-uid="${uid}"]`); if(!el)return; el.classList.remove('perform'); void el.offsetWidth; el.classList.add('perform');
  };
  A.iconSVG=()=>`<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0f3328"/><stop offset="1" stop-color="#184a5d"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g)"/><circle cx="256" cy="275" r="112" fill="#7bdc8b" stroke="#091b17" stroke-width="20"/><circle cx="256" cy="160" r="76" fill="#314e38" stroke="#091b17" stroke-width="20"/><circle cx="225" cy="151" r="18" fill="white"/><circle cx="287" cy="151" r="18" fill="white"/><circle cx="228" cy="154" r="8"/><circle cx="284" cy="154" r="8"/><path d="M213 101Q174 47 137 69M299 101Q338 47 375 69" fill="none" stroke="#091b17" stroke-width="18" stroke-linecap="round"/><path d="M151 277L76 231M159 320L91 354M361 277L436 231M353 320L421 354" fill="none" stroke="#091b17" stroke-width="22" stroke-linecap="round"/><path d="M181 273Q256 220 331 273M181 320Q256 267 331 320" fill="none" stroke="#eaf7bd" stroke-width="16" stroke-linecap="round"/></svg>`;
  NS.Art=A;
})(window.SwarmSong);
