// Audit : chaque objectif de quête (Histoire, Ta voie, missions, quêtes du jour) est dans le monde, hors obstacle, dans une section, et atteignable à pied.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
const AUD=()=>{const Wd=W*K10,Hd=H*K10,C=40,nx=Math.ceil(Wd/C),ny=Math.ceil(Hd/C);
 const solid=(x,y)=>{for(const s of World.solids)if(x>s.x-10&&x<s.x+s.w+10&&y>s.y-10&&y<s.y+s.h+10)return 1;return 0};
 const G=new Uint8Array(nx*ny);for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)G[j*nx+i]=solid(i*C+C/2,j*C+C/2)||j*C<340?1:0;
 const h=Game.hero,R=new Uint8Array(nx*ny),Q=[];const s0=Math.floor(h.y/C)*nx+Math.floor(h.x/C);R[s0]=1;Q.push(s0);
 while(Q.length){const c=Q.pop(),i=c%nx,j=(c/nx)|0;for(const[d,ok]of[[1,i<nx-1],[-1,i>0],[nx,j<ny-1],[-nx,j>0]]){const n=c+d;if(ok&&!R[n]&&!G[n]){R[n]=1;Q.push(n)}}}
 return (x,y)=>{if(!isFinite(x)||!isFinite(y))return 'NaN';if(x>=20000)return 'room';if(x<0||y<0||x>Wd||y>Hd)return 'hors-monde';
  const i=Math.floor(x/C),j=Math.floor(y/C);let ok=0;for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const n=(j+b)*nx+i+a;if(n>=0&&n<R.length&&R[n])ok=1}
  if(!ok)return 'inatteignable';const Z=window.ZONE8;if(Z&&!Z.SECS.some(s=>x>=s.x&&x<s.x+s.w&&y>=s.y&&y<s.y+s.h))return 'hors-section';return null}};
const out=await p.evaluate(`(()=>{const AUD=${AUD.toString()};const bad=[],seen=[];
 const chk=(mode,k,t)=>{if(!t)return;seen.push(mode+':'+k);let r=A(t[0],t[1]);if(!r&&Number.isInteger(t[0])&&Number.isInteger(t[1])&&t[0]<3400&&t[1]<3400&&t[0]>=300)r='non-agrandi?';if(r&&r!=='room')bad.push([mode,k,r,t[0],t[1]])};
 Game.start(true);let A=AUD();const H0=Histoire;const steps=Object.keys(H0.obj.call(Object.assign(Object.create(H0),{step:'zz'}))||{});
 for(const s of ['p0','p1','p2','p3','c0','c1','c2','c3','k0','k1','k2','k3']){H0.step=s;H0.flags={};chk('histoire',s,H0.target());if(s==='c1'){H0.flags.z1=1;chk('histoire','c1b',H0.target())}}
 if(Game.jura)chk('histoire','jura',[Game.jura.x,Game.jura.y]);for(const it of H0.items||[])chk('histoire','item-'+it.id,[it.x,it.y]);for(const n of World.npcs||[])chk('npc',n.id||n.n,[n.x,n.y]);
 Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});A=AUD();const V=Voie;
 for(const s of ['a1','a2','a3','a4','a5','a6','r1','x1','x3','j1','w1','free']){V.step=s;V.mis=null;chk('voie',s,V.target())}
 V.step='free';V.rank='jonin';for(const id of Object.keys(MISSIONS)){V.items=[];World.foes_=World.foes_.filter(f=>f.tag!=='mis');V.mis=Object.assign({id},MISSIONS[id]);V.setupMission(V.mis,false);chk('mission',id,V.target());for(const it of V.items)chk('mission',id+'-'+it.id,[it.x,it.y]);for(const f of World.foes_.filter(f=>f.tag==='mis'))chk('mission',id+'-ennemi',[f.x,f.y]);if(V.cat)chk('mission','chat',[V.cat.x,V.cat.y]);}
 const T=window.TRAIN9;const dq=window.DQ9&&DQ9.load();
 return {bad,n:seen.length,dq:dq&&dq.q.map(q=>q.id),st:T&&T.ST.map(s=>s[0])}})()`);
console.log(JSON.stringify(out.bad,null,0));console.log('checked',out.n,'dq',out.dq,'stations',out.st&&out.st.length);console.log('errs',errs.length,errs.slice(0,4));await b.close();process.exit(out.bad.length||errs.length?1:0)})();
