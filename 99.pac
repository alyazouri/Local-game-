// JO-HARD-MODE PAC — v5 (strict, optimized, patched final with CIDR support)
// هدف: أعلى احتمال للّوبي/الماتش الأردني. أي خروج يكون عبر بروكسي أردني.
// ملاحظة: بتفعيل STRICT_BLOCK=true سيتم حظر الوجهات غير الأردنية بدل تمريرها عبر البروكسي.

//================== نطاقات IPv4 كـ CIDR ==================//
// القائمة المقدمة من المستخدم (base/mask)
var JO_V4_CIDR = [
  { base: "5.45.128.0",   mask: 21 },
  { base: "37.202.64.0",  mask: 20 },
  { base: "37.202.88.0",  mask: 21 },
  { base: "37.202.96.0",  mask: 19 },
  { base: "37.220.120.0", mask: 21 },

  { base: "46.23.112.0",  mask: 20 },
  { base: "46.32.96.0",   mask: 19 },

  { base: "46.185.128.0", mask: 21 },
  { base: "46.185.144.0", mask: 20 },
  { base: "46.185.160.0", mask: 21 },
  { base: "46.185.176.0", mask: 20 },
  { base: "46.185.192.0", mask: 18 },

  { base: "46.248.192.0", mask: 20 },

  { base: "62.72.160.0",  mask: 21 },

  { base: "77.245.0.0",   mask: 21 },

  { base: "79.134.136.0", mask: 21 },
  { base: "79.173.192.0", mask: 18 },

  { base: "80.90.160.0",  mask: 20 },

  { base: "81.21.0.0",    mask: 21 },
  { base: "81.28.112.0",  mask: 20 },

  { base: "82.212.72.0",  mask: 21 },
  { base: "82.212.80.0",  mask: 20 },
  { base: "82.212.96.0",  mask: 20 },
  { base: "82.212.112.0", mask: 21 },

  { base: "84.18.32.0",   mask: 20 },
  { base: "84.18.48.0",   mask: 21 },

  { base: "87.236.232.0", mask: 21 },

  { base: "92.241.32.0",  mask: 21 },
  { base: "92.241.48.0",  mask: 21 },

  { base: "94.142.32.0",  mask: 19 },

  { base: "94.249.0.0",   mask: 20 },
  { base: "94.249.16.0",  mask: 21 },
  { base: "94.249.40.0",  mask: 21 },
  { base: "94.249.48.0",  mask: 20 },
  { base: "94.249.64.0",  mask: 21 },
  { base: "94.249.80.0",  mask: 20 },
  { base: "94.249.96.0",  mask: 19 },

  { base: "109.107.232.0", mask: 21 },
  { base: "109.107.240.0", mask: 21 },

  { base: "176.29.0.0",   mask: 19 },
  { base: "176.29.56.0",  mask: 21 },
  { base: "176.29.72.0",  mask: 21 },
  { base: "176.29.104.0", mask: 21 },
  { base: "176.29.112.0", mask: 20 },
  { base: "176.29.144.0", mask: 20 },
  { base: "176.29.160.0", mask: 20 },
  { base: "176.29.176.0", mask: 21 },
  { base: "176.29.192.0", mask: 20 },
  { base: "176.29.208.0", mask: 21 },
  { base: "176.29.248.0", mask: 21 },

  { base: "178.238.184.0", mask: 21 },

  { base: "212.118.0.0",  mask: 20 },
  { base: "213.186.160.0", mask: 19 }
];

//================== إعدادات عامة ==================//
var PROXY_CANDIDATES = [
  "212.35.66.45"
];

// سماح صريح (Whitelist) للبروكسيات المقبولة كـ "أردنية"
var PROXY_WHITELIST = [
  "212.35.66.45"
];

var FIXED_PORT = {
  LOBBY:            80,
  MATCH:            20001,
  RECRUIT_SEARCH:   80,
  UPDATES:          80,
  CDN:              80
};

// تبديل سريع بين الحظر الصارم وتمرير غير الأردني عبر البروكسي الأردني
var STRICT_BLOCK = false; // true = حظر الوجهات غير الأردنية، false = تمريرها عبر البروكسي

// بادئات IPv6 الأردنية — شاملة لكل الفئات
var JO_V6_PREFIX = {
  LOBBY: [
    "2a03:6b01:1000::/34",
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ],
  MATCH: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ],
  RECRUIT_SEARCH: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ],
  UPDATES: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ],
  CDN: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ]
};

// TTLs & كاش
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

//================== PUBG domains & URL patterns ==================//
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

