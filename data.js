window.SwarmSong = window.SwarmSong || {};
(function(NS){
  NS.VERSION = '1.0.0';
  NS.CURRENCIES = {
    coins:{name:'Coins',short:'C'},
    food:{name:'Nectar',short:'N'},
    gems:{name:'Prisms',short:'P'},
    storm:{name:'Stormglass',short:'S'}
  };

  NS.ISLANDS = [
    {id:'moss',name:'Moss Meadow',level:1,cost:{coins:0},bpm:92,key:48,scale:[0,2,4,7,9],beds:[10,18,32,52,88,160],castleCosts:[0,4000,15000,50000,150000,18],theme:'moss',desc:'A warm starter grove built around wood, leaf and body percussion.'},
    {id:'rain',name:'Rainroot Basin',level:7,cost:{coins:50000},bpm:100,key:50,scale:[0,2,3,5,7,9,10],beds:[12,22,38,62,100,170],castleCosts:[0,12000,38000,110000,290000,28],theme:'rain',desc:'Rain, reeds and flowing rhythms shape a bright layered song.'},
    {id:'ember',name:'Ember Burrow',level:12,cost:{coins:150000},bpm:112,key:45,scale:[0,3,5,7,10],beds:[14,26,44,70,112,180],castleCosts:[0,25000,75000,200000,520000,42],theme:'ember',desc:'A glowing cavern with shell clacks, deep bass and metallic sparks.'},
    {id:'frost',name:'Frostwing Shelf',level:16,cost:{coins:400000},bpm:84,key:53,scale:[0,2,5,7,9],beds:[16,30,50,78,124,190],castleCosts:[0,50000,140000,360000,850000,58],theme:'frost',desc:'Thin ice, wing harmonics and bell tones create a spacious choir.'},
    {id:'aurora',name:'Aurora Hive',level:20,cost:{gems:150},bpm:108,key:51,scale:[0,2,4,6,7,9,11],beds:[18,34,56,88,136,210],castleCosts:[0,70,120,190,290,410],theme:'aurora',desc:'Prismatic insects weave syncopated arpeggios and luminous chords.'},
    {id:'tempest',name:'Tempest Crown',level:25,cost:{storm:250},bpm:124,key:46,scale:[0,2,3,5,7,8,10],beds:[20,38,62,96,148,230],castleCosts:[0,90,160,250,380,520],theme:'tempest',desc:'The endgame storm island layers thunder drums, rapid wings and huge harmonic swells.'}
  ];

  const M = (id,name,elements,role,part,rarity,islands,beds,baseCost,breed,art)=>({id,name,elements,role,part,rarity,islands,beds,baseCost,breed,art});
  NS.MONSTERS = [
    M('ant','Drum Ant',['leaf'],'drum','abdomen taps','common',['moss','rain'],1,250,30,'ant'),
    M('termite','Knock Termite',['wood'],'click','head knocks','common',['moss','ember'],1,300,35,'termite'),
    M('cricket','Fiddle Cricket',['air'],'pluck','wing stridulation','common',['moss','frost'],1,350,40,'cricket'),
    M('beetle','Clack Beetle',['stone'],'clack','elytra shell clacks','common',['moss','ember'],1,400,45,'beetle'),
    M('moth','Velvet Moth',['leaf','air'],'hum','soft wing hum','uncommon',['moss','frost','aurora'],2,1200,90,'moth'),
    M('mantis','Chime Mantis',['leaf','stone'],'bell','foreleg chimes','uncommon',['moss','aurora'],2,1600,105,'mantis'),
    M('cicada','Pulse Cicada',['air','wood'],'bass','tymbal pulses','uncommon',['moss','rain','tempest'],2,1900,120,'cicada'),
    M('ladybug','Dotbell',['leaf','stone'],'bell','spotted shell bells','rare',['moss','aurora'],2,4200,180,'ladybug'),

    M('mosquito','Reed Mosquito',['water'],'reed','proboscis reed tone','common',['rain','tempest'],1,600,50,'mosquito'),
    M('waterstrider','Ripple Strider',['water','air'],'pluck','leg-plucked water strings','common',['rain'],1,750,55,'strider'),
    M('mayfly','Maychime',['water','leaf'],'bell','tail chimes','uncommon',['rain','frost'],2,1800,100,'mayfly'),
    M('dragonfly','Glasswing Dragonfly',['water','air','stone'],'arp','four-wing harp','rare',['rain','aurora','tempest'],3,6000,240,'dragonfly'),
    M('damselfly','Damsel Drone',['water','air'],'drone','wing drone','uncommon',['rain','frost'],2,2200,120,'damselfly'),
    M('divingbeetle','Pool Clacker',['water','stone'],'clack','water shell clacks','uncommon',['rain','ember'],2,2400,125,'divingbeetle'),
    M('caddis','Case Caddis',['water','wood'],'shaker','case shaker','rare',['rain'],2,5400,210,'caddis'),

    M('firefly','Lantern Firefly',['heat'],'synth','light pulse synth','common',['ember','aurora'],1,900,65,'firefly'),
    M('bombardier','Bass Bombardier',['heat','stone'],'bass','abdomen bass bursts','uncommon',['ember','tempest'],2,2800,135,'bombardier'),
    M('earwig','Pincer Earwig',['heat','wood'],'click','pincer castanets','uncommon',['ember'],2,2600,125,'earwig'),
    M('stagbeetle','Stag Gong',['heat','stone','wood'],'gong','mandible gong','rare',['ember','tempest'],3,7200,270,'stagbeetle'),
    M('assassin','Assassin Beatle',['heat','leaf'],'drum','raptorial drum hits','rare',['ember'],2,5800,230,'assassin'),
    M('roach','Cinder Roach',['heat','air'],'shaker','wing-case shaker','uncommon',['ember'],2,3200,145,'roach'),
    M('scarab','Sun Scarab',['heat','stone','air'],'chord','resonant shell chord','epic',['ember','aurora'],4,15000,420,'scarab'),

    M('snowflea','Snow Flea',['frost'],'pluck','spring-tail pluck','common',['frost'],1,1200,75,'snowflea'),
    M('lacewing','Crystal Lacewing',['frost','air'],'chord','lace-wing choir','uncommon',['frost','aurora'],2,3000,140,'lacewing'),
    M('stonefly','Ice Stonefly',['frost','stone'],'clack','ice plate taps','uncommon',['frost'],2,3400,150,'stonefly'),
    M('wintermoth','Pale Moth',['frost','leaf'],'hum','breathy wing vowel','rare',['frost'],2,7000,260,'wintermoth'),
    M('glaciergnat','Glacier Gnat',['frost','air','water'],'arp','frozen swarm arpeggio','rare',['frost','aurora'],3,8600,300,'glaciergnat'),
    M('icecicada','Hail Cicada',['frost','wood','stone'],'drum','icy tymbal roll','epic',['frost','tempest'],4,17000,450,'icecicada'),

    M('orchidbee','Orchid Bee',['prism'],'lead','buzz lead','rare',['aurora'],2,8500,290,'orchidbee'),
    M('jewelwasp','Jewel Wasp',['prism','air'],'arp','stinger harp','rare',['aurora'],3,9800,320,'jewelwasp'),
    M('atlasmoth','Atlas Choir',['prism','leaf','air'],'chord','wing choir','epic',['aurora'],4,19000,480,'atlasmoth'),
    M('prismantis','Prism Mantis',['prism','stone','leaf'],'bell','crystal foreleg chords','epic',['aurora','tempest'],4,22000,510,'prismantis'),

    M('thunderbug','Thunder Bug',['storm'],'drum','thorax thunder drum','rare',['tempest'],3,12000,340,'thunderbug'),
    M('stormglass','Stormglass Dragonfly',['storm','water','air'],'lead','charged wing lead','epic',['tempest'],4,26000,560,'stormglass'),
    M('cyclonefly','Cyclone Fly',['storm','air','heat'],'synth','spiral synth bursts','epic',['tempest'],4,30000,600,'cyclonefly'),
    M('supercell','Supercell Cicada',['storm','air','wood','stone'],'chord','storm-wall choir','mythic',['tempest'],5,50000,780,'supercell')
  ];

  NS.FORMS = [
    {id:'common',name:'Common',mult:1,coin:1,unlock:1},
    {id:'rare',name:'Rare',mult:1.35,coin:1.6,unlock:10},
    {id:'epic',name:'Epic',mult:1.7,coin:2.4,unlock:18},
    {id:'stormtouched',name:'Storm-Touched',mult:2.15,coin:3.2,unlock:25}
  ];

  NS.QUESTS = [
    {id:'q1',name:'First Harmony',goal:'Place 4 monsters on one island',type:'placed',target:4,reward:{coins:2500,food:600}},
    {id:'q2',name:'Growing Chorus',goal:'Reach player level 8',type:'level',target:8,reward:{gems:8}},
    {id:'q3',name:'Castle Keeper',goal:'Upgrade any castle 3 times',type:'castle',target:3,reward:{coins:12000,food:1800}},
    {id:'q4',name:'Collector',goal:'Discover 18 collection entries',type:'collection',target:18,reward:{gems:15}},
    {id:'q5',name:'Storm Chaser',goal:'Unlock Tempest Crown',type:'island',target:6,reward:{storm:120,gems:30}}
  ];

  NS.DAILY_POOL = [
    {id:'d-place',name:'Stage Crew',goal:'Place 3 monsters',type:'dailyPlace',target:3,reward:{coins:5500}},
    {id:'d-feed',name:'Nectar Run',goal:'Feed monsters 12 times',type:'dailyFeed',target:12,reward:{food:2200}},
    {id:'d-collect',name:'Full Pockets',goal:'Collect coins 8 times',type:'dailyCollect',target:8,reward:{gems:3}},
    {id:'d-breed',name:'New Duet',goal:'Start 2 breeds',type:'dailyBreed',target:2,reward:{storm:12}},
    {id:'d-mix',name:'Sound Check',goal:'Adjust 4 monster mixers',type:'dailyMix',target:4,reward:{coins:7000,gems:2}}
  ];

  NS.CASTLE_NAMES = ['Twig Roost','Bark Hall','Amber Keep','Crystal Canopy','Prism Spire','Grand Resonator'];
})(window.SwarmSong);
