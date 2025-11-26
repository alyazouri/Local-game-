// ===================================================================
// ==               PUBG Mobile Jordanian Proxy PAC                ==
// ==                   Enhanced & Optimized Version               ==
// ==                Designed for best matchmaking in JO            ==
// ===================================================================

// --- الإعدادات الأساسية: قائمة البروكسي والمنافذ ---
// البروكسي الذي سيتم توجيه كل حركة المرور عبره
var PROXY_CANDIDATES = [
  "212.35.66.45"
];

// قائمة البيضاء للبروكسي (لأغراض التحقق الأمني)
var PROXY_WHITELIST = [
  "212.35.66.45"
];

// تحديد منافذ محددة لكل خدمة من خدمات اللعبة لضمان الاستقرار
var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

// وضع الحظر الصارم (غير مفعل لضمان الاستمرارية)
var STRICT_BLOCK = false;

// --- قائمة النطاقات الأردنية (القلب النابض للسكربت) ---
// تمت إضافة نطاقات IPv4 و IPv6 لتغطية شاملة
var JO_V4_PREFIX = [
    "62.240.0.0/16",   // Orange Jordan
    "193.188.0.0/16",  // Umniah
    "212.35.0.0/16",   // Zain Jordan (includes the proxy)
    "217.144.0.0/16",  // Orange Jordan
    "37.0.0.0/16",     // Zain Jordan
    "5.32.0.0/16"      // Orange Jordan
];

var JO_V6_PREFIX = {
  LOBBY: ["2001:1a90::/32","2001:4c30::/32","2c0f:f4b0::/32"], // Orange, Umniah, Zain
  MATCH: ["2001:1a90::/32","2001:4c30::/32","2c0f:f4b0::/32"],
  RECRUIT_SEARCH: ["2001:1a90::/32","2001:4c30::/32","2c0f:f4b0::/32"],
  UPDATES: ["2001:1a90::/32","2001:4c30::/32","2c0f:f4b0::/32"],
  CDN: ["2001:1a90::/32","2001:4c30::/32","2c0f:f4b0::/32"]
};

// --- إعدادات التخزين المؤقت (لتحسين الأداء) ---
var DNS_TTL_MS = 15000;
var PROXY_STICKY_TTL_MS = 60000;
var GEO_TTL_MS = 3600000;

// --- منطقة التخزين المؤقت (لا تقم بتعديلها) ---
var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
C.dns = C.dns || {};
C.proxyPick = C.proxyPick || {host:null, t:0, lat:99999};
C.geoClient = C.geoClient || {ok:false, t:0};
C.geoProxy  = C.geoProxy  || {ok:false, t:0};

// --- قوائم النطاقات والروابط الخاصة باللعبة ---
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

// ===================================================================
// ==                        الدوال المساعدة                         ==
// ===================================================================

function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIp6Literal(s){return s&&s.indexOf(":")!==-1;}
function isIp4Literal(s){return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(s);}

