// JO-ULTRA-JO-ONLY PAC — PUBG Jordan Focus
// - يزيد احتمال أن يكون الفريق + الخصم من داخل الأردن
// - MATCH / RECRUIT_SEARCH: حظر تام لأي سيرفر غير أردني → اللعبة تعيد البحث

//================== نطاقات IPv4 كـ CIDR ==================//
var JO_V4_CIDR = [
  { base: "2.59.52.0", mask: 22 },
  { base: "5.45.128.0", mask: 20 },
  { base: "5.198.240.0", mask: 21 },
  { base: "5.199.184.0", mask: 22 },
  { base: "37.17.192.0", mask: 20 },
  { base: "37.44.32.0", mask: 21 },
  { base: "37.75.144.0", mask: 21 },
  { base: "37.123.64.0", mask: 19 },
  { base: "37.152.0.0", mask: 21 },
  { base: "37.202.64.0", mask: 18 },
  { base: "37.220.112.0", mask: 20 },
  { base: "37.252.222.0", mask: 24 },
  { base: "45.142.196.0", mask: 22 },
  { base: "46.23.112.0", mask: 20 },
  { base: "46.32.96.0", mask: 19 },
  { base: "46.185.128.0", mask: 17 },
  { base: "46.248.192.0", mask: 19 },
  { base: "62.72.160.0", mask: 19 },
  { base: "77.245.0.0", mask: 20 },
  { base: "79.134.128.0", mask: 19 },
  { base: "79.173.192.0", mask: 18 },
  { base: "80.90.160.0", mask: 20 },
  { base: "81.21.0.0", mask: 20 },
  { base: "81.28.112.0", mask: 20 },
  { base: "82.212.64.0", mask: 18 },
  { base: "84.18.32.0", mask: 19 },
  { base: "84.18.64.0", mask: 19 },
  { base: "84.252.106.0", mask: 24 },
  { base: "85.159.216.0", mask: 21 },
  { base: "86.108.0.0", mask: 17 },
  { base: "87.236.232.0", mask: 21 },
  { base: "87.238.128.0", mask: 21 },
  { base: "89.20.49.0", mask: 24 },
  { base: "89.28.216.0", mask: 21 },
  { base: "89.38.152.0", mask: 23 },
  { base: "91.106.96.0", mask: 20 },
  { base: "91.132.100.0", mask: 24 },
  { base: "91.186.224.0", mask: 19 },
  { base: "91.212.0.0", mask: 24 },
  { base: "91.223.202.0", mask: 24 },
  { base: "92.241.32.0", mask: 19 },
  { base: "92.253.0.0", mask: 17 },
  { base: "93.93.144.0", mask: 21 },
  { base: "93.95.200.0", mask: 21 },
  { base: "93.115.2.0", mask: 24 },
  { base: "93.115.3.0", mask: 24 },
  { base: "93.115.15.0", mask: 24 },
  { base: "93.191.176.0", mask: 21 },
  { base: "94.127.208.0", mask: 21 },
  { base: "94.142.32.0", mask: 19 },
  { base: "94.249.0.0", mask: 17 },
  { base: "95.141.208.0", mask: 20 },
  { base: "95.172.192.0", mask: 19 },
  { base: "109.107.224.0", mask: 19 },
  { base: "109.237.192.0", mask: 20 },
  { base: "141.0.0.0", mask: 21 },
  { base: "141.98.64.0", mask: 22 },
  { base: "141.105.56.0", mask: 21 },
  { base: "146.19.239.0", mask: 24 },
  { base: "146.19.246.0", mask: 24 },
  { base: "149.200.128.0", mask: 17 },
  { base: "176.28.128.0", mask: 17 },
  { base: "176.29.0.0", mask: 16 },
  { base: "176.57.0.0", mask: 19 },
  { base: "176.57.48.0", mask: 20 },
  { base: "176.118.39.0", mask: 24 },
  { base: "176.241.64.0", mask: 21 },
  { base: "178.20.184.0", mask: 21 },
  { base: "178.77.128.0", mask: 18 },
  { base: "178.238.176.0", mask: 20 },
  { base: "185.10.216.0", mask: 22 },
  { base: "185.12.244.0", mask: 22 },
  { base: "185.14.132.0", mask: 22 },
  { base: "185.19.112.0", mask: 22 },
  { base: "185.24.128.0", mask: 22 },
  { base: "185.30.248.0", mask: 22 },
  { base: "185.33.28.0", mask: 22 },
  { base: "185.40.19.0", mask: 24 },
  { base: "185.43.146.0", mask: 24 },
  { base: "185.51.212.0", mask: 22 },
  { base: "185.57.120.0", mask: 22 },
  { base: "185.80.24.0", mask: 22 },
  { base: "185.80.104.0", mask: 22 },
  { base: "185.98.220.0", mask: 22 },
  { base: "185.98.224.0", mask: 22 },
  { base: "185.109.120.0", mask: 22 },
  { base: "185.109.192.0", mask: 22 },
  { base: "185.135.200.0", mask: 22 },
  { base: "185.139.220.0", mask: 22 },
  { base: "185.159.180.0", mask: 22 },
  { base: "185.160.236.0", mask: 22 },
  { base: "185.163.205.0", mask: 24 },
  { base: "185.173.56.0", mask: 22 },
  { base: "185.175.248.0", mask: 22 },
  { base: "185.176.44.0", mask: 22 },
  { base: "185.180.80.0", mask: 22 },
  { base: "185.182.136.0", mask: 22 },
  { base: "185.193.176.0", mask: 22 },
  { base: "185.197.176.0", mask: 22 },
  { base: "185.200.128.0", mask: 22 },
  { base: "185.234.111.0", mask: 24 },
  { base: "185.241.62.0", mask: 24 },
  { base: "185.253.112.0", mask: 22 },
  { base: "188.123.160.0", mask: 19 },
  { base: "188.247.64.0", mask: 19 },
  { base: "193.188.64.0", mask: 19 },
  { base: "193.203.24.0", mask: 23 },
  { base: "193.203.110.0", mask: 23 },
  { base: "194.104.95.0", mask: 24 },
  { base: "194.165.128.0", mask: 19 },
  { base: "195.18.9.0", mask: 24 },
  { base: "212.34.0.0", mask: 19 },
  { base: "212.35.64.0", mask: 19 },
  { base: "212.118.0.0", mask: 19 },
  { base: "213.139.32.0", mask: 19 },
  { base: "213.186.160.0", mask: 19 },
  { base: "217.23.32.0", mask: 20 },
  { base: "217.29.240.0", mask: 20 },
  { base: "217.144.0.0", mask: 20 },
  { base: "91.209.248.0", mask: 24 },
  { base: "91.220.195.0", mask: 24 },
  { base: "193.17.53.0", mask: 24 },
  { base: "193.108.134.0", mask: 23 },
  { base: "193.111.29.0", mask: 24 },
  { base: "193.189.148.0", mask: 24 },
  { base: "194.110.236.0", mask: 24 }
];

