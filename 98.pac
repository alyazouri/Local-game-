// ===================================================
//  PUBG-JO-PURE-21 (All Blocks Live) PAC — مُولَّد لايف
//  - يعتمد على /21 تم تصنيفها كـ JO_PURE (RDAP + GeoIP + ASN + Online)
//  - الفحص على كتل الأردن + كتل الشرق الأوسط من ipdeny
// ===================================================

var PROXY_CANDIDATES = [
  "91.106.109.12",
  "212.35.66.45"
];

var PROXY_WHITELIST = [
  "91.106.109.12",
  "212.35.66.45"
];

var FIXED_PORT = {
  LOBBY:          443,
  MATCH:          20001,
  RECRUIT_SEARCH: 443,
  UPDATES:        80,
  CDN:            80,
  GENERIC:        443
};

var USE_PROXY_FOR_JO = false;
var STRICT_BLOCK_PUBG_NON_JO = true;

var JO_V4_RANGES = [
  ["5.45.128.0", "5.45.135.255"],
  ["37.202.64.0", "37.202.71.255"],
  ["37.202.72.0", "37.202.79.255"],
  ["37.202.88.0", "37.202.95.255"],
  ["37.202.96.0", "37.202.103.255"],
  ["37.202.104.0", "37.202.111.255"],
  ["37.202.112.0", "37.202.119.255"],
  ["37.202.120.0", "37.202.127.255"],
  ["37.220.120.0", "37.220.127.255"],
  ["46.23.112.0", "46.23.119.255"],
  ["46.23.120.0", "46.23.127.255"],
  ["46.32.96.0", "46.32.103.255"],
  ["46.32.104.0", "46.32.111.255"],
  ["46.32.112.0", "46.32.119.255"],
  ["46.32.120.0", "46.32.127.255"],
  ["46.185.128.0", "46.185.135.255"],
  ["46.185.144.0", "46.185.151.255"],
  ["46.185.152.0", "46.185.159.255"],
  ["46.185.160.0", "46.185.167.255"],
  ["46.185.176.0", "46.185.183.255"],
  ["46.185.184.0", "46.185.191.255"],
  ["46.185.192.0", "46.185.199.255"],
  ["46.185.200.0", "46.185.207.255"],
  ["46.185.208.0", "46.185.215.255"],
  ["46.185.216.0", "46.185.223.255"],
  ["46.185.224.0", "46.185.231.255"],
  ["46.185.232.0", "46.185.239.255"],
  ["46.185.240.0", "46.185.247.255"],
  ["46.185.248.0", "46.185.255.255"],
  ["46.248.192.0", "46.248.199.255"],
  ["46.248.200.0", "46.248.207.255"],
  ["62.72.160.0", "62.72.167.255"],
  ["77.245.0.0", "77.245.7.255"],
  ["79.134.136.0", "79.134.143.255"],
  ["79.173.192.0", "79.173.199.255"],
  ["79.173.200.0", "79.173.207.255"],
  ["79.173.208.0", "79.173.215.255"],
  ["79.173.216.0", "79.173.223.255"],
  ["79.173.224.0", "79.173.231.255"],
  ["79.173.232.0", "79.173.239.255"],
  ["79.173.240.0", "79.173.247.255"],
  ["79.173.248.0", "79.173.255.255"],
  ["80.90.160.0", "80.90.167.255"],
  ["80.90.168.0", "80.90.175.255"],
  ["81.21.0.0", "81.21.7.255"],
  ["81.28.112.0", "81.28.119.255"],
  ["81.28.120.0", "81.28.127.255"],
  ["82.212.72.0", "82.212.79.255"],
  ["82.212.80.0", "82.212.87.255"],
  ["82.212.88.0", "82.212.95.255"],
  ["82.212.96.0", "82.212.103.255"],
  ["82.212.104.0", "82.212.111.255"],
  ["82.212.112.0", "82.212.119.255"],
  ["84.18.32.0", "84.18.39.255"],
  ["84.18.40.0", "84.18.47.255"],
  ["84.18.48.0", "84.18.55.255"],
  ["87.236.232.0", "87.236.239.255"],
  ["92.241.32.0", "92.241.39.255"],
  ["92.241.48.0", "92.241.55.255"],
  ["94.142.32.0", "94.142.39.255"],
  ["94.142.40.0", "94.142.47.255"],
  ["94.142.48.0", "94.142.55.255"],
  ["94.142.56.0", "94.142.63.255"],
  ["94.249.0.0", "94.249.7.255"],
  ["94.249.8.0", "94.249.15.255"],
  ["94.249.16.0", "94.249.23.255"],
  ["94.249.40.0", "94.249.47.255"],
  ["94.249.48.0", "94.249.55.255"],
  ["94.249.56.0", "94.249.63.255"],
  ["94.249.64.0", "94.249.71.255"],
  ["94.249.80.0", "94.249.87.255"],
  ["94.249.88.0", "94.249.95.255"],
  ["94.249.96.0", "94.249.103.255"],
  ["94.249.104.0", "94.249.111.255"],
  ["94.249.112.0", "94.249.119.255"],
  ["94.249.120.0", "94.249.127.255"],
  ["109.107.232.0", "109.107.239.255"],
  ["109.107.240.0", "109.107.247.255"],
];

