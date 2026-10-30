/* Séance sound effects: synthesized with the Web Audio API (no audio files needed) */
let actx=null,soundOn=true;
function A(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();return actx}
function bell(f,dur,vol,delay=0){const c=A(),t=c.currentTime+delay;[1,2.76,5.4,8.93].forEach((m,i)=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f*m;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol/(i+1.5),t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur/(i+1));o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur)})}
function whisper(dur){const c=A(),t=c.currentTime,n=c.sampleRate*dur,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type="bandpass";f.frequency.setValueAtTime(1800,t);f.frequency.linearRampToValueAtTime(900,t+dur);f.Q.value=2.5;
 const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);s.connect(f).connect(g).connect(c.destination);s.start(t)}
function sfx(k){if(!soundOn)return;try{
 if(k==="Sighting")bell(262,3,.3);
 else if(k==="Disappearance")bell(110,4.5,.45);
 else if(k==="Warning")bell(330,2.5,.3,0),bell(330,2.5,.2,.25);
 else if(k==="whisper"){whisper(1.6);bell(196,3.5,.3,1.3)}
 else if(k==="raise")[392,494,587,784].forEach((f,i)=>bell(f,2,.18,i*.14));
 else if(k==="lower")bell(82,2.5,.5);
 }catch(e){}}
const LOC={
 "Chanderi Fort":[300,92],"Koshak Mahal":[465,150],"Badal Mahal Gateway":[180,172],
 "Jama Masjid":[300,240],"Katti Ghati":[110,312],"Baradari Stepwell":[440,322],"Weavers’ Lane":[250,342]};
