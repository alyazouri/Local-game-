// JO-HARD-MODE PAC — v9.0 (Ultimate Network Enforcer - Pure JO)
// هدف: تطبيق الفحص الجغرافي الأردني على كل اتصال يغادر الجهاز لفرض "الأردني بيور".

//================== إعدادات عامة ومحترفة ==================//
// **هام:** أضف جميع البروكسيات الأردنية الموثوقة هنا
var PROXY_CANDIDATES = [
  "212.35.66.45"
];

// القائمة البيضاء الصارمة للبروكسيات (يجب أن تكون IPs أردنية)
var PROXY_WHITELIST = [
  "212.35.66.45"
];

var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80, // تم دمج UPDATE/CDN في LOBBY في اللوجيك، لكن نُبقي على البورتات
  CDN:              80
};

// **الوضع الصارم** - حظر كل الوجهات غير الأردنية 
var STRICT_BLOCK = true; 

// IPv6 Ranges - قائمة شاملة
var JO_V6_PREFIX_LIST = [
  "2a02:420:1000::/48", "2a02:420:5000::/48", "2a02:8280:3000::/48",
  "2a02:8280:3100::/48", "2a02:8280:8000::/48", "2a02:2e04:5000::/48",
  "2001:678:3600::/48", "2001:678:2f00::/48", "2001:678:1e00::/48",
  "2001:678:2500::/48", "2a03:b640::/32", "2a03:6b00::/29", 
  "2a00:18d8::/29", "2a00:18d0::/29", "2a00:caa0::/32",
  "2001:32c0::/29", "2a00:4620::/32", "2a00:76e0::/32", 
  "2a00:b860::/32"
];

// IPv4 Ranges - قائمة شاملة
var JO_V4_RANGES = [
  ["217.25.0.0","217.25.255.255"], ["212.118.0.0","212.118.255.255"],
  ["212.35.0.0","212.35.255.255"], ["213.186.0.0","213.186.255.255"],
  ["213.187.0.0","213.187.255.255"], ["176.29.0.0","176.29.255.255"],
  ["87.236.0.0","87.236.255.255"], ["87.237.0.0","87.237.255.255"],
  ["94.142.0.0","94.142.255.255"], ["109.224.0.0","109.224.255.255"],
  ["37.236.0.0","37.236.255.255"], ["37.237.0.0","37.237.255.255"],
  ["46.23.0.0","46.23.255.255"], ["109.110.0.0","109.110.255.255"],
  ["81.28.0.0","81.28.255.255"], ["46.60.0.0","46.60.255.255"],
  ["46.185.0.0","46.185.255.255"], ["185.108.0.0","185.108.255.255"]
];


// TTLs & كاش (تم إبقاء الـ Sticky Proxy قصير لزيادة الثبات)
var DNS_TTL_MS = 15*1000;
var PROXY_STICKY_TTL_MS = 60*1000; 
var GEO_TTL_MS = 60*60*1000;

var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
C.dns = C.dns || {};
C.proxyPick = C.proxyPick || {host:null, t:0, lat:99999}; // كاش للوبي
C.proxyPickMatch = C.proxyPickMatch || {host:null, t:0, lat:99999}; // كاش خاص للماتش
C.geoClient = C.geoClient || {ok:false, t:0};
C.geoProxy  = C.geoProxy  || {ok:false, t:0};
C._JO_V6_CIDRS_ALL = C._JO_V6_CIDRS_ALL || null;
C._JO_V4I = C._JO_V4I || null;

//================== PUBG domains & URL patterns (كما في النسخة السابقة) ==================//
var PUBG_DOMAINS = {
  LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.edgesuite.net"]
};