var EXEMPT_DOMAINS = [
  "*.youtube.com", "youtube.com", "m.youtube.com",
  "youtu.be", "*.googlevideo.com", "*.ytimg.com",
  "shahid.mbc.net", "*.shahid.mbc.net",
  "shahid.net", "*.shahid.net",
  "netflix.com", "*.netflix.com",
  "nflxvideo.net", "*.nflxvideo.net",
  "instagram.com", "*.instagram.com",
  "facebook.com", "*.facebook.com",
  "tiktok.com", "*.tiktok.com",
  "snapchat.com", "*.snapchat.com",
  "telegram.org", "*.telegram.org",
  "t.me", "*.t.me"
];

var EXEMPT_URL_PATTERNS = [
  "*://*.youtube.com/*", "*://youtube.com/*", "*://m.youtube.com/*",
  "*://youtu.be/*", "*://*.googlevideo.com/*", "*://*.ytimg.com/*",
  "*://*.shahid.mbc.net/*", "*://shahid.mbc.net/*",
  "*://*.shahid.net/*", "*://shahid.net/*",
  "*://*.netflix.com/*", "*://netflix.com/*",
  "*://*.instagram.com/*", "*://instagram.com/*",
  "*://*.facebook.com/*", "*://facebook.com/*",
  "*://*.tiktok.com/*", "*://tiktok.com/*",
  "*://*.snapchat.com/*", "*://snapchat.com/*",
  "*://*.telegram.org/*", "*://telegram.org/*", "*://t.me/*"
];

var PUBG_DOMAINS = {
  LOBBY:          ["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com"],
  MATCH:          ["*.gcloud.qq.com", "gpubgm.com"],
  RECRUIT_SEARCH: ["match.igamecj.com", "match.proximabeta.com", "teamfinder.igamecj.com", "teamfinder.proximabeta.com"],
  UPDATES:        ["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com", "hotfix.proximabeta.com", "dlied1.qq.com", "dlied2.qq.com", "gpubgm.com"],
  CDN:            ["cdn.igamecj.com", "cdn.proximabeta.com", "cdn.tencentgames.com", "*.qcloudcdn.com", "*.cloudfront.net", "*.edgesuite.net"]
};

var URL_PATTERNS = {
  LOBBY:          ["*/account/login*", "*/client/version*", "*/status/heartbeat*", "*/presence/*", "*/friends/*"],
  MATCH:          ["*/matchmaking/*", "*/mms/*", "*/game/start*", "*/game/join*", "*/report/battle*"],
  RECRUIT_SEARCH: ["*/teamfinder/*", "*/clan/*", "*/social/*", "*/search/*", "*/recruit/*", "*/recruit/search*", "*/team/invite*", "*/clan/join*"],
  UPDATES:        ["*/patch*", "*/hotfix*", "*/update*", "*/download*", "*/assets/*", "*/assetbundle*", "*/obb*"],
  CDN:            ["*/cdn/*", "*/static/*", "*/media/*"]
};

var DNS_TTL_MS          = 20000;
var PROXY_STICKY_TTL_MS = 60000;

var FAST_DNS_HOSTS = [
  "*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com",
  "*.gcloud.qq.com", "gpubgm.com"
];

