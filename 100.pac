// ===================================================================
// ==     Jordan-Strict-Block PAC — v2.0 (AS-based, Final)         ==
// ==                                                            ==
// ==  الهدف: حظر أي اتصال خارج النطاقات التابعة لـ:            ==
// ==   AS8697 (Orange JO)                                       ==
// ==   AS48821 (Mauve)                                          ==
// ==   AS50717 (Fortis)                                         ==
// ==   AS42637 (LAN CONNECT)                                   ==
// ==                                                            ==
// ==  + استثناء سناب شات / يوتيوب / شاهد (DIRECT).             ==
// ==  + PUBG فقط عبر البروكسي وعلى نفس النطاقات أعلاه.        ==
// ===================================================================

//================== إعدادات رئيسية ==================//

// --- البروكسي المستخدم ---
var PROXY_HOST = "212.35.66.45";
var PROXY_WHITELIST = [ "212.35.66.45" ]; // قائمة بيضاء للتحقق من البروكسي

// --- وضع الحظر الصارم ---
// true  = حظر أي اتصال خارج النطاقات المحددة.
// false = السماح بتمرير الاتصالات الأخرى عبر البروكسي.
var STRICT_BLOCK = true;

// --- منافذ البروكسي الثابتة ---
var FIXED_PORT = {
  LOBBY:            80,
  MATCH:            20001,
  RECRUIT_SEARCH:   80,
  UPDATES:          80,
  CDN:              80
};

//================== النطاقات المسموح بها (مستبدلة بالـ AS) ==================//
// ملاحظة: هذه ليست "كل الأردن"، بل فقط:
//  AS8697  (Jordan Telecommunications PSC - Orange Jordan)  [oai_citation:0‡bgp.he.net](https://bgp.he.net/AS8697)  
//  AS48821 (Mauve Mailorder Software Verwaltung GmbH)  [oai_citation:1‡bgp.he.net](https://bgp.he.net/AS48821)  
//  AS50717 (RIPE NCC ASN block / Fortis)  [oai_citation:2‡ping0.cc](https://ping0.cc/as/AS50717?utm_source=chatgpt.com)  
//  AS42637 (LAN CONNECT SERVICES SRL)  [oai_citation:3‡bgp.he.net](https://bgp.he.net/AS42637)  

// --------- IPv4 ranges (startIP, endIP) --------- //
var JO_V4_RANGES = [

  // ===================== AS8697 — Orange Jordan (JO) ===================== //
  // 212.34.0.0/19 → Jordan Telecommunications PSC (Amman + مدن الأردن)  [oai_citation:4‡bgp.he.net](https://bgp.he.net/AS8697)
  ["212.34.0.0","212.34.31.255"],

  // 213.139.32.0/19 → Jordan Telecommunications PSC  [oai_citation:5‡bgp.he.net](https://bgp.he.net/AS8697)
  ["213.139.32.0","213.139.63.255"],

  // 2.17.24.0/22 → Akamai prefix معلن من AS8697 (غالباً CDN مربوط بأورانج)  [oai_citation:6‡bgp.he.net](https://bgp.he.net/AS8697)
  ["2.17.24.0","2.17.27.255"],

  // 149.200.255.0/24 → Assigned for ADSL customers تحت AS8697  [oai_citation:7‡bgp.he.net](https://bgp.he.net/AS8697)
  ["149.200.255.0","149.200.255.255"],

  // ===================== AS48821 — Mauve (DE) ===================== //
  // 45.159.32.0/22 → Mauve Mailorder Software Verwaltung GmbH  [oai_citation:8‡bgp.he.net](https://bgp.he.net/AS48821)
  ["45.159.32.0","45.159.35.255"],

  // 185.138.52.0/22 → Mauve Mailorder Software GmbH & Co. KG  [oai_citation:9‡bgp.he.net](https://bgp.he.net/AS48821)
  ["185.138.52.0","185.138.55.255"],

  // ===================== AS42637 — LAN CONNECT (RO) ===================== //
  // 86.106.133.0/24 → LAN CONNECT SERVICES SRL  [oai_citation:10‡bgp.he.net](https://bgp.he.net/AS42637)
  ["86.106.133.0","86.106.133.255"],

  // ===================== AS50717 — Fortis / RIPE ASN block ===================== //
  // 91.229.202.0/23 → Hardcore/Fortis block (يشمل 91.229.202.0–91.229.203.255)  [oai_citation:11‡ping0.cc](https://ping0.cc/as/AS50717?utm_source=chatgpt.com)
  ["91.229.202.0","91.229.203.255"],

  // 195.191.250.0/23 → ServerChoice Ltd تحت AS50717  [oai_citation:12‡ping0.cc](https://ping0.cc/as/AS50717?utm_source=chatgpt.com)
  ["195.191.250.0","195.191.251.255"]
];

