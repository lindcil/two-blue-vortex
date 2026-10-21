const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/look/';const PFX=process.argv[2]||'apres';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});});await p.waitForTimeout(800);
const mk=(code)=>p.evaluate(code);
// planche visages : personnages × expressions (gros plan)
const a=await mk(`(()=>{const ids=['boruto','sarada','kawaki','himawari','code','jura',${"'naruto','sasuke','mitsuki'"}].filter(k=>LOOKS[k]);const ex=[['neutre',{}],['colère',{combat:1}],['cri',{act:{k:'m1',t:0.05,dur:0.3,n:0}}],['blessé',{flash:0.2}],['sharingan',{eyeFx:'#d0283a'}]];
 const c=document.createElement('canvas');c.width=ex.length*150;c.height=ids.length*150;const g=c.getContext('2d');g.fillStyle='#1b2238';g.fillRect(0,0,c.width,c.height);
 ids.forEach((id,i)=>ex.forEach(([n,o],j)=>{const u=Object.assign({isHero:1,x:0,y:0,look:id,face:1,vx:0,vy:0,anim:1,r:12,st:{},hd:0.6},o);g.save();g.beginPath();g.rect(j*150,i*150,150,150);g.clip();g.translate(j*150+70,i*150+350);g.scale(2.7,2.7);try{drawRig(g,u)}catch(e){console.error(e.message)}g.restore();g.fillStyle='#93a3c6';g.font='12px sans-serif';g.fillStyle='rgba(11,16,32,.75)';g.fillRect(j*150,i*150+132,150,18);g.fillStyle='#cfd8ee';g.fillText(id+' · '+n,j*150+6,i*150+145)}));
 const d=document.createElement('canvas');d.width=8*130;d.height=2*190;const h=d.getContext('2d');h.fillStyle='#1b2238';h.fillRect(0,0,d.width,d.height);
 ['boruto','sarada'].forEach((id,i)=>{for(let k=0;k<8;k++){const hd=k*Math.PI/4;const u={isHero:1,x:0,y:0,look:id,face:Math.cos(hd)<0?-1:1,vx:0,vy:0,anim:1,r:12,st:{},hd};h.save();h.translate(k*130+65,i*190+180);h.scale(1.25,1.25);drawRig(h,u);h.restore();h.fillStyle='#93a3c6';h.font='12px sans-serif';h.fillText(['→','↘','↓','↙','←','↖','↑','↗'][k],k*130+8,i*190+16)}});
 return [c.toDataURL(),d.toDataURL()]})()`);
const fs=require('fs');fs.writeFileSync(SH+PFX+'-visages.png',Buffer.from(a[0].split(',')[1],'base64'));fs.writeFileSync(SH+PFX+'-8directions.png',Buffer.from(a[1].split(',')[1],'base64'));
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