const COL={Sighting:"#e8d9b5",Disappearance:"#c0283a",Warning:"#d98a2b"};
let data=[
 {loc:"Baradari Stepwell",type:"Sighting",title:"A woman in crimson by the water",text:"Three weavers saw her at the stepwell near midnight. She stood still and did not cast a reflection.",when:"Dusk, 14 Oct"},
 {loc:"Katti Ghati",type:"Disappearance",title:"Cloth merchant not returned",text:"Last seen walking toward the gorge after the festival. His lantern was found, still burning.",when:"Midnight, 18 Oct"},
 {loc:"Weavers’ Lane",type:"Warning",title:"Doors unmarked on the east side",text:"Eleven houses lacked the protective inscription. Residents are urged to repaint before nightfall.",when:"Dawn, 21 Oct"},
 {loc:"Jama Masjid",type:"Sighting",title:"Jasmine scent, no flowers",text:"A heavy perfume of jasmine drifted through the courtyard at the third hour. A name was called twice.",when:"3 a.m., 24 Oct"},
 {loc:"Chanderi Fort",type:"Disappearance",title:"Watchman’s post found empty",text:"The night watchman vanished mid-round. His whistle lay upon the rampart, wrapped in a red thread.",when:"Midnight, 27 Oct"},
 {loc:"Badal Mahal Gateway",type:"Warning",title:"Do not walk alone beneath the gate",text:"Footsteps follow a single walker, yet vanish when the walker turns. Travel in pairs.",when:"Dusk, 29 Oct"}
];
let filter="all",sel=null,warded=false;
const $=id=>document.getElementById(id), NS="http://www.w3.org/2000/svg";
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function shape(t,x,y){
 if(t==="Sighting")return `<circle cx="${x}" cy="${y}" r="7" fill="${COL[t]}" stroke="#120d0f" stroke-width="2"/>`;
 if(t==="Warning")return `<path d="M${x} ${y-9}L${x+9} ${y+7}L${x-9} ${y+7}Z" fill="${COL[t]}" stroke="#120d0f" stroke-width="2"/>`;
 return `<path d="M${x-7} ${y-7}L${x+7} ${y+7}M${x+7} ${y-7}L${x-7} ${y+7}" stroke="${COL[t]}" stroke-width="5" stroke-linecap="round"/>`;
}
function vis(){return data.map((d,i)=>({...d,i})).filter(d=>filter==="all"||d.type===filter)}
function render(){
 const v=vis();
 $("labels").innerHTML=Object.entries(LOC).map(([n,[x,y]])=>`<text x="${x}" y="${y+26}" text-anchor="middle">${esc(n)}</text>`).join("");
 const seen={};
 $("pins").innerHTML=v.map(d=>{
  const [bx,by]=LOC[d.loc]; const k=seen[d.loc]=(seen[d.loc]||0)+1;
  const x=bx+(k-1)*20-((k>1)?0:0), y=by;
  return `<g class="pin${sel===d.i?" sel":""}" tabindex="0" role="button" aria-label="${esc(d.title)}" data-i="${d.i}"><circle class="halo" cx="${x}" cy="${y}" r="15" fill="none" stroke="${COL[d.type]}" stroke-width="1.5" stroke-dasharray="3 3"/>${shape(d.type,x,y)}</g>`;
 }).join("");
 $("timeline").innerHTML=v.slice().reverse().map(d=>`<li data-i="${d.i}" class="${sel===d.i?"sel":""}" style="--c:${COL[d.type]}" tabindex="0"><div class="when">${esc(d.when)} · ${esc(d.type)}</div><div class="t">${esc(d.title)}</div><p>${esc(d.loc)}</p></li>`).join("")||"<li>No entries match this filter.</li>";
 $("wards").innerHTML=warded?Object.values(LOC).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="30" fill="rgba(217,138,43,.12)" stroke="#d98a2b" stroke-width="1.5" stroke-dasharray="4 4"/><path d="M${x} ${y-32}v-16l13 4-13 5" fill="#d98a2b" stroke="#d98a2b"/>`).join(""):"";
 $("cTotal").textContent=data.length;
 const miss=data.filter(d=>d.type==="Disappearance").length;
 $("cMissing").textContent=miss;
 const score=Math.max(0,miss*3+data.filter(d=>d.type==="Sighting").length-(warded?5:0));
 const L=$("level"); const lv=score>=12?["DIRE","#c0283a"]:score>=7?["GRAVE","#d98a2b"]:["WARY","#c9a24b"];
 L.textContent=lv[0]+(warded?" · WARDED":"");L.style.color=lv[1];
 if(sel!==null&&data[sel]){const d=data[sel];$("detail").innerHTML=`<b>${esc(d.title)}</b><br>${esc(d.loc)} · ${esc(d.when)} · ${esc(d.type)}<br>${esc(d.text)}`}
}
function pick(e){const t=e.target.closest("[data-i]");if(!t)return;sel=+t.dataset.i;sfx(data[sel].type);render()}
$("map").addEventListener("click",pick);$("timeline").addEventListener("click",pick);
["map","timeline"].forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(e)}}));
$("filters").addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;filter=b.dataset.f;
 document.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",c===b));render()});
$("fLoc").innerHTML=Object.keys(LOC).map(n=>`<option>${esc(n)}</option>`).join("");
$("form").addEventListener("submit",e=>{e.preventDefault();
 const now=new Date();const when=now.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"})+", "+now.toLocaleDateString("en-IN",{day:"numeric",month:"short"});
 data.push({loc:$("fLoc").value,type:$("fType").value,title:$("fTitle").value.trim(),text:$("fText").value.trim(),when});
 sel=data.length-1;sfx("whisper");filter="all";document.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",c.dataset.f==="all"));
 e.target.reset();render();$("map").scrollIntoView({behavior:"smooth",block:"center"})});
render();
$("raise").addEventListener("click",e=>{warded=!warded;e.target.setAttribute("aria-pressed",warded);e.target.textContent=warded?"Lower the Banner":"Raise the Banner";sfx(warded?"raise":"lower");render();if(warded)$("map").scrollIntoView({behavior:"smooth",block:"center"})});
render();

$("snd").addEventListener("click",e=>{soundOn=!soundOn;e.target.setAttribute("aria-pressed",soundOn);e.target.textContent=soundOn?"🔔 Séance Sound: On":"🔕 Séance Sound: Off";if(soundOn)bell(262,2,.25)});
