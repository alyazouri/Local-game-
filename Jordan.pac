// JO-HARD-JORDAN-IPv6 — PUBG Jordan Focus
// هدف: رفع نسبة اللاعبين الأردنيين لأقصى درجة ممكنة عن طريق إجبار PUBG
// إنها تستخدم مسارات IPv6 أردنية فقط للماتش / اللوبي / الريكروت / التحديثات.

// ================== إعدادات البروكسي ================== //
var PROXY_CANDIDATES = [
  "212.35.66.45"
];

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

// مود هارد أردن: أي مسار مش أردني → نحظره
var STRICT_BLOCK = true;

// ============ نطاقات IPv6 الأردنية الحقيقية فقط ============ //
var JO_JORDAN_V6 = [
  // Zain Jordan
  "2a03:b640::/32",

  // Umniah
  "2a03:6b00::/29",

  // Orange Jordan
  "2a00:18d8::/29",

  // GO / Batelco Jordan
  "2a00:18d0::/29",

  // Mada / JDC
  "2a00:caa0::/32",

  // National JO allocation + allocations إضافية
  "2001:32c0::/29",
  "2a00:4620::/32",
  "2a00:76e0::/32",
  "2a00:b860::/32"
];

// نفس النطاقات لكل كاتيجوري عشان كل شغل PUBG يضل جوّا الأردن
var JO_V6_PREFIX = {
  LOBBY:          JO_JORDAN_V6,
  MATCH:          JO_JORDAN_V6,
  RECRUIT_SEARCH: JO_JORDAN_V6,
  UPDATES:        JO_JORDAN_V6,
  CDN:            JO_JORDAN_V6
};

var DNS_TTL_MS = 15000;
var PROXY_STICKY_TTL_MS = 60000;
var GEO_TTL_MS = 3600000;

var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
C.dns = C.dns || {};
C.proxyPick = C.proxyPick || {host:null, t:0, lat:99999};
C.geoClient = C.geoClient || {ok:false, t:0};
C.geoProxy  = C.geoProxy  || {ok:false, t:0};

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

function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIp6Literal(s){return s&&s.indexOf(":")!==-1;}

function hostMatch(h,arr){
  h=lc(h||"");
  if(!h)return false;
  for(var i=0;i<arr.length;i++){
    var pat=arr[i];
    if(shExpMatch(h,pat))return true;
    if(pat.indexOf("*.")==0){
      var suf=pat.substring(1);
      if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;
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
  if(e&&(now-e.t)<DNS_TTL_MS) return e.ip;
  var ip="";
  try{
    if(typeof dnsResolveEx==="function"){
      var r=dnsResolveEx(h);
      if(r){
        if(typeof r==="string"){
          var parts=r.split(/[;,]/);
          for(var i=0;i<parts.length;i++){
            var a=parts[i].trim();
            if(!a)continue;
            if(isIp6Literal(a)){ip=a;break;}
          }
        }else if(r.length){
          for(var j=0;j<r.length;j++){
            var b=r[j];
            if(isIp6Literal(b)){ip=b;break;}
          }
        }
      }
      if(!ip) ip=dnsResolve(h)||"";
    }else{
      ip=dnsResolve(h)||"";
    }
  }catch(err){ip="";}
  C.dns[h]={ip:ip,t:now};
  return ip;
}

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

function measureProxyLatency(h){return 1;}
function pickProxyHost(){return PROXY_CANDIDATES[0];}
function proxyFor(cat){
  var h=pickProxyHost();
  var pt=FIXED_PORT[cat]||443;
  return "PROXY "+h+":"+pt;
}

function clientIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;

  var my="";
  try{ my=myIpAddress(); }catch(e){ my=""; }

  var localOk=false;
  if(isIp6Literal(my)){
    localOk = shExpMatch(my,"fe80:*") || shExpMatch(my,"fd*:*");
  }

  var ok = localOk || isJOv6ForCat(my,"LOBBY") || isJOv6ForCat(my,"MATCH");
  C.geoClient={ok:ok,t:now};
  return ok;
}

function ipEquals(a,b){return a===b;}

function proxyIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;

  var p=pickProxyHost();

  if(PROXY_WHITELIST && PROXY_WHITELIST.length){
    for(var i=0;i<PROXY_WHITELIST.length;i++){
      if(ipEquals(p, PROXY_WHITELIST[i])) { C.geoProxy={ok:true,t:now}; return true; }
      var pip=dnsCached(p);
      if(ipEquals(pip, PROXY_WHITELIST[i])) { C.geoProxy={ok:true,t:now}; return true; }
    }
  }

  var pip=dnsCached(p);
  var ok = isIp6Literal(pip) && (isJOv6ForCat(pip,"LOBBY") || isJOv6ForCat(pip,"MATCH"));
  C.geoProxy={ok:ok,t:now};
  return ok;
}

function isUnsafeHost(h){
  if(!h) return true;
  if(isPlainHostName(h)) return true;
  if(shExpMatch(h,"*.local") || shExpMatch(h,"*.lan")) return true;
  return false;
}

function enforceCat(cat, host){
  var ip = host;
  if(!isIp6Literal(ip)){
    if(isUnsafeHost(host)) return (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor(cat));
    ip = dnsCached(host);
  }
  // لو الوجهة IPv6 أردنية بنسمح لها عبر البروكسي الأردني
  if(isIp6Literal(ip) && isJOv6ForCat(ip,cat)) return proxyFor(cat);
  // غير هيك → حظر في مود هارد
  return (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor(cat));
}

function FindProxyForURL(url, host){
  host = lc(host);

  // ✅ استثناء GitHub raw (ملفات PAC)
  if (hostMatch(host, ["raw.githubusercontent.com"])) {
    return "DIRECT";
  }

  // ✅ استثناء YouTube بالكامل
  if ( hostMatch(host, [
        "youtube.com",
        "*.youtube.com",
        "*.googlevideo.com",
        "*.ytimg.com"
      ])
  ){
    return "DIRECT";
  }

  // ✅ استثناء تطبيق/موقع شاهد
  if ( hostMatch(host, [
        "shahid.mbc.net",
        "*.shahid.mbc.net",
        "shahid.net",
        "*.shahid.net"
      ])
  ){
    return "DIRECT";
  }

  // ❗ لازم جهازك + البروكسي يكونوا أردنيين (IPv6 JO)
  if(!clientIsJO() || !proxyIsJO()) return "PROXY 0.0.0.0:0";

  // ========= MATCH / GAME ========= //
  if( urlMatch(url,URL_PATTERNS.MATCH)    ||
      hostMatch(host,PUBG_DOMAINS.MATCH)  ||
      shExpMatch(url,"*/game/join*")      ||
      shExpMatch(url,"*/game/start*")     ||
      shExpMatch(url,"*/matchmaking/*")   ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH", host);
  }

  // ========= LOBBY / SOCIAL / RECRUIT ========= //
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

  // ========= UPDATES / CDN ========= //
  if( urlMatch(url,URL_PATTERNS.UPDATES) ||
      urlMatch(url,URL_PATTERNS.CDN)     ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) ||
      hostMatch(host,PUBG_DOMAINS.CDN)
    ){
    return enforceCat("LOBBY", host);
  }

  // أي إشي ثاني في مود هارد → حظر
  return "PROXY 0.0.0.0:0";
}
