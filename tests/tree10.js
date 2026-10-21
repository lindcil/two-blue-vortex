const {chromium}=require('playwright-core');const PFX=process.argv[2]||'after';const SH='/workspace/two-blue-vortex/screens/v10/tree/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' '+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),el:'fire'});window.__au=setInterval(()=>{const sk=document.getElementById('scnskip');if(sk&&sk.offsetParent)sk.click();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
await p.waitForTimeout(9000);await p.evaluate(()=>{clearInterval(window.__au);const m=Voie.me;Object.assign(m.tree,{nin:4,tai:6,gen:2,elem:5,ctrl:3,clan:1,body:7});m.pts=4;TREE8.check&&TREE8.check(true);UI.close&&UI.close();Game.cine=false;Game.paused=false;});
await p.waitForTimeout(500);await p.evaluate(()=>TREE8.UI.open());
for(const [n,ms] of [['1-zoom',150],['2-iris',230],['3-ouverture',220],['4-installe',300]]){await p.waitForTimeout(ms);await p.screenshot({path:SH+PFX+'-transition-'+n+'.png'});}
await p.waitForTimeout(800);await p.screenshot({path:SH+PFX+'-arbre.png'});
if(PFX==='after'){const pos=await p.evaluate(()=>{const U=TREE10UI,c=U.cam;const n=U.nodes.find(n=>n.b.id==='nin'&&n.i===Voie.me.tree.nin);return [innerWidth/2+(n.x-c.x)*c.z,innerHeight/2+(n.y-c.y)*c.z]});
 await p.mouse.move(pos[0],pos[1]);await p.waitForTimeout(300);await p.screenshot({path:SH+PFX+'-survol.png'});
 const before=await p.evaluate(()=>Voie.me.tree.nin);await p.mouse.click(pos[0],pos[1]);await p.waitForTimeout(220);await p.screenshot({path:SH+PFX+'-deblocage.png'});const after=await p.evaluate(()=>Voie.me.tree.nin);console.log('invest',before,'->',after);
 await p.mouse.move(640,360);for(let i=0;i<4;i++){await p.mouse.wheel(0,-240);await p.waitForTimeout(60);}await p.waitForTimeout(500);await p.screenshot({path:SH+PFX+'-zoom.png'});
 await p.mouse.move(640,360);await p.mouse.down();await p.mouse.move(400,300,{steps:8});await p.mouse.up();await p.waitForTimeout(400);await p.screenshot({path:SH+PFX+'-deplacement.png'});
 await p.keyboard.press('Escape');await p.waitForTimeout(200);await p.screenshot({path:SH+PFX+'-fermeture.png'});await p.waitForTimeout(600);console.log('closed',await p.evaluate(()=>[TREE8.UI.on,Game.paused,getComputedStyle(document.getElementById('tree10')).display]));}
console.log(PFX,'errs',errs.length,errs.slice(0,4));await b.close()})();
