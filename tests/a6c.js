const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(window.Scene&&Scene.on)Scene.close();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(5000);
const r=await p.evaluate(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));ZONE8.exit({instant:true});await W8(300);Voie.set('a5');Voie.talkIruka();let S;for(let k=0;k<40&&!(S=World.foes_.find(f=>f.tag==='sensei'));k++)await W8(250);
 const out={rooms:Object.keys(ZONE8.ROOMS)};
 // A: invalid HP, long wait
 out.pos=[Math.round(Game.hero.x),Math.round(Game.hero.y),Math.round(S.x),Math.round(S.y),ZONE8.sec&&ZONE8.sec.n,ZONE8.room&&ZONE8.room.id,ZONE8.inside(S),ZONE8.inside(Game.hero),Game.paused,Game.state];out.pre=World.foes().filter(f=>f.tag==="sensei").length;S.x+=5000;await W8(1200);out.moved=World.foes().filter(f=>f.tag==="sensei").length;S.hp=NaN;out.tr=[];for(let i=0;i<8;i++){await W8(500);out.tr.push([String(S.hp),S.maxHp,Voie.se10T&&+Voie.se10T.toFixed(2),Talk.on,Voie.step,Voie.lesson,World.foes_.includes(S)])}out.nan=World.foes().filter(f=>f.tag==='sensei').length;
 // B: room trip
 const before=World.foes().filter(f=>f.tag==='sensei').length;ZONE8.enter(out.rooms[0],{instant:true});await W8(3000);ZONE8.exit({instant:true});await W8(300);out.room=[before,World.foes_.filter(f=>f.tag==='sensei').length];await W8(3000);out.roomAfter=World.foes().filter(f=>f.tag==='sensei').length;out.step=Voie.step;out.S=[String(S.hp),S.gone,World.foes_.filter(f=>f.tag==='sensei').map(f=>[f===S,String(f.hp),f.gone])];out.fs=World.foes.toString().slice(0,300);return out});
console.log(JSON.stringify(r),errs);await b.close()})();