var URL_PATTERNS = {
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

//================== أدوات مساعدة عامة / DNS / IP Matching (من v8.0) ==================//
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIp4(s){return /^\d+\.\d+\.\d+\.\d+$/.test(s);}
function isIp6Literal(s){return s&&s.indexOf(":")!==-1;}
function hostMatch(h,arr){/* ... Logic here ... */ h=lc(h||""); if(!h)return false; for(var i=0;i<arr.length;i++){ var pat=arr[i]; if(shExpMatch(h,pat))return true; if(pat.indexOf("*.")==0){ var suf=pat.substring(1); if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true; } } return false;}
function urlMatch(u,arr){/* ... Logic here ... */ if(!u)return false; for(var i=0;i<arr.length;i++){ if(shExpMatch(u,arr[i]))return true; } return false;}

function dnsCached(h){
  if(!h)return""; var now=(new Date()).getTime();
  var e=C.dns[h]; if(e&&(now-e.t)<DNS_TTL_MS) return e.ip;
  var ip="";
  try{
    if(typeof dnsResolveEx==="function"){
      var r=dnsResolveEx(h);
      if(r){ var parts; if(typeof r==="string") parts=r.split(/[;,]/); else if(r.length) parts=r;
        if(parts){ for(var i=0;i<parts.length;i++){ var a=(typeof parts[i]==="string") ? parts[i].trim() : parts[i]; if(!a) continue; if(isIp6Literal(a) || isIp4(a)){ip=a;break;} } }
      }
      if(!ip) ip=dnsResolve(h)||"";
    }else{ ip=dnsResolve(h)||""; }
  }catch(err){ip="";}
  C.dns[h]={ip:ip,t:now};
  return ip;
}

// IP V4/V6 Geo Checks - تم نقل الدوال المساعدة من v8.0 هنا
function ip4ToInt(ip){ var p=ip.split("."); return (((+p[0])<<24)>>>0) + (((+p[1])<<16)>>>0) + (((+p[2])<<8)>>>0) + ((+p[3])>>>0); }
function rangePair(a){return {s:ip4ToInt(a[0]), e:ip4ToInt(a[1])};}
function ensureJOv4Index(){
  if(C._JO_V4I) return; C._JO_V4I=[];
  for(var _i=0;_i<JO_V4_RANGES.length;_i++){ var pr=rangePair(JO_V4_RANGES[_i]); if(pr.s<=pr.e) C._JO_V4I.push(pr); }
}
function isJOv4(ip){
  if(!ip||!isIp4(ip)) return false; ensureJOv4Index(); var n=ip4ToInt(ip);
  for(var i=0;i<C._JO_V4I.length;i++){ var r=C._JO_V4I[i]; if(n>=r.s && n<=r.e) return true; } return false;
}
function pad4(h){return("0000"+h).slice(-4);}
function norm6(ip){/* ... Logic here ... */ if(!ip) return ""; ip=ip.toLowerCase(); if(ip.indexOf("::")==-1){ var parts=ip.split(":"); while(parts.length<8) parts.push("0"); return parts.map(pad4).join(":"); } var tmp = ip.split("::"); var left=tmp[0], right=tmp[1]; var L=left?left.split(":"):[], R=right?right.split(":"):[] ; var miss=8-(L.length+R.length), zeros=[]; for(var i=0;i<miss;i++) zeros.push("0"); return (L.concat(zeros).concat(R)).map(pad4).join(":"); }
function parseCidr6(s){s=s.replace(/:+$/,""); var m=s.split("/"); var pre=m[0]; var len=(m.length>1)?parseInt(m[1],10):64; return {norm:norm6(pre), len:len};}
function ip6ToBits(ip){ var parts=norm6(ip).split(":"); var bits=""; for(var i=0;i<8;i++){ var v=parseInt(parts[i],16); bits+=("0000000000000000"+v.toString(2)).slice(-16); } return bits; }
function match6(ip,cidr){if(!ip) return false; var b1=ip6ToBits(ip), b2=ip6ToBits(cidr.norm); var L=Math.max(0,Math.min(128,cidr.len|0)); return b1.substring(0,L)===b2.substring(0,L);}

function getJOCidrs6(){
  if(C._JO_V6_CIDRS_ALL) return C._JO_V6_CIDRS_ALL;
  var out = [];
  for(var i=0;i<JO_V6_PREFIX_LIST.length;i++){ out.push(parseCidr6(JO_V6_PREFIX_LIST[i])); }
  C._JO_V6_CIDRS_ALL = out;
  return out;
}

function isJOv6(ip){
  if(!ip || ip.indexOf(":")==-1) return false; var cidrs = getJOCidrs6();
  if(!cidrs.length) return false;
  for(var i=0;i<cidrs.length;i++){ if(match6(ip, cidrs[i])) return true; } return false;
}

function isJO(ip){
    if(!ip) return false;
    if(isIp4(ip)) return isJOv4(ip);
    if(isIp6Literal(ip)) return isJOv6(ip);
    return false;
}

//================== Proxy latency & selection (أصبحت مزدوجة) ==================//
function measureProxyLatency(h){
  if(isIp4(h) || isIp6Literal(h)) return 1;
  try{
    var t0=(new Date()).getTime();
    var r=dnsResolve(h);
    var dt=(new Date()).getTime()-t0;
    if(!r) return 99999;
    return dt>0?dt:1; 
  }catch(e){return 99999;}
}

// اختيار البروكسي لفئة LOBBY/CDN (Sticky)
function pickProxyHostLobby(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host && (now-C.proxyPick.t)<PROXY_STICKY_TTL_MS) return C.proxyPick.host;
  
  var best=null, bestLat=99999;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){
    var cand=PROXY_CANDIDATES[i];
    var lat=measureProxyLatency(cand);
    if(lat<bestLat){bestLat=lat;best=cand;}
  }
  
  if(!best) best=PROXY_CANDIDATES[0];
  
  C.proxyPick={host:best,t:now,lat:bestLat};
  return best;
}

