// Side-by-side FPS: alternates old (v0.10.35) and new builds, 3 runs each, reports medians + delta.
const {execFileSync}=require('child_process');const NEW='file:///workspace/two-blue-vortex/index.html',OLD='file:///tmp/old/index.html';
const run=(u)=>{const o=execFileSync('node',['/tmp/pw/fpsold.js','r'],{env:{...process.env,U:u}}).toString();const m=o.match(/r (\{.*\}) errs (\d+)/);return {...JSON.parse(m[1]),errs:+m[2]}};
const R={old:[],new:[]};const N=+(process.env.N||5);for(let i=0;i<N;i++){if(i%2){R.new.push(run(NEW));R.old.push(run(OLD))}else{R.old.push(run(OLD));R.new.push(run(NEW))}}
const med=(a,k)=>{const v=a.map(x=>x[k]).sort((x,y)=>x-y);return v[v.length>>1]};const out={};for(const k of ['fps','update_ms','render_ms','frame_ms','worst_ms'])out[k]={old:med(R.old,k),new:med(R.new,k),delta:+(med(R.new,k)-med(R.old,k)).toFixed(2)};
console.log(JSON.stringify(out));const e=R.new.reduce((s,x)=>s+x.errs,0);console.log('newErrs',e);
const bad=out.frame_ms.delta>Math.max(1.5,out.frame_ms.old*0.1);console.log("runs old",JSON.stringify(R.old.map(x=>x.frame_ms)),"new",JSON.stringify(R.new.map(x=>x.frame_ms)));console.log(bad?'FPS CHECK FAILED':'FPS CHECK OK');process.exit(bad||e?1:0);