// --------- IPv6 prefixes --------- //
var JO_V6_PREFIXES = [

  // ========== AS8697 — Orange Jordan IPv6 ========== //
  // 2a00:18d8::/29 → السوبر نت الرئيسي لـ IPv6 لأورانج الأردن  [oai_citation:13‡bgp.he.net](https://bgp.he.net/AS8697)
  "2a00:18d8::/29",

  // ========== AS48821 — Mauve IPv6 ========== //
  // 2a07:a40::/29 → IPv6 supernet لـ Mauve Mailorder Software  [oai_citation:14‡bgp.he.net](https://bgp.he.net/AS48821)
  "2a07:a40::/29"

  // AS42637 و AS50717 لا يعلنان حالياً IPv6 prefixes واضحة.
];

//================== نطاقات اللعبة (PUBG) ==================//
var PUBG_DOMAINS = {
  LOBBY: [
    "*.pubgmobile.com","*.pubgmobile.net",
    "*.proximabeta.com","*.igamecj.com"
  ],
  MATCH: [
    "*.gcloud.qq.com","gpubgm.com"
  ],
  RECRUIT_SEARCH: [
    "match.igamecj.com","match.proximabeta.com",
    "teamfinder.igamecj.com","teamfinder.proximabeta.com"
  ],
  UPDATES: [
    "cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com",
    "hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"
  ],
  CDN: [
    "cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com",
    "*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"
  ]
};

var URL_PATTERNS = {
  LOBBY: [
    "*/account/login*","*/client/version*","*/status/heartbeat*",
    "*/presence/*","*/friends/*"
  ],
  MATCH: [
    "*/matchmaking/*","*/mms/*",
    "*/game/start*","*/game/join*","*/report/battle*"
  ],
  RECRUIT_SEARCH: [
    "*/teamfinder/*","*/clan/*","*/social/*",
    "*/search/*","*/recruit/*"
  ],
  UPDATES: [
    "*/patch*","*/hotfix*","*/update*",
    "*/download*","*/assets/*","*/assetbundle*","*/obb*"
  ],
  CDN: [
    "*/cdn/*","*/static/*","*/image/*",
    "*/media/*","*/video/*","*/res/*","*/pkg/*"
  ]
};

//================== أدوات مساعدة (كما هي) ==================//
var DNS_TTL_MS = 30*1000;
var GEO_TTL_MS = 60*60*1000;
var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
C.dns = C.dns || {};
C.geoClient = C.geoClient || {ok:false, t:0};
C.geoProxy  = C.geoProxy  || {ok:false, t:0};
C._JO_V4I = C._JO_V4I || [];
C._JO_V6C = C._JO_V6C || {};
C.enforceCache = C.enforceCache || {};

function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIp4(s){return /^\d+\.\d+\.\d+\.\d+$/.test(s);}
function isIp6Literal(s){return s&&s.indexOf(":")!==-1;}

function hostMatch(h,arr){
  h = lc(h||"");
  if(!h) return false;
  for(var i=0;i<arr.length;i++){
    if(shExpMatch(h,arr[i])) return true;
    if(arr[i].indexOf("*.")==0){
      var suf=arr[i].substring(1);
      if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;
    }
  }
  return false;
}

function urlMatch(u,arr){
  if(!u) return false;
  for(var i=0;i<arr.length;i++){
    if(shExpMatch(u,arr[i])) return true;
  }
  return false;
}