//================== أدوات مساعدة ==================//
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIp4(s){return /^\d+\.\d+\.\d+\.\d+$/.test(s);} 
function isIp6Literal(s){return s&&s.indexOf(":")!==-1;}

function hostMatch(h,arr){h=lc(h||"");if(!h)return false;for(var i=0;i<arr.length;i++){var pat=arr[i];if(shExpMatch(h,pat))return true;if(pat.indexOf("*.")==0){var suf=pat.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++){if(shExpMatch(u,arr[i]))return true;}return false;}

function dnsCached(h){
  if(!h)return"";
  var now=(new Date()).getTime();
  var e=C.dns[h];
  if(e&&(now-e.t)<DNS_TTL_MS) return e.ip;
  var ip="";
  try{ ip=dnsResolve(h)||""; }catch(err){ ip=""; }
  C.dns[h]={ip:ip,t:now};
  return ip;
}

function ip4ToInt(ip){var p=ip.split(".");return(((+p[0])<<24)>>>0)+(((+p[1])<<16)>>>0)+(((+p[2])<<8)>>>0)+((+p[3])>>>0);} 

// تحضير الشبكات الخاصة بـ JO_V4_CIDR عند أول استخدام
if(!C._JO_V4CIDR){
  C._JO_V4CIDR = [];
  for(var i=0; i<JO_V4_CIDR.length; i++){
    var cidr = JO_V4_CIDR[i];
    var bits = cidr.mask;
    var maskInt;
    if(bits === 0){
      maskInt = 0;
    } else if(bits === 32){
      maskInt = 0xffffffff;
    } else {
      maskInt = ((0xffffffff << (32 - bits)) >>> 0);
    }
    var netInt = ip4ToInt(cidr.base) & maskInt;
    C._JO_V4CIDR.push({ net: netInt, mask: maskInt });
  }
}

function isJOv4(ip){
  if(!ip||!isIp4(ip)) return false;
  var ipInt=ip4ToInt(ip);
  var subnets=C._JO_V4CIDR;
  for(var i=0;i<subnets.length;i++){
    var s=subnets[i];
    if(((ipInt & s.mask) >>> 0) === s.net) return true;
  }
  return false;
}

// IPv6 tools
function pad4(h){return("0000"+h).slice(-4);} 
function norm6(ip){
  if(!ip) return "";
  ip=ip.toLowerCase();
  if(ip.indexOf("::")==-1){
    var parts=ip.split(":");
    while(parts.length<8) parts.push("0");
    return parts.map(pad4).join(":");
  }
  var left=ip.split("::")[0], right=ip.split("::")[1];
  var L=left?left.split(":"):[], R=right?right.split(":"):[];
  var miss=8-(L.length+R.length), zeros=[];
  for(var i=0;i<miss;i++) zeros.push("0");
  return (L.concat(zeros).concat(R)).map(pad4).join(":");
}
function parseCidr6(s){
  s=s.replace(/:+$/,"");
  var m=s.split("/"); var pre=m[0];
  var len=(m.length>1)?parseInt(m[1],10):(pre.split(":").length>=2?32:16);
  return {norm:norm6(pre), len:len};
}
function ip6ToBits(ip){
  var parts=norm6(ip).split(":"); var bits="";
  for(var i=0;i<8;i++){
    var v=parseInt(parts[i],16);
    bits+=("0000000000000000"+v.toString(2)).slice(-16);
  }
  return bits;
}
function match6(ip,cidr){
  if(!ip) return false;
  var b1=ip6ToBits(ip), b2=ip6ToBits(cidr.norm);
  var L=Math.max(0,Math.min(128,cidr.len|0));
  return b1.substring(0,L)===b2.substring(0,L);
}
function isJOv6ForCat(ip,cat){
  if(!ip||ip.indexOf(":")==-1) return false;
  var arr=JO_V6_PREFIX[cat]; if(!arr||!arr.length) return false;
  for(var i=0;i<arr.length;i++){
    var c=parseCidr6(arr[i]);
    if(match6(ip,c)) return true;
  }
  return false;
}

// تقييم "Latency" للبروكسي المرشح (DNS timing كـ pseudo-ping)
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
function pickProxyHost(){
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
function proxyFor(cat){
  var h=pickProxyHost();
  var pt=FIXED_PORT[cat]||443;
  return "PROXY "+h+":"+pt;
}

//================== Checks (Patched) ==================//
// تعامُل مرن مع IP الجهاز: اعتبر RFC1918/LL/ULA "مسموح" لأن الخروج عبر بروكسي أردني
function clientIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;

  var my="";
  try{ my=myIpAddress(); }catch(e){ my=""; }

  var localOk=false;
  if(isIp4(my)){
    localOk = shExpMatch(my,"10.*") || shExpMatch(my,"192.168.*") ||
              shExpMatch(my,"172.16.*") || shExpMatch(my,"172.17.*") ||
              shExpMatch(my,"172.18.*") || shExpMatch(my,"172.19.*") ||
              shExpMatch(my,"172.2?.*") || shExpMatch(my,"172.3?.*");
  } else if(isIp6Literal(my)){
    localOk = shExpMatch(my,"fe80:*") || shExpMatch(my,"fd*:*");
  }

  var ok = localOk || isJOv4(my) || isJOv6ForCat(my,"LOBBY") || isJOv6ForCat(my,"MATCH");
  C.geoClient={ok:ok,t:now};
  return ok;
}

function ipEquals(a,b){return a===b;}

// قبول البروكسي الأردني بالـ whitelist حتى لو خارج لائحة JO_V4_CIDR/JO_V6_PREFIX
function proxyIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;

  var p=pickProxyHost();

  // 1) whitelist بالاسم أو الـ IP المحلول
  if(PROXY_WHITELIST && PROXY_WHITELIST.length){
    for(var i=0;i<PROXY_WHITELIST.length;i++){
      if(ipEquals(p, PROXY_WHITELIST[i])) { C.geoProxy={ok:true,t:now}; return true; }
      var pip=dnsCached(p);
      if(ipEquals(pip, PROXY_WHITELIST[i])) { C.geoProxy={ok:true,t:now}; return true; }
    }
  }

  // 2) تحقق جغرافي اعتيادي
  var ok=false;
  if(isIp4(p)){
    ok = isJOv4(p);
  } else if(isIp6Literal(p)){
    ok = isJOv6ForCat(p,"LOBBY") || isJOv6ForCat(p,"MATCH");
  } else {
    var pip=dnsCached(p);
    ok = isJOv4(pip) || isJOv6ForCat(pip,"LOBBY") || isJOv6ForCat(pip,"MATCH");
  }
  C.geoProxy={ok:ok,t:now};
  return ok;
}