function hostMatch(h,arr){h=lc(h||"");if(!h)return false;for(var i=0;i<arr.length;i++){var pat=arr[i];if(shExpMatch(h,pat))return true;if(pat.indexOf("*.")==0){var suf=pat.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++){if(shExpMatch(u,arr[i]))return true;}return false;}

function dnsCached(h){
  if(!h)return"";
  var now=(new Date()).getTime();
  var e=C.dns[h];
  if(e&&(now-e.t)<DNS_TTL_MS) return e.ip;
  var ip="";
  try{ ip=dnsResolve(h)||""; }catch(err){ip="";}
  C.dns[h]={ip:ip,t:now};
  return ip;
}

// دعم مطابق للـ IPv4
function isIp4InRange(ip, cidr) {
    if (!isIp4Literal(ip)) return false;
    var [range, bits] = cidr.split('/');
    bits = parseInt(bits, 10);
    var mask = (0xffffffff << (32 - bits)) >>> 0;
    var ip_long = ip.split('.').reduce((sum, x) => (sum << 8) + parseInt(x, 10) >>> 0, 0);
    var range_long = range.split('.').reduce((sum, x) => (sum << 8) + parseInt(x, 10) >>> 0, 0);
    return (ip_long & mask) === (range_long & mask);
}

function isJOv4(ip){
    if (!isIp4Literal(ip)) return false;
    for(var i=0; i<JO_V4_PREFIX.length; i++){
        if(isIp4InRange(ip, JO_V4_PREFIX[i])) return true;
    }
    return false;
}

// دعم مطابق للـ IPv6 (كما في الكود الأصلي)
function pad4(h){return("0000"+h).slice(-4);}
function norm6(ip){ if(!ip) return ""; ip=ip.toLowerCase(); if(ip.indexOf("::")==-1){var parts=ip.split(":");while(parts.length<8) parts.push("0");return parts.map(pad4).join(":");} var left=ip.split("::")[0], right=ip.split("::")[1]; var L=left?left.split(":"):[], R=right?right.split(":"):[]; var miss=8-(L.length+R.length), zeros=[];for(var i=0;i<miss;i++) zeros.push("0"); return (L.concat(zeros).concat(R)).map(pad4).join(":");}
function parseCidr6(s){s=s.replace(/:+$/,"");var m=s.split("/"); var pre=m[0]; var len=(m.length>1)?parseInt(m[1],10):(pre.split(":").length>=2?32:16); return {norm:norm6(pre), len:len};}
function ip6ToBits(ip){var parts=norm6(ip).split(":"); var bits="";for(var i=0;i<8;i++){var v=parseInt(parts[i],16);bits+=("0000000000000000"+v.toString(2)).slice(-16);}return bits;}
function match6(ip,cidr){if(!ip) return false;var b1=ip6ToBits(ip), b2=ip6ToBits(cidr.norm);var L=Math.max(0,Math.min(128,cidr.len|0));return b1.substring(0,L)===b2.substring(0,L);}
function isJOv6ForCat(ip,cat){if(!ip||ip.indexOf(":")==-1) return false;var arr=JO_V6_PREFIX[cat]; if(!arr||!arr.length) return false;for(var i=0;i<arr.length;i++){var c=parseCidr6(arr[i]);if(match6(ip,c)) return true;}return false;}

// ===================================================================
// ==                  الدوال الأساسية للمنطق                        ==
// ===================================================================

function measureProxyLatency(h){return 1;}
function pickProxyHost(){return PROXY_CANDIDATES[0];}
function proxyFor(cat){var h=pickProxyHost();var pt=FIXED_PORT[cat]||443;return "PROXY "+h+":"+pt;}

// التحقق إذا كان العميل (أنت) موجوداً في الأردن
function clientIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var my=""; try{ my=myIpAddress(); }catch(e){ my=""; }
  var ok = isJOv4(my) || isJOv6ForCat(my,"LOBBY");
  C.geoClient={ok:ok,t:now};
  return ok;
}

// التحقق إذا كان البروكسي موجوداً في الأردن
function proxyIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var p=pickProxyHost();
  if(PROXY_WHITELIST && PROXY_WHITELIST.length){
    for(var i=0;i<PROXY_WHITELIST.length;i++){
      if(p === PROXY_WHITELIST[i]) { C.geoProxy={ok:true,t:now}; return true; }
      var pip=dnsCached(p);
      if(pip === PROXY_WHITELIST[i]) { C.geoProxy={ok:true,t:now}; return true; }
    }
  }
  var pip=dnsCached(p);
  var ok = isJOv4(pip) || isJOv6ForCat(pip,"LOBBY");
  C.geoProxy={ok:ok,t:now};
  return ok;
}

// ===================================================================
// ==                الدالة الرئيسية لاتخاذ القرار                     ==
// ===================================================================

function FindProxyForURL(url, host){
  host = lc(host);

  // الفحص الأولي: إذا لم تكن أنت أو البروكسي في الأردن، لا تفعل شيئاً
  if(!clientIsJO() || !proxyIsJO()) return "DIRECT";

  // توجيه حركة المرور حسب نوعها
  if( urlMatch(url,URL_PATTERNS.MATCH) || hostMatch(host,PUBG_DOMAINS.MATCH) ){
    return proxyFor("MATCH");
  }

  if( urlMatch(url,URL_PATTERNS.LOBBY) || hostMatch(host,PUBG_DOMAINS.LOBBY) ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH) || hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ){
    return proxyFor("LOBBY");
  }

  if( urlMatch(url,URL_PATTERNS.UPDATES) || urlMatch(url,URL_PATTERNS.CDN) ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) || hostMatch(host,PUBG_DOMAINS.CDN) ){
    return proxyFor("LOBBY");
  }

  return "DIRECT";
}
