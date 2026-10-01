// ---- Theme toggle ----
const root=document.documentElement;
function setTheme(t){root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}
 Chart.defaults.color=getComputedStyle(root).getPropertyValue('--tx').trim();Chart.defaults.borderColor='rgba(128,128,128,.25)';
 if(window.__ready)draw()}
let t0;try{t0=localStorage.getItem('theme')}catch(e){}
setTheme(t0||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
document.getElementById('th').onclick=()=>setTheme(root.dataset.theme==='dark'?'light':'dark');
// ---- Dashboard ----
const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],COL=['#1f6feb','#e8702a','#7a1fa2','#2da44e','#d4a72c','#cf222e','#6e7781'];
const $=n=>'$'+Math.round(n).toLocaleString('en-US'),K=n=>'$'+(n/1000).toFixed(1)+'K';
const st={p:'All',e:'All',mf:1,mt:12};let ch={};
const U=(a,i)=>[...new Set(a.map(r=>r[i]))].sort();
function fill(id,vals){const s=document.getElementById(id);s.innerHTML='<option>All</option>'+vals.map(v=>'<option>'+v+'</option>').join('');s.onchange=()=>{st[id]=s.value;draw()}}
fill('p',U(B,1));fill('e',U(B,2));
for(const id of['mf','mt']){const s=document.getElementById(id);s.innerHTML=M.map((m,i)=>'<option value="'+(i+1)+'">'+m+'</option>').join('');s.value=id=='mf'?1:12;s.onchange=()=>{st[id]=+s.value;if(st.mf>st.mt){if(id=='mf'){st.mt=st.mf;mt.value=st.mt}else{st.mf=st.mt;mf.value=st.mf}}draw()}}
document.getElementById('r').onclick=()=>{st.p=st.e='All';st.mf=1;st.mt=12;p.value=e.value='All';mf.value=1;mt.value=12;draw()};
const ok=(r,pi,ei)=>(st.p=='All'||r[pi]==st.p)&&(st.e=='All'||r[ei]==st.e)&&r[0]>=st.mf&&r[0]<=st.mt;
function sumBy(rows,ki,vi){const o={};rows.forEach(r=>o[r[ki]]=(o[r[ki]]||0)+r[vi]);return Object.entries(o).sort((a,b)=>b[1]-a[1])}
function mk(id,cfg){if(ch[id])ch[id].destroy();cfg.options=Object.assign({responsive:true,maintainAspectRatio:false},cfg.options||{});ch[id]=new Chart(document.getElementById(id),cfg)}
function draw(){
 const a=A.filter(r=>ok(r,1,2)),dp=D.filter(r=>ok(r,1,2)),b=B.filter(r=>ok(r,1,2)),c=C.filter(r=>ok(r,1,2)),n=st.mt-st.mf+1,ML=M.slice(st.mf-1,st.mt);
 const mc=ML.map((_,i)=>a.filter(r=>r[0]==st.mf+i).reduce((s,r)=>s+r[3],0));
 const tot=mc.reduce((s,x)=>s+x,0),bud=tot*1.05,over=mc.filter(x=>x>bud/n).length;
 const sav=a.reduce((s,r)=>s+r[4],0),hr=a.reduce((s,r)=>s+r[5],0);
 const kp=[['Total Net Cost',$(tot)],['Total Savings',$(sav)],['Derived Budget',$(bud)],['Budget Utilization',(tot/bud*100).toFixed(1)+'%'],['Months Over Budget',over+' of '+n],['High-Risk Days',hr]];
 document.getElementById('kpis').innerHTML=kp.map(x=>'<div class="card"><div class="k">'+x[0]+'</div><div class="v">'+x[1]+'</div></div>').join('');
 mk('c1',{data:{labels:ML,datasets:[{type:'bar',label:'Net cost',data:mc,backgroundColor:COL[0]},{type:'line',label:'Derived budget',data:mc.map(()=>bud/n),borderColor:COL[1],pointRadius:0,borderWidth:2}]},options:{scales:{y:{ticks:{callback:K}}}}});
 const pr=sumBy(b,1,4);mk('c2',{type:'bar',data:{labels:pr.map(x=>x[0]),datasets:[{data:pr.map(x=>x[1]),backgroundColor:COL}]},options:{plugins:{legend:{display:false}},scales:{y:{ticks:{callback:K}}}}});
 const ev=sumBy(b,2,4);mk('c3',{type:'doughnut',data:{labels:ev.map(x=>x[0]),datasets:[{data:ev.map(x=>x[1]),backgroundColor:COL}]},options:{plugins:{tooltip:{callbacks:{label:t=>t.label+': '+$(t.raw)}}}}});
 const sv=sumBy(b,3,4);mk('c4',{type:'bar',data:{labels:sv.map(x=>x[0]),datasets:[{data:sv.map(x=>x[1]),backgroundColor:COL[0]}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:K}}}}});
 const rg=sumBy(c,3,4);mk('c5',{type:'bar',data:{labels:rg.map(x=>x[0]),datasets:[{data:rg.map(x=>x[1]),backgroundColor:COL[2]}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:K}}}}});
 renderTable(dp,tot);
 const pk=mc.indexOf(Math.max(...mc));
 document.getElementById('ins').innerHTML=['Top service: <b>'+sv[0][0]+'</b> ('+$(sv[0][1])+'); top region: <b>'+rg[0][0]+'</b>.','Top environment: <b>'+ev[0][0]+'</b> at '+(ev[0][1]/tot*100).toFixed(0)+'% of spend.','Peak month: <b>'+ML[pk]+'</b> ('+$(mc[pk])+').','Savings of '+$(sav)+' come from reserved instances, savings plans and spot usage.','High-risk days (anomaly score above 0.6): <b>'+hr+'</b>.'].map(t=>'<li>'+t+'</li>').join('');
}

// ---- Project table: search, sort, export ----
let sk='c',sd=-1,q='',tr=[];
function renderTable(d,tot){
 const o={};d.forEach(r=>{const x=o[r[3]]||(o[r[3]]={p:r[3],c:0,h:0});x.c+=r[4];x.h+=r[5]});
 tr=Object.values(o).filter(x=>x.p.toLowerCase().includes(q)).sort((a,b)=>(a[sk]>b[sk]?1:-1)*sd);
 document.getElementById('tb').innerHTML=tr.map(x=>'<tr><td>'+x.p+'</td><td class="n">'+$(x.c)+'</td><td class="n">'+(tot?(x.c/tot*100).toFixed(1):0)+'%</td><td class="n">'+x.h+'</td></tr>').join('')||'<tr><td colspan="4">No matches</td></tr>';
}
document.querySelectorAll('th[data-k]').forEach(th=>th.onclick=()=>{const k=th.dataset.k;sd=sk==k?-sd:-1;sk=k;draw()});
document.getElementById('q').oninput=e=>{q=e.target.value.toLowerCase();draw()};
document.getElementById('ex').onclick=()=>{const csv='project,net_cost,high_risk_days\n'+tr.map(x=>[x.p,x.c,x.h].join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='projects.csv';a.click()};
window.__ready=true;draw();
