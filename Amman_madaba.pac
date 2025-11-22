// JO-HARD-MODE PAC — v6.0 (Final Secure & Optimized)
// هدف: أعلى احتمال للّوبي/الماتش الأردني. أي خروج يكون عبر بروكسي أردني/محظور.
// ملاحظة: بتفعيل STRICT_BLOCK=true سيتم حظر الوجهات غير الأردنية بدل تمريرها عبر البروكسي.

//================== إعدادات عامة ==================//
var PROXY_CANDIDATES = [
  "212.35.66.45"
];

// سماح صريح (Whitelist) للبروكسيات المقبولة كـ "أردنية"
var PROXY_WHITELIST = [
  "212.35.66.45"
];

var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

// تبديل سريع بين الحظر الصارم وتمرير غير الأردني عبر البروكسي الأردني
var STRICT_BLOCK = false; // true = حظر الوجهات غير الأردنية، false = تمريرها عبر البروكسي

// بادئات IPv6 الأردنية — مجمعة في قائمة واحدة للتبسيط
var JO_V6_PREFIX_LIST = [
  "2a02:420:1000::/48",
  "2a02:420:5000::/48",
  "2a02:8280:3000::/48",
  "2a02:8280:3100::/48",
  "2a02:8280:8000::/48",
  "2a02:2e04:5000::/48",
  "2001:678:3600::/48",
  "2001:678:2f00::/48",
  "2001:678:1e00::/48",
  "2001:678:2500::/48",
  "2a02:8280:8100::/48",
  "2a02:2e04:e100::/48",
  "2a02:2e04:d100::/48",
  "2a02:420:6100::/48",
  "2a00:dc0:2000::/48",
  "2a00:dc0:5000::/48",
  "2a02:420:5100::/48",
  "2a02:2e04:d000::/48",
  "2a02:420:9000::/48",
  "2a02:8280:c100::/48",
  "2001:678:3200::/48",
  "2a02:420:4000::/48"
];

// IPv4 ranges — أردنية
var JO_V4_RANGES = [

];

// TTLs & كاش (كما في النسخة 5.3)
var DNS_TTL_MS = 15*1000;
var PROXY_STICKY_TTL_MS = 60*1000;
var GEO_TTL_MS = 60*60*1000;

var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
C.dns = C.dns || {};
C.proxyPick = C.proxyPick || {host:null, t:0, lat:99999};
C.geoClient = C.geoClient || {ok:false, t:0};
C.geoProxy  = C.geoProxy  || {ok:false, t:0};
// تم توحيد كاش IPv6
C._JO_V6_CIDRS_ALL = C._JO_V6_CIDRS_ALL || null;
C._JO_V4I = C._JO_V4I || null;

//================== PUBG domains & URL patterns (كما في النسخة 5.3) ==================//
var PUBG_DOMAINS = {
  LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};