// اختيار البروكسي لفئة MATCH (Non-Sticky for max responsiveness)
function pickProxyHostMatch(){
  // لا تستخدم الكاش الثابت - قم بالقياس في كل مرة لتحقيق أقل بنج في الماتش.
  var best=null, bestLat=99999;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){
    var cand=PROXY_CANDIDATES[i];
    var lat=measureProxyLatency(cand);
    if(lat<bestLat){bestLat=lat;best=cand;}
  }
  
  if(!best) best=PROXY_CANDIDATES[0];
  return best;
}

function proxyFor(cat){
    var h;
    if (cat === "MATCH") {
        h = pickProxyHostMatch();
    } else {
        h = pickProxyHostLobby();
    }
    
    var pt=FIXED_PORT[cat]||443;
    return "PROXY "+h+":"+pt;
}

//================== Checks (Final) ==================//

function isLocalHostOrLAN(h, ip) {
  if(!h) return false; h = lc(h);
  if(h === "localhost" || shExpMatch(h,"127.*") || h === "::1" || h === "[::1]") return true;
  var targetIp = ip || dnsCached(h); if(!targetIp) return false;
  if (isIp4(targetIp) && (shExpMatch(targetIp, "10.*") || shExpMatch(targetIp, "192.168.*") || shExpMatch(targetIp, "172.1[6-9].*") || shExpMatch(targetIp, "172.2[0-9].*") || shExpMatch(targetIp, "172.3[0-1].*"))) return true;
  if (isIp6Literal(targetIp) && (shExpMatch(targetIp, "fe80:*") || shExpMatch(targetIp, "fd*:*"))) return true;
  return false;
}

function clientIsJO(){
  var now=(new Date()).getTime(); var g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var my=""; try{ my=myIpAddress(); }catch(e){ my=""; }
  if (isLocalHostOrLAN("", my)) {C.geoClient={ok:true,t:now}; return true;}
  var ok = isJO(my);
  C.geoClient={ok:ok,t:now};
  return ok;
}

function ipEquals(a,b){return a===b;}