//================== IPv6 prefixes الأردن ==================//
var JO_V6_PREFIX = {
  LOBBY: [
    "2001:32c0::/29",
    "2a00:18d0::/32",
    "2a00:18d8::/29",
    "2a00:4620::/32",
    "2a00:76e0::/32",
    "2a00:b860::/32",
    "2a00:caa0::/32",
    "2a01:1d0::/29",
    "2a01:9700::/29",
    "2a01:e240::/29",
    "2a01:ee40::/29",
    "2a02:9c0::/29",
    "2a02:2558::/29",
    "2a02:25d8::/32",
    "2a02:5b60::/32",
    "2a02:c040::/29",
    "2a02:e680::/29",
    "2a02:f0c0::/29",
    "2a03:6b00::/29",
    "2a03:6d00::/32",
    "2a03:b640::/32",
    "2a04:6200::/29",
    "2a05:74c0::/29",
    "2a05:7500::/29",
    "2a06:9bc0::/29",
    "2a06:bd80::/29",
    "2a07:140::/29",
    "2a0a:2740::/29",
    "2a0c:39c0::/29",
    "2a0d:cf40::/29",
    "2a10:1100::/29",
    "2a10:9740::/29",
    "2a10:d800::/29",
    "2a11:d180::/29",
    "2a13:1f00::/29",
    "2a13:5c00::/29",
    "2a13:8d40::/29",
    "2a14:1a40::/29",
    "2a14:2840::/29",
    "2001:67c:2124::/48"
  ],
  MATCH: [
    "2001:32c0::/29",
    "2a00:18d0::/32",
    "2a00:18d8::/29",
    "2a00:4620::/32",
    "2a00:76e0::/32",
    "2a00:b860::/32",
    "2a00:caa0::/32",
    "2a01:1d0::/29",
    "2a01:9700::/29",
    "2a01:e240::/29",
    "2a01:ee40::/29",
    "2a02:9c0::/29",
    "2a02:2558::/29",
    "2a02:25d8::/32",
    "2a02:5b60::/32",
    "2a02:c040::/29",
    "2a02:e680::/29",
    "2a02:f0c0::/29",
    "2a03:6b00::/29",
    "2a03:6d00::/32",
    "2a03:b640::/32",
    "2a04:6200::/29",
    "2a05:74c0::/29",
    "2a05:7500::/29",
    "2a06:9bc0::/29",
    "2a06:bd80::/29",
    "2a07:140::/29",
    "2a0a:2740::/29",
    "2a0c:39c0::/29",
    "2a0d:cf40::/29",
    "2a10:1100::/29",
    "2a10:9740::/29",
    "2a10:d800::/29",
    "2a11:d180::/29",
    "2a13:1f00::/29",
    "2a13:5c00::/29",
    "2a13:8d40::/29",
    "2a14:1a40::/29",
    "2a14:2840::/29",
    "2001:67c:2124::/48"
  ],
  RECRUIT_SEARCH: [
    "2001:32c0::/29",
    "2a00:18d0::/32",
    "2a00:18d8::/29",
    "2a00:4620::/32",
    "2a00:76e0::/32",
    "2a00:b860::/32",
    "2a00:caa0::/32",
    "2a01:1d0::/29",
    "2a01:9700::/29",
    "2a01:e240::/29",
    "2a01:ee40::/29",
    "2a02:9c0::/29",
    "2a02:2558::/29",
    "2a02:25d8::/32",
    "2a02:5b60::/32",
    "2a02:c040::/29",
    "2a02:e680::/29",
    "2a02:f0c0::/29",
    "2a03:6b00::/29",
    "2a03:6d00::/32",
    "2a03:b640::/32",
    "2a04:6200::/29",
    "2a05:74c0::/29",
    "2a05:7500::/29",
    "2a06:9bc0::/29",
    "2a06:bd80::/29",
    "2a07:140::/29",
    "2a0a:2740::/29",
    "2a0c:39c0::/29",
    "2a0d:cf40::/29",
    "2a10:1100::/29",
    "2a10:9740::/29",
    "2a10:d800::/29",
    "2a11:d180::/29",
    "2a13:1f00::/29",
    "2a13:5c00::/29",
    "2a13:8d40::/29",
    "2a14:1a40::/29",
    "2a14:2840::/29",
    "2001:67c:2124::/48"
  ],
  UPDATES: [
    "2001:32c0::/29",
    "2a00:18d0::/32",
    "2a00:18d8::/29",
    "2a00:4620::/32",
    "2a00:76e0::/32",
    "2a00:b860::/32",
    "2a00:caa0::/32",
    "2a01:1d0::/29",
    "2a01:9700::/29",
    "2a01:e240::/29",
    "2a01:ee40::/29",
    "2a02:9c0::/29",
    "2a02:2558::/29",
    "2a02:25d8::/32",
    "2a02:5b60::/32",
    "2a02:c040::/29",
    "2a02:e680::/29",
    "2a02:f0c0::/29",
    "2a03:6b00::/29",
    "2a03:6d00::/32",
    "2a03:b640::/32",
    "2a04:6200::/29",
    "2a05:74c0::/29",
    "2a05:7500::/29",
    "2a06:9bc0::/29",
    "2a06:bd80::/29",
    "2a07:140::/29",
    "2a0a:2740::/29",
    "2a0c:39c0::/29",
    "2a0d:cf40::/29",
    "2a10:1100::/29",
    "2a10:9740::/29",
    "2a10:d800::/29",
    "2a11:d180::/29",
    "2a13:1f00::/29",
    "2a13:5c00::/29",
    "2a13:8d40::/29",
    "2a14:1a40::/29",
    "2a14:2840::/29",
    "2001:67c:2124::/48"
  ],
  CDN: [
    "2001:32c0::/29",
    "2a00:18d0::/32",
    "2a00:18d8::/29",
    "2a00:4620::/32",
    "2a00:76e0::/32",
    "2a00:b860::/32",
    "2a00:caa0::/32",
    "2a01:1d0::/29",
    "2a01:9700::/29",
    "2a01:e240::/29",
    "2a01:ee40::/29",
    "2a02:9c0::/29",
    "2a02:2558::/29",
    "2a02:25d8::/32",
    "2a02:5b60::/32",
    "2a02:c040::/29",
    "2a02:e680::/29",
    "2a02:f0c0::/29",
    "2a03:6b00::/29",
    "2a03:6d00::/32",
    "2a03:b640::/32",
    "2a04:6200::/29",
    "2a05:74c0::/29",
    "2a05:7500::/29",
    "2a06:9bc0::/29",
    "2a06:bd80::/29",
    "2a07:140::/29",
    "2a0a:2740::/29",
    "2a0c:39c0::/29",
    "2a0d:cf40::/29",
    "2a10:1100::/29",
    "2a10:9740::/29",
    "2a10:d800::/29",
    "2a11:d180::/29",
    "2a13:1f00::/29",
    "2a13:5c00::/29",
    "2a13:8d40::/29",
    "2a14:1a40::/29",
    "2a14:2840::/29",
    "2001:67c:2124::/48"
  ]
};