var URL_PATTERNS = {
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

//================== أدوات مساعدة عامة (كما في النسخة 5.3) ==================//
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIp4(s){return /^\d+\.\d+\.\d+\.\d+$/.test(s);}
function isIp6Literal(s){return s&&s.indexOf(":")!==-1;}

function hostMatch(h,arr){
  h=lc(h||"");
  if(!h) return false;
  for(var i=0;i<arr.length;i++){
    var pat=arr[i];
    if(shExpMatch(h,pat))return true;
    if(pat.indexOf("*.")==0){
      var suf=pat.substring(1);
      if(h.length>=suf.length && h.substring(h.length-suf.length)===suf)return true;
    }
  }
  return false;
}
function urlMatch(u,arr){
  if(!u)return false;
  for(var i=0;i<arr.length;i++){
    if(shExpMatch(u,arr[i]))return true;
  }
  return false;
}

function dnsCached(h){
  if(!h)return"";
  var now=(new Date()).getTime();
  var e=C.dns[h];
  if(e && (now-e.t)<DNS_TTL_MS)return e.ip;
  var ip="";
  try{ip=dnsResolve(h)||"";}catch(err){ip="";}
  C.dns[h]={ip:ip,t:now};
  return ip;
}

//================== أدوات IPv4 + IPv6 ==================//

// IPv4 (كما في النسخة 5.3)
function ip4ToInt(ip){
  var p=ip.split(".");
  return(((+p[0])<<24)>>>0)+(((+p[1])<<16)>>>0)+(((+p[2])<<8)>>>0)+((+p[3])>>>0);
}
function rangePair(a){return{s:ip4ToInt(a[0]),e:ip4ToInt(a[1])};}

function ensureJOv4Index(){
  if(C._JO_V4I)return;
  C._JO_V4I=[];
  for(var _i=0;_i<JO_V4_RANGES.length;_i++){
    var pr=rangePair(JO_V4_RANGES[_i]);
    if(pr.s<=pr.e)C._JO_V4I.push(pr);
  }
}
function isJOv4(ip){
  if(!ip||!isIp4(ip))return false;
  ensureJOv4Index();
  var n=ip4ToInt(ip);
  for(var i=0;i<C._JO_V4I.length;i++){
    var r=C._JO_V4I[i];
    if(n>=r.s && n<=r.e)return true;
  }
  return false;
}

// IPv6 (تم تعديلها لاستخدام القائمة الموحدة)
function pad4(h){return("0000"+h).slice(-4);}
function norm6(ip){
  if(!ip)return"";
  ip=ip.toLowerCase();
  if(ip.indexOf("::")==-1){
    var parts=ip.split(":");
    while(parts.length<8)parts.push("0");
    return parts.map(pad4).join(":");
  }
  var tmp=ip.split("::");
  var left=tmp[0], right=tmp[1];
  var L=left?left.split(":"):[];
  var R=right?right.split(":"):[];
  var miss=8-(L.length+R.length);
  var zeros=[];
  for(var i=0;i<miss;i++)zeros.push("0");
  return(L.concat(zeros).concat(R)).map(pad4).join(":");
}
function parseCidr6(s){
  s=s.replace(/:+$/,"");
  var m=s.split("/");
  var pre=m[0];
  var len=(m.length>1)?parseInt(m[1],10):32;
  return{norm:norm6(pre),len:len};
}
function ip6ToBits(ip){
  var parts=norm6(ip).split(":");
  var bits="";
  for(var i=0;i<8;i++){
    var v=parseInt(parts[i],16);
    var b=v.toString(2);
    while(b.length<16)b="0"+b;
    bits+=b;
  }
  return bits;
}
function match6(ip,cidr){
  if(!ip)return false;
  var b1=ip6ToBits(ip);
  var b2=ip6ToBits(cidr.norm);
  var L=cidr.len|0;
  if(L<0)L=0;
  if(L>128)L=128;
  return b1.substring(0,L)===b2.substring(0,L);
}

// كاش لكل الـ CIDRs الأردنية (من أي فئة)
function getJOCidrs6(){
  if(C._JO_V6_CIDRS_ALL)return C._JO_V6_CIDRS_ALL;
  var out=[];
  for(var i=0;i<JO_V6_PREFIX_LIST.length;i++){
    out.push(parseCidr6(JO_V6_PREFIX_LIST[i]));
  }
  C._JO_V6_CIDRS_ALL=out;
  return out;
}

// فحص IPv6 الأردني العام
function isJOv6(ip){
  if(!ip||ip.indexOf(":")==-1)return false;
  var cidrs=getJOCidrs6();
  if(!cidrs.length)return false;
  for(var i=0;i<cidrs.length;i++){
    if(match6(ip,cidrs[i]))return true;
  }
  return false;
}

//================== Proxy latency & selection (كما في النسخة 5.3) ==================//
function measureProxyLatency(h){
  if(isIp4(h)||isIp6Literal(h))return 1;
  try{
    var t0=(new Date()).getTime();
    var r=dnsResolve(h);
    var dt=(new Date()).getTime()-t0;
    if(!r)return 99999;
    return dt>0?dt:1;
  }catch(e){return 99999;}
}

function pickProxyHost(){
  var now=(new Date()).getTime();
  // إذا كان البروكسي الثابت سارياً، استخدمه
  if(C.proxyPick.host && (now-C.proxyPick.t)<PROXY_STICKY_TTL_MS)return C.proxyPick.host;
  
  // اختر الأسرع
  var best=null, bestLat=99999;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){
    var cand=PROXY_CANDIDATES[i];
    var lat=measureProxyLatency(cand);
    if(lat<bestLat){bestLat=lat;best=cand;}
  }
  // fallback لأول مرشح إذا لم يتم العثور على الأفضل (في حال فشل قياس زمن الوصول للكل)
  if(!best)best=PROXY_CANDIDATES[0]; 
  
  C.proxyPick={host:best,t:now,lat:bestLat};
  return best;
}

function proxyFor(cat){
  var h=pickProxyHost();
  var pt=FIXED_PORT[cat]||443;
  return"PROXY "+h+":"+pt;
}

//================== Checks (Patched) ==================//

// helper: localhost / loopback / RFC1918 / Link-Local
function isLocalHostOrLAN(h,ip){
  if(!h)return false;
  h=lc(h);
  if(h==="localhost")return true;
  // Loopback IPv4
  if(shExpMatch(h,"127.*"))return true;
  // Loopback IPv6
  if(h==="::1"||h==="[::1]")return true;
  
  // check IP (host could be a hostname, so check the resolved IP too)
  var targetIp=ip||dnsCached(h);
  if(!targetIp)return false;
  
  // RFC1918 IPv4 Private Ranges
  if(shExpMatch(targetIp,"10.*")|| 
     shExpMatch(targetIp,"192.168.*")||
     shExpMatch(targetIp,"172.1[6-9].*")|| 
     shExpMatch(targetIp,"172.2[0-9].*")||
     shExpMatch(targetIp,"172.3[0-1].*")){
    return true;
  }
  // IPv6 ULA (Unique Local Address)
  if(shExpMatch(targetIp,"fc00:*")||shExpMatch(targetIp,"fd*:*"))return true;
  // IPv6 Link-Local
  if(shExpMatch(targetIp,"fe80:*"))return true;
    
  return false;
}

function clientIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS)return g.ok;

  var my="";
  try{my=myIpAddress();}catch(e){my="";}

  // إذا كان داخلي (LAN)، فهو يعتبر "OK" للمتابعة.
  if(isLocalHostOrLAN("",my))return true;

  var ok=isJOv4(my)||isJOv6(my);
  C.geoClient={ok:ok,t:now};
  return ok;
}

function ipEquals(a,b){return a===b;}

// قبول البروكسي الأردني بالـ whitelist حتى لو خارج JO_V4/JO_V6
function proxyIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS)return g.ok;

  var p=pickProxyHost();
  var pip=p;
  if(!isIp4(p) && !isIp6Literal(p))pip=dnsCached(p);

  // 1. تحقق من القائمة البيضاء (Whitelist)
  if(PROXY_WHITELIST && PROXY_WHITELIST.length){
    for(var i=0;i<PROXY_WHITELIST.length;i++){
      if(ipEquals(p,PROXY_WHITELIST[i])||ipEquals(pip,PROXY_WHITELIST[i])){ 
        C.geoProxy={ok:true,t:now}; 
        return true; 
      }
    }
  }

  // 2. تحقق جغرافي اعتيادي
  var ok=isJOv4(pip)||isJOv6(pip);
  C.geoProxy={ok:ok,t:now};
  return ok;
}

// منع dotless/local
function isUnsafeHost(h){
  if(!h)return true;
  if(isPlainHostName(h))return true;
  if(shExpMatch(h,"*.local")||shExpMatch(h,"*.lan"))return true;
  return false;
}

// قرار الفئة: تحقق جغرافي مبسط (لأن كل IPv6 الأردنية تم توحيدها الآن)
function enforceCat(cat,host){
  var ip=host;
  if(!isIp4(ip) && !isIp6Literal(ip)){
    if(isUnsafeHost(host))return(STRICT_BLOCK?"PROXY 0.0.0.0:0":proxyFor(cat));
    ip=dnsCached(host);
  }
  
  // تحقق من أن الوجهة أردنية
  if(isJOv6(ip)||isJOv4(ip))return proxyFor(cat);

  // الوجهة ليست أردنية: إمّا حظر أو تمرير عبر البروكسي الأردني
  return(STRICT_BLOCK?"PROXY 0.0.0.0:0":proxyFor(cat));
}

//================== الدالة الرئيسية (FindProxyForURL) ==================//
function FindProxyForURL(url,host){
  host=lc(host);
  var ip=host; 
  if(!isIp4(ip) && !isIp6Literal(ip))ip=dnsCached(host); // محاولة حل IP مبكرة

  // 1. استثناءات سريعة لـ LAN/Localhost/Raw Github
  if(isLocalHostOrLAN(host,ip)){
    return"DIRECT";
  }
  if(dnsDomainIs(host,"raw.githubusercontent.com")){
    return"DIRECT";
  }

  // 2. التحقق من سياسة الأردن (في حال فشل، حظر شامل)
  if(!clientIsJO() || !proxyIsJO())return"PROXY 0.0.0.0:0";

  // 3. تحليل فئة الاتصال والتطبيق الصارم
  
  // MATCH (الأهم)
  if( urlMatch(url,URL_PATTERNS.MATCH)    ||
      hostMatch(host,PUBG_DOMAINS.MATCH)  ||
      shExpMatch(url,"*/game/join*")      ||
      shExpMatch(url,"*/game/start*")     ||
      shExpMatch(url,"*/matchmaking/*")   ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH",host);
  }

  // LOBBY + RECRUIT/SEARCH
  if( urlMatch(url,URL_PATTERNS.LOBBY)            ||
      hostMatch(host,PUBG_DOMAINS.LOBBY)          ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)   ||
      hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url,"*/status/heartbeat*")       ||
      shExpMatch(url,"*/friends/*")               ||
      shExpMatch(url,"*/teamfinder/*")            ||
      shExpMatch(url,"*/recruit/*")
    ){
    return enforceCat("LOBBY",host); // سياسة اللوبي
  }

  // UPDATES / CDN
  if( urlMatch(url,URL_PATTERNS.UPDATES) ||
      urlMatch(url,URL_PATTERNS.CDN)     ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) ||
      hostMatch(host,PUBG_DOMAINS.CDN)
    ){
    return enforceCat("LOBBY",host); // سياسة الـ CDN والإضافات
  }

  // غير ذلك: أي اتصال متبقٍ غير مُستثنى أو مُعرَّف، إما حظر أو تمرير عبر البروكسي الأردني
  return(STRICT_BLOCK?"PROXY 0.0.0.0:0":proxyFor("LOBBY"));
}
