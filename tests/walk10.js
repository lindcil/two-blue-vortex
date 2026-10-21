// À PIED (aucun téléport) : distance de marche entre le donneur de quête et chaque objectif, puis début de Ta voie joué au clavier.
const {chromium}=require('playwright-core');const LIM=1500;
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{window.PATHD=(ax,ay,bx,by)=>{const Wd=W*K10,Hd=H*K10,C=40,nx=Math.ceil(Wd/C),ny=Math.ceil(Hd/C);if(!window.__G){const G=new Uint8Array(nx*ny);for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const x=i*C+C/2,y=j*C+C/2;let s=y<340;for(const o of World.solids)if(x>o.x-10&&x<o.x+o.w+10&&y>o.y-10&&y<o.y+o.h+10){s=1;break}G[j*nx+i]=s?1:0}window.__G=G}
 const G=__G,D=new Int32Array(nx*ny).fill(-1),s=Math.floor(ay/C)*nx+Math.floor(ax/C),e=Math.floor(by/C)*nx+Math.floor(bx/C);D[s]=0;const Q=[s];let h=0;
 while(h<Q.length){const c=Q[h++];if(Math.abs(c%nx-e%nx)<=2&&Math.abs(((c/nx)|0)-((e/nx)|0))<=2)return D[c]*C;const i=c%nx,j=(c/nx)|0;for(const[d,ok]of[[1,i<nx-1],[-1,i>0],[nx,j<ny-1],[-nx,j>0]]){const n=c+d;if(ok&&D[n]<0&&!G[n]){D[n]=D[c]+1;Q.push(n)}}}return Infinity}});
// 1) jouer le début au clavier
await p.evaluate(()=>Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)}));
const talk=async()=>{for(let i=0;i<80;i++){const on=await p.evaluate(()=>{if(window.Scene&&Scene.on){Scene.skip=true;return 1}if(Talk.on){Talk.t=1;Talk.showing?Talk.pick(0):Talk.next();return 1}return 0});if(!on)return;await p.waitForTimeout(60)}};
for(let i=0;i<40&&await p.evaluate(()=>Voie.step)!=='a1';i++){await talk();await p.evaluate(()=>{if(Voie.step==='birth'&&Voie.talkIruka)Voie.talkIruka()});await p.waitForTimeout(150)}
const st=await p.evaluate(()=>{const h=Game.hero,t=Story.target();return {step:Voie.step,h:[h.x|0,h.y|0],t:t&&t.map(v=>v|0),walk:t?PATHD(h.x,h.y,t[0],t[1]):null}});console.log('début',JSON.stringify(st));
const fails=[];if(!st.t||st.walk>LIM)fails.push('a1 trop loin à pied: '+st.walk);
const press=async(k,on)=>on?p.keyboard.down(k):p.keyboard.up(k);let held={};const t0=Date.now();let reached=false;
while(Date.now()-t0<15000){const s=await p.evaluate(()=>{const h=Game.hero,t=Story.target();return t?[t[0]-h.x,t[1]-h.y,Voie.step,Voie.lesson]:null});if(!s)break;if(s[2]!=='a1'){reached=true;break}const d=Math.hypot(s[0],s[1]);
 const want={ArrowRight:s[0]>40,ArrowLeft:s[0]<-40,ArrowDown:s[1]>30,ArrowUp:s[1]<-30};if(d<90){for(const k in want)want[k]=false;await p.keyboard.press('KeyJ')}
 for(const k in want)if(!!held[k]!==want[k]){await press(k,want[k]);held[k]=want[k]}await talk();await p.waitForTimeout(80)}
for(const k in held)if(held[k])await press(k,false);
const a1=await p.evaluate(()=>[Voie.step,Voie.lesson]);console.log('leçon 1 au clavier',(Date.now()-t0)+'ms',a1);if(a1[0]==='a1'&&a1[1]<3)fails.push('leçon 1 non jouable à pied ('+a1[1]+' coups)');
// 2) distances de marche donneur → objectif
const L=await p.evaluate(()=>{const o=[];const V=Voie,ir=[V.iruka.x,V.iruka.y],desk=[V.desk.x,V.desk.y];const tg=(s)=>{V.step=s;V.mis=null;return V.target()};
 V.yard();for(const s of ['a1','a2','a3','a4','a5']){const t=tg(s);if(t)o.push(['voie '+s,PATHD(ir[0],ir[1],t[0],t[1]),'Iruka',1])}
 V.step='free';V.rank='jonin';for(const id of Object.keys(MISSIONS)){V.items=[];World.foes_=World.foes_.filter(f=>f.tag!=='mis');V.mis=Object.assign({id},MISSIONS[id]);V.setupMission(V.mis,false);const t=V.target();if(t)o.push(['mission '+id,PATHD(desk[0],desk[1],t[0],t[1]),'bureau',0])}V.mis=null;
 Game.start(true);const H=Histoire,sp=[Game.hero.x,Game.hero.y];H.step='p0';const t=H.target();o.push(['histoire p0',PATHD(sp[0],sp[1],t[0],t[1]),'départ',1]);return o});
for(const [k,d,from,local] of L){const tag=d>LIM?(local?'TROP LOIN':'loin (flèche + repère)'):'ok';console.log(k.padEnd(20),String(Math.round(d)).padStart(6),'px depuis',from,tag);if(d===null||!isFinite(d)||(local&&d>LIM))fails.push(k+' '+d)}
console.log('FAILS',fails);console.log('errs',errs.length,errs.slice(0,3));await b.close();process.exit(fails.length||errs.length?1:0)})();
