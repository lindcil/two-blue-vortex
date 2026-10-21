// Marche réelle (collisions) : bureau → objectif, et porte → camp pour les missions hors murs. Échoue si bloqué ou > 2,6 k px.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
const r=await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});const V=Voie,h=Game.hero,out=[];V.step='free';V.rank='jonin';
 const walk=(pts)=>{let d=0;for(const [tx,ty] of pts){for(let i=0;i<3000;i++){const dx=tx-h.x,dy=ty-h.y,L=Math.hypot(dx,dy);if(L<60)break;const ox=h.x,oy=h.y;h.x+=dx/L*12;h.y+=dy/L*12;World.collide(h);const m=Math.hypot(h.x-ox,h.y-oy);d+=m;if(m<1){h.x+=-dy/L*12;h.y+=dx/L*12;World.collide(h)}}if(Math.hypot(tx-h.x,ty-h.y)>=60)return -d}return d};
 for(const id of Object.keys(MISSIONS)){V.items=[];World.foes_=World.foes_.filter(f=>f.tag!=='mis');const m=V.mis=Object.assign({id},MISSIONS[id]);V.setupMission(m,false);
  const outW=m.r!=='D'&&id!=='kara';const s=outW?[K10*1600,K10*(WALL_Y-140)]:[V.desk.x,V.desk.y+40];h.x=s[0];h.y=s[1];
  const t=id==='chat'?[V.cat.x,V.cat.y]:V.items[0]?[V.items[V.items.length-1].x,V.items[V.items.length-1].y]:[m.tx,m.ty];
  const pts=outW?[[K10*1600,K10*(WALL_Y+120)],t]:[t];const d=walk(pts);out.push([id,outW?'porte':'bureau',Math.round(d)]);V.mis=null}
 return out});
let bad=0;for(const [id,f,d] of r){const ko=d<0||d>2600;bad+=ko;console.log((ko?'KO ':'ok ')+id+' depuis '+f+' : '+Math.abs(d)+' px'+(d<0?' (bloqué)':''))}
console.log('errs',errs.length,errs.slice(0,3),'bad',bad);await b.close();process.exit(bad?1:0)})();