function proxyIsJO(){
  var now=(new Date()).getTime(); var g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;

  // التحقق من أن جميع البروكسيات في القائمة البيضاء أردنية
  var p=pickProxyHostLobby(); 
  var pip=p;
  if(!isIp4(p) && !isIp6Literal(p)) pip=dnsCached(p);

  // 1. تحقق من القائمة البيضاء الصارمة (لضمان أنها IPs أردنية مُقررة سلفاً)
  if(PROXY_WHITELIST && PROXY_WHITELIST.length){
    for(var i=0;i<PROXY_WHITELIST.length;i++){
      if(ipEquals(p, PROXY_WHITELIST[i]) || ipEquals(pip, PROXY_WHITELIST[i])) { 
        // تحقق إضافي: يجب أن يكون IP البروكسي المختار أردنياً جغرافياً أيضاً
        if(isJO(pip)){ C.geoProxy={ok:true,t:now}; return true; }
      }
    }
  }

  // 2. التحقق الجغرافي (fallback)
  var ok = isJO(pip);
  C.geoProxy={ok:ok,t:now};
  return ok;
}

function isUnsafeHost(h){
  if(!h) return true;
  if(isPlainHostName(h)) return true;
  if(shExpMatch(h,"*.local") || shExpMatch(h,"*.lan")) return true;
  return false;
}

// قرار الفئة: تطبيق الفحص الجغرافي على كل اتصال غير LAN
function enforceCat(cat, host){
  var ip = host;
  if(!isIp4(ip) && !isIp6Literal(ip)){ 
    if(isUnsafeHost(host)) return "PROXY 0.0.0.0:0"; // حظر Dotless/Local
    ip = dnsCached(host);
  }
  
  // 💥 (Ultimate Enforcer) 
  // إذا لم يكن مُحلولاً (مثل فشل DNS) أو كان غير أردني، يتم حظره.
  if(!isJO(ip)) return "PROXY 0.0.0.0:0";
  
  // إذا كان أردنياً → توجيهه عبر البروكسي الأسرع
  return proxyFor(cat);
}

//================== الدالة الرئيسية (FindProxyForURL) ==================//
function FindProxyForURL(url, host){
  host = lc(host);
  var ip = host; 
  if(!isIp4(ip) && !isIp6Literal(ip)) ip = dnsCached(host); 

  // 1. استثناءات فورية للـ LAN/Localhost
  if (isLocalHostOrLAN(host, ip)) {
    return "DIRECT";
  }

  // 2. استثناءات لخدمات لا ينبغي حظرها
  // هنا، يتم تقليل عدد الاستثناءات، والسماح لها فقط بـ DIRECT
  if (hostMatch(host, [
        "raw.githubusercontent.com", // لملفات PAC
        "youtube.com", "*.youtube.com", "*.googlevideo.com", // استثناء يوتيوب/فيديوهات
        "shahid.mbc.net", "*.shahid.mbc.net", 
        "gstatic.com", "*.gstatic.com" // خدمات جوجل الضرورية
      ])
  ){
    return "DIRECT";
  }

  // 3. التحقق من سياسة الأردن الصارمة (الجهاز والبروكسي)
  // إذا لم يكن جهازك أو البروكسي أردنياً، فلن يُسمح بأي شيئ (STRICT BLOCK)
  if(!clientIsJO() || !proxyIsJO()) return "PROXY 0.0.0.0:0";

  // 4. تحليل فئة الاتصال والتطبيق الصارم
  
  // MATCH / GAME (أولوية: اختيار أسرع بروكسي في كل مرة)
  if( urlMatch(url,URL_PATTERNS.MATCH)    ||
      hostMatch(host,PUBG_DOMAINS.MATCH)  ||
      shExpMatch(url,"*/game/join*")      ||
      shExpMatch(url,"*/game/start*")     ||
      shExpMatch(url,"*/matchmaking/*")   ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH", host);
  }

  // LOBBY / SOCIAL / RECRUIT / UPDATES / CDN
  if( urlMatch(url,URL_PATTERNS.LOBBY)            ||
      hostMatch(host,PUBG_DOMAINS.LOBBY)          ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)   ||
      hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
      urlMatch(url,URL_PATTERNS.UPDATES)          ||
      urlMatch(url,URL_PATTERNS.CDN)              ||
      hostMatch(host,PUBG_DOMAINS.UPDATES)        ||
      hostMatch(host,PUBG_DOMAINS.CDN)
    ){
    return enforceCat("LOBBY", host); 
  }

  // افتراضياً: حظر أي شيء آخر غير معروف وغير مُستثنى
  return "PROXY 0.0.0.0:0";
}