function dnsCached(h){
  if(!h) return "";
  var now=(new Date()).getTime();
  var e=C.dns[h];
  if(e && (now-e.t)<DNS_TTL_MS) return e.ip;
  var ip="";
  try{ ip=dnsResolve(h)||""; }catch(err){ ip=""; }
  C.dns[h]={ip:ip,t:now};
  return ip;
}

function ip4ToInt(ip){
  var p=ip.split(".");
  return (((+p[0])<<24)>>>0)+(((+p[1])<<16)>>>0)+(((+p[2])<<8)>>>0)+((+p[3])>>>0);
}
function rangePair(a){ return {s:ip4ToInt(a[0]), e:ip4ToInt(a[1])}; }

function initV4(){
  if(C._JO_V4I && C._JO_V4I.length) return;
  C._JO_V4I=[];
  for(var _i=0; _i<JO_V4_RANGES.length; _i++){
    var pr=rangePair(JO_V4_RANGES[_i]);
    if(pr.s<=pr.e) C._JO_V4I.push(pr);
  }
}

function isJOv4(ip){
  if(!ip || !isIp4(ip)) return false;
  initV4();
  var n=ip4ToInt(ip);
  var arr=C._JO_V4I;
  for(var i=0;i<arr.length;i++){
    var r=arr[i];
    if(n>=r.s && n<=r.e) return true;
  }
  return false;
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
  var parts = ip.split("::");
  var left  = parts[0];
  var right = parts[1];
  var L = left ? left.split(":") : [];
  var R = right ? right.split(":") : [];
  var miss=8-(L.length+R.length), zeros=[];
  for(var i=0;i<miss;i++) zeros.push("0");
  return (L.concat(zeros).concat(R)).map(pad4).join(":");
}

function parseCidr6(s){
  s=s.replace(/:+$/,"");
  var m=s.split("/");
  var pre=m[0];
  var len=(m.length>1)?parseInt(m[1],10):(pre.split(":").length>=2?32:16);
  return {norm:norm6(pre), len:len};
}

function ip6ToBits(ip){
  var parts=norm6(ip).split(":");
  var bits="";
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

function initV6(){
  if(C._JO_V6C && C._JO_V6C._ready) return;
  C._JO_V6C = [];
  for(var i=0;i<JO_V6_PREFIXES.length;i++){
    C._JO_V6C.push(parseCidr6(JO_V6_PREFIXES[i]));
  }
  C._JO_V6C._ready = true;
}

function isJOv6(ip){
  if(!ip || ip.indexOf(":")==-1) return false;
  initV6();
  for(var i=0;i<C._JO_V6C.length;i++){
    if(match6(ip, C._JO_V6C[i])) return true;
  }
  return false;
}

function isJO(ip){
  return isJOv4(ip) || isJOv6(ip);
}

function proxyFor(cat){
  var pt=FIXED_PORT[cat]||443;
  return "PROXY "+PROXY_HOST+":"+pt;
}

function isUnsafeHost(h){
  if(!h) return true;
  if(isPlainHostName(h)) return true;
  if(shExpMatch(h,"*.local") || shExpMatch(h,"*.lan")) return true;
  if(/^[0-9]+$/.test(h)) return true;
  return false;
}

function clientIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var my="";
  try{ my=myIpAddress(); }catch(e){ my=""; }
  var localOk=false;
  if(isIp4(my)){
    localOk =
      shExpMatch(my,"10.*") ||
      shExpMatch(my,"192.168.*") ||
      shExpMatch(my,"172.16.*") ||
      shExpMatch(my,"172.17.*") ||
      shExpMatch(my,"172.18.*") ||
      shExpMatch(my,"172.19.*") ||
      shExpMatch(my,"172.2?.*") ||
      shExpMatch(my,"172.3?.*");
  } else if(isIp6Literal(my)){
    localOk = shExpMatch(my,"fe80:*") || shExpMatch(my,"fd*:*");
  }
  var ok = localOk || isJO(my);
  C.geoClient={ok:ok,t:now};
  return ok;
}

function proxyIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;

  if(PROXY_WHITELIST && PROXY_WHITELIST.length){
    for(var i=0;i<PROXY_WHITELIST.length;i++){
      if(PROXY_HOST === PROXY_WHITELIST[i]) {
        C.geoProxy={ok:true,t:now};
        return true;
      }
    }
  }

  var ok = isJO(PROXY_HOST) || isJO(dnsCached(PROXY_HOST));
  C.geoProxy={ok:ok,t:now};
  return ok;
}

function enforcePolicy(cat, host){
  host = host || "";
  var key = cat + "|" + host;
  var cached = C.enforceCache[key];
  if(cached) return cached;

  var res;
  var ip = host;

  if(!isIp4(ip) && !isIp6Literal(ip)){
    if(isUnsafeHost(host)){
      res = (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor(cat));
      C.enforceCache[key]=res;
      return res;
    }
    ip = dnsCached(host);
  }

  if(isJO(ip)){
    res = proxyFor(cat);
    C.enforceCache[key]=res;
    return res;
  }

  res = (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor(cat));
  C.enforceCache[key]=res;
  return res;
}

//================== الدالة الرئيسية ==================//
function FindProxyForURL(url, host){
  host = lc(host);

  // --- فحص أمان أولي: يجب أن يكون العميل والبروكسي ضمن السياسة ---
  if(!clientIsJO() || !proxyIsJO())
    return "PROXY 0.0.0.0:0";

  // =====================================================
  // === 0) استثناءات: Snapchat / YouTube / Shahid (DIRECT)
  // =====================================================

  // ---- Snapchat ----
  if (
    shExpMatch(host, "*.snapchat.com") ||
    shExpMatch(host, "*.sc-cdn.net")   ||
    shExpMatch(host, "*.snapads.com")
  ){
    return "DIRECT";
  }

  // ---- YouTube ----
  if (
    shExpMatch(host, "*.youtube.com")             ||
    shExpMatch(host, "*.googlevideo.com")         ||
    shExpMatch(host, "*.ytimg.com")               ||
    shExpMatch(host, "*.youtubei.googleapis.com")
  ){
    return "DIRECT";
  }

  // ---- Shahid ----
  if (
    shExpMatch(host, "*.shahid.net")     ||
    shExpMatch(host, "*.shahid.mbc.net") ||
    shExpMatch(host, "*.mbc.net")
  ){
    return "DIRECT";
  }

  // =====================================================
  // === 1) قواعد PUBG: MATCH (المباريات)              ===
  // =====================================================
  if(
    urlMatch(url,URL_PATTERNS.MATCH) || hostMatch(host,PUBG_DOMAINS.MATCH) ||
    shExpMatch(url,"*/game/join*")   || shExpMatch(url,"*/game/start*")    ||
    shExpMatch(url,"*/matchmaking/*")|| shExpMatch(url,"*/mms/*")
  ){
    return enforcePolicy("MATCH", host);
  }

  // =====================================================
  // === 2) اللوبي + البحث عن الفرق                    ===
  // =====================================================
  if(
    urlMatch(url,URL_PATTERNS.LOBBY)          || hostMatch(host,PUBG_DOMAINS.LOBBY) ||
    urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH) || hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
    shExpMatch(url,"*/status/heartbeat*")     || shExpMatch(url,"*/friends/*")      ||
    shExpMatch(url,"*/teamfinder/*")          || shExpMatch(url,"*/recruit/*")
  ){
    return enforcePolicy("LOBBY", host);
  }

  // =====================================================
  // === 3) التحديثات و CDN                            ===
  // =====================================================
  if(
    urlMatch(url,URL_PATTERNS.UPDATES) || urlMatch(url,URL_PATTERNS.CDN) ||
    hostMatch(host,PUBG_DOMAINS.UPDATES) || hostMatch(host,PUBG_DOMAINS.CDN)
  ){
    return enforcePolicy("LOBBY", host);
  }

  // =====================================================
  // === 4) كل شيء آخر                                ===
  // =====================================================
  return enforcePolicy("LOBBY", host);
}