// منع dotless/local
function isUnsafeHost(h){
  if(!h) return true;
  if(isPlainHostName(h)) return true;
  if(shExpMatch(h,"*.local") || shExpMatch(h,"*.lan")) return true;
  return false;
}

// قرار الفئة (Patched للتمرير عبر البروكسي عند عدم أردنية الوجهة)
function enforceCat(cat, host){
  var ip = host;
  if(!isIp4(ip) && !isIp6Literal(ip)){
    if(isUnsafeHost(host)) return (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor(cat));
    ip = dnsCached(host);
  }
  if(isIp6Literal(ip) && isJOv6ForCat(ip,cat)) return proxyFor(cat);
  if(isIp4(ip) && isJOv4(ip)) return proxyFor(cat);

  // الوجهة ليست أردنية: إمّا حظر أو تمرير عبر البروكسي الأردني
  return (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor(cat));
}

//================== الدالة الرئيسية ==================//
function FindProxyForURL(url, host){
  host = lc(host);

  // لو جهازك أو البروكسي ليسا "OK" حسب السياسة → حظر شامل
  if(!clientIsJO() || !proxyIsJO()) return "PROXY 0.0.0.0:0";

  // 1) MATCH (الأهم)
  if( urlMatch(url,URL_PATTERNS.MATCH)    ||
      hostMatch(host,PUBG_DOMAINS.MATCH)  ||
      shExpMatch(url,"*/game/join*")      ||
      shExpMatch(url,"*/game/start*")     ||
      shExpMatch(url,"*/matchmaking/*")   ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH", host);
  }

  // 2) LOBBY + RECRUIT/SEARCH
  if( urlMatch(url,URL_PATTERNS.LOBBY)            ||
      hostMatch(host,PUBG_DOMAINS.LOBBY)          ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)   ||
      hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url,"*/status/heartbeat*")       ||
      shExpMatch(url,"*/friends/*")               ||
      shExpMatch(url,"*/teamfinder/*")            ||
      shExpMatch(url,"*/recruit/*")
    ){
    return enforceCat("LOBBY", host);
  }

  // 3) UPDATES / CDN
  if( urlMatch(url,URL_PATTERNS.UPDATES) ||
      urlMatch(url,URL_PATTERNS.CDN)     ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) ||
      hostMatch(host,PUBG_DOMAINS.CDN)
    ){
    return enforceCat("LOBBY", host);
  }

  // 4) غير ذلك
  return (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor("LOBBY"));
}
