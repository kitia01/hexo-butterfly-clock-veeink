const DEBUG_MODE=false;
function debugLog(){DEBUG_MODE&&console.log.apply(console,arguments)}

function clockUpdateTime(e,t,o="Asia/Shanghai"){
const c=document.getElementById("hexo_electric_clock");
if(!c)return;
let n="#000";
switch(e.now.icon){
case"100":n="#fdcc45";break;
case"101":n="#fe6976";break;
case"102":case"103":n="#fe7f5b";break;
case"104":case"150":case"151":case"152":case"153":case"154":
case"800":case"801":case"802":case"803":case"804":case"805":
case"806":case"807":n="#2152d1";break;
case"300":case"301":case"305":case"306":case"307":case"308":
case"309":case"310":case"311":case"312":case"313":case"314":
case"315":case"316":case"317":case"318":case"350":case"351":
case"399":n="#49b1f5";break;
case"302":case"303":case"304":n="#fdcc46";break;
case"400":case"401":case"402":case"403":case"404":case"405":
case"406":case"407":case"408":case"409":case"410":
case"456":case"457":case"499":n="#a3c2dc";break;
case"500":case"501":case"502":case"503":case"504":case"507":
case"508":case"509":case"510":case"511":case"512":case"513":
case"514":case"515":n="#97acba";break;
case"900":case"999":n="red";break;
case"901":n="#179fff";
}

c.innerHTML=
`<div class="clock-row">
<span id="card-clock-clockdate"></span>
<span class="card-clock-weather">
<i class="qi-${e.now.icon}-fill" style="color:${n}"></i>
${e.now.text} <span>${e.now.temp}</span> ℃
</span>
<span class="card-clock-humidity">💧 ${e.now.humidity}%</span>
</div>
<div class="clock-row">
<span id="card-clock-time"></span>
</div>
<div class="clock-row">
<span><i class="qi-gale"></i> ${e.now.windDir}</span>
<span>${t}</span>
<span id="card-clock-dackorlight"></span>
</div>`;

const r=["SUN","MON","TUE","WED","THU","FRI","SAT"];
const i=(e,t)=>("0".repeat(t)+e).slice(-t);

function l(){
const e=new Date;
const t=new Date(e.toLocaleString("en-US",{timeZone:o,hour12:false}));
document.getElementById("card-clock-time").innerHTML=
i(t.getHours(),2)+":"+i(t.getMinutes(),2)+":"+i(t.getSeconds(),2);
document.getElementById("card-clock-clockdate").innerHTML=
`${t.getFullYear()}-${i(t.getMonth()+1,2)}-${i(t.getDate(),2)} ${r[t.getDay()]}`;
document.getElementById("card-clock-dackorlight").innerHTML=
t.getHours()>12?" P M":" A M"
}
setInterval(l,1e3);l()
}

function getIpAndWeather(e=""){
const t=n=>{
const t=`${qweather_api_host}/geo/v2/city/lookup?location=${encodeURIComponent(n)}&key=${qweather_key}`;
fetch(t).then(e=>e.json()).then(e=>{
const t=e.location&&e.location[0];
if(!t)throw new Error("no location");
const o=t.tz||"Asia/Shanghai";
return fetch(`${qweather_api_host}/v7/weather/now?location=${t.id}&key=${qweather_key}`)
.then(e=>e.json())
.then(e=>clockUpdateTime(e,n,o))
})
};
e&&e.trim()?t(e):
fetch(`https://restapi.amap.com/v3/ip?key=${gaud_map_key}`)
.then(e=>e.json())
.then(e=>t(e.city||e.province||"未知城市"))
}

/* 安全等待全局变量 */
(function wait(){
if(
typeof qweather_key!=="undefined" &&
typeof qweather_api_host!=="undefined" &&
typeof gaud_map_key!=="undefined"
){
getIpAndWeather(typeof default_city!=="undefined"?default_city:"")
}else{
setTimeout(wait,50)
}
})();
