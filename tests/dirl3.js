const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/look/jeu3-';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','bunshin']});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(2500);
await p.evaluate(()=>{clearInterval(window.__au);Talk.on=false;Game.cine=false;Game.paused=false;const e=document.getElementById('crea8');if(e)e.style.display='none';World.foes_=[];SMOOTH10.manual=true;window.STEPN=(n)=>{for(let i=0;i<n;i++)Game.update(1/60);Game.render()}});
const clip={x:565,y:250,width:150,height:170};
for(const [n,keys] of [['haut',['ArrowUp']],['bas',['ArrowDown']],['droite',['ArrowRight']],['haut-droite',['ArrowUp','ArrowRight']],['bas-gauche',['ArrowDown','ArrowLeft']],['haut-gauche',['ArrowUp','ArrowLeft']]]){
 for(const k of keys)await p.keyboard.down(k);await p.evaluate(()=>STEPN(30));for(const k of keys)await p.keyboard.up(k);const hd=await p.evaluate(()=>{STEPN(1);return [Game.hero.hd.toFixed(2),Math.round(Game.hero.vx),Math.round(Game.hero.vy)]});console.log(n,hd);await p.screenshot({path:SH+'heros-'+n+'.png',clip})}
// attaque vers le haut
await p.keyboard.down('ArrowUp');await p.evaluate(()=>{STEPN(10);startM1(Game.hero,0);STEPN(6)});await p.keyboard.up('ArrowUp');await p.screenshot({path:SH+'attaque-haut.png',clip});console.log('m1 a',await p.evaluate(()=>Game.hero.act&&Game.hero.act.a&&Game.hero.act.a.toFixed(2)));
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