//================== إعدادات البروكسي ==================//
var PROXY_CANDIDATES = [
  "212.35.66.45"
];
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

var STRICT_BLOCK = false;

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

function hostMatch(h,arr){h=lc(h||"");if(!h)return false;for(var i=0;i<arr.length;i++){var p=arr[i];if(shExpMatch(h,p))return true;if(p.indexOf("*.")==0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
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
  var subs=C._JO_V4CIDR;
  for(var i=0;i<subs.length;i++){
    var s=subs[i];
    if(((ipInt & s.mask)>>>0) === s.net) return true;
  }
  return false;
}

// IPv6
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

// قياس latency بسيط للبروكسي
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

//================== Checks ==================//
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

function isUnsafeHost(h){
  if(!h) return true;
  if(isPlainHostName(h)) return true;
  if(shExpMatch(h,"*.local") || shExpMatch(h,"*.lan")) return true;
  return false;
}

//================== القلب: سياسة الأردن القوية ==================//
function enforceCat(cat, host){
  var ip = host;
  if(!isIp4(ip) && !isIp6Literal(ip)){
    if(isUnsafeHost(host)) return (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor(cat));
    ip = dnsCached(host);
  }

  var isJOdest = false;
  if(isIp6Literal(ip) && isJOv6ForCat(ip,cat)) isJOdest = true;
  if(isIp4(ip) && isJOv4(ip)) isJOdest = true;

  // الوجهة أردنية → مرر عبر البروكسي الأردني مع البورت المخصص للفئة
  if(isJOdest) return proxyFor(cat);

  // الوجهة مش أردنية:
  //   MATCH / RECRUIT_SEARCH → حظر تام، لإجبار اللعبة تعيد محاولة على سيرفر أردني
  if(cat === "MATCH" || cat === "RECRUIT_SEARCH"){
    return "PROXY 0.0.0.0:0";
  }

  // باقي الفئات:
  return (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor(cat));
}

//================== الدالة الرئيسية ==================//
function FindProxyForURL(url, host){
  host = lc(host);

  if(!clientIsJO() || !proxyIsJO()) return "PROXY 0.0.0.0:0";

  // 1) MATCH (المباريات نفسها)
  if( urlMatch(url,URL_PATTERNS.MATCH)    ||
      hostMatch(host,PUBG_DOMAINS.MATCH)  ||
      shExpMatch(url,"*/game/join*")      ||
      shExpMatch(url,"*/game/start*")     ||
      shExpMatch(url,"*/matchmaking/*")   ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH", host);
  }

  // 2) LOBBY + RECRUIT_SEARCH (تجنيد + لوبي)
  if( urlMatch(url,URL_PATTERNS.LOBBY)            ||
      hostMatch(host,PUBG_DOMAINS.LOBBY)          ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)   ||
      hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url,"*/status/heartbeat*")       ||
      shExpMatch(url,"*/friends/*")               ||
      shExpMatch(url,"*/teamfinder/*")            ||
      shExpMatch(url,"*/recruit/*")
    ){
    // لوبي/تجنيد → نخضعه لنفس منطق الفئة المعطاة
    if( urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH) ||
        hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) )
      return enforceCat("RECRUIT_SEARCH", host);
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

  // 4) باقي الإنترنت
  return (STRICT_BLOCK ? "PROXY 0.0.0.0:0" : proxyFor("LOBBY"));
}