var _root = (typeof globalThis !== "undefined" ? globalThis : this);
if (!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;

C.dns       = C.dns       || {};
C.proxyPick = C.proxyPick || { host: null, t: 0 };

function lc(s) { return s && s.toLowerCase ? s.toLowerCase() : s; }
function isIp4(s) { return /^\d+\.\d+\.\d+\.\d+$/.test(s); }

function shMatchAny(h, arr){
  if (!h || !arr) return false;
  for (var i = 0; i < arr.length; i++) {
    var pat = arr[i];
    if (shExpMatch(h, pat)) return true;
    if (pat.indexOf("*.") === 0) {
      var suf = pat.substring(1);
      if (h.length >= suf.length && h.substring(h.length - suf.length) === suf) return true;
    }
  }
  return false;
}

function hostMatch(h, arr){
  h = lc(h || "");
  if (!h) return false;
  return shMatchAny(h, arr);
}

function urlMatch(u, arr){
  if (!u || !arr) return false;
  for (var i = 0; i < arr.length; i++) {
    if (shExpMatch(u, arr[i])) return true;
  }
  return false;
}

function dnsCached(h){
  if (!h) return "";
  if (isIp4(h)) return h;

  var now = (new Date()).getTime();
  var isFast = hostMatch(h, FAST_DNS_HOSTS);
  var ttl = isFast ? 0 : DNS_TTL_MS;

  var e = C.dns[h];
  if (e && ttl > 0 && (now - e.t) < ttl) {
    return e.ip;
  }

  var ip = dnsResolve(h);
  if (!ip) return "";
  if (!isFast) {
    C.dns[h] = { ip: ip, t: now };
  }
  return ip;
}

function ip4ToInt(ip){
  var p = ip.split(".");
  if (p.length !== 4) return 0;
  return (parseInt(p[0],10)<<24)|(parseInt(p[1],10)<<16)|(parseInt(p[2],10)<<8)|parseInt(p[3],10);
}

function isJordanIPv4(ip){
  if (!isIp4(ip)) return false;
  var v = ip4ToInt(ip);
  for (var i = 0; i < JO_V4_RANGES.length; i++) {
    var r = JO_V4_RANGES[i];
    var s = ip4ToInt(r[0]);
    var e = ip4ToInt(r[1]);
    if (v >= s && v <= e) return true;
  }
  return false;
}

function pickProxyHost(){
  var now = (new Date()).getTime();
  if (C.proxyPick.host && (now - C.proxyPick.t) < PROXY_STICKY_TTL_MS) {
    return C.proxyPick.host;
  }

  var list = [];
  for (var i = 0; i < PROXY_CANDIDATES.length; i++) {
    var h = PROXY_CANDIDATES[i];
    if (PROXY_WHITELIST.indexOf(h) !== -1) list.push(h);
  }
  if (list.length === 0) list = PROXY_CANDIDATES.slice();

  var idx = Math.floor(Math.random() * list.length);
  var chosen = list[idx];

  C.proxyPick.host = chosen;
  C.proxyPick.t    = now;
  return chosen;
}

function buildProxyForPhase(phase) {
  var host = pickProxyHost();
  var port = FIXED_PORT[phase] || FIXED_PORT.GENERIC || 443;
  return "PROXY " + host + ":" + port + "; PROXY 212.35.66.45:" + port;
}

function detectPhase(url, host) {
  host = lc(host || "");
  url  = url || "";

  if (hostMatch(host, PUBG_DOMAINS.RECRUIT_SEARCH) || urlMatch(url, URL_PATTERNS.RECRUIT_SEARCH)) return "RECRUIT_SEARCH";
  if (hostMatch(host, PUBG_DOMAINS.MATCH)          || urlMatch(url, URL_PATTERNS.MATCH))         return "MATCH";
  if (hostMatch(host, PUBG_DOMAINS.LOBBY)          || urlMatch(url, URL_PATTERNS.LOBBY))         return "LOBBY";
  if (hostMatch(host, PUBG_DOMAINS.UPDATES)        || urlMatch(url, URL_PATTERNS.UPDATES))       return "UPDATES";
  if (hostMatch(host, PUBG_DOMAINS.CDN)            || urlMatch(url, URL_PATTERNS.CDN))           return "CDN";

  return "GENERIC";
}

function FindProxyForURL(url, host) {
  host = lc(host || "");
  url  = url || "";

  if (hostMatch(host, EXEMPT_DOMAINS) || urlMatch(url, EXEMPT_URL_PATTERNS)) {
    return "DIRECT";
  }

  var phase = detectPhase(url, host);

  if (phase === "GENERIC") {
    return buildProxyForPhase("GENERIC");
  }

  if (phase === "UPDATES" || phase === "CDN") {
    return "DIRECT";
  }

  var ip = dnsCached(host);
  if (!ip) {
    return buildProxyForPhase(phase);
  }

  var isJo = isJordanIPv4(ip);

  if (phase === "MATCH" || phase === "RECRUIT_SEARCH") {
    if (isJo) {
      return USE_PROXY_FOR_JO ? buildProxyForPhase(phase) : "DIRECT";
    } else {
      if (STRICT_BLOCK_PUBG_NON_JO) {
        return "PROXY 0.0.0.0:0";
      } else {
        return buildProxyForPhase(phase);
      }
    }
  }

  if (phase === "LOBBY") {
    if (isJo) {
      return USE_PROXY_FOR_JO ? buildProxyForPhase("LOBBY") : "DIRECT";
    } else {
      return buildProxyForPhase("LOBBY");
    }
  }

  return buildProxyForPhase("GENERIC");
}
