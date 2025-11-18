function FindProxyForURL(url, host) {

  // STRICT_JO_ROUTERS
  // JO_V4_PREFIXES = نطاقات أردنية (مسارات تم اكتشافها لايف، مدموجة /22)

  var JO_PROXY_HOST   = "37.220.120.16";
  var PORT_LOBBY      = 10010;
  var PORT_MATCH      = 20001;
  var PORT_RECRUIT    = 12000;
  var PORT_UPDATES    = 443;
  var PORT_CDN        = 443;
  var STICKY_MINUTES  = 10;

  var JO_V4_PREFIXES = [
    "37.202.76.0/22",
    "37.202.84.0/22",
    "37.202.100.0/22",
    "37.202.116.0/22",
    "37.202.124.0/22",
    "37.220.120.0/22",
    "37.220.124.0/22",
    "46.23.112.0/22",
    "46.23.120.0/22",
    "46.23.124.0/22",
    "46.32.96.0/22",
    "46.32.100.0/22",
    "46.32.104.0/22",
    "46.32.108.0/22",
    "46.32.112.0/22",
    "46.32.116.0/22",
    "46.32.120.0/22",
    "46.185.128.0/22",
    "46.185.132.0/22",
    "46.185.136.0/22",
    "46.185.160.0/22",
    "46.185.164.0/22",
    "46.185.176.0/22",
    "46.185.184.0/22",
    "46.185.192.0/22",
    "46.185.196.0/22",
    "46.185.208.0/22",
    "46.185.216.0/22",
    "46.185.228.0/22",
    "46.248.192.0/22",
    "62.72.160.0/22",
    "62.72.164.0/22",
    "62.72.176.0/22",
    "62.72.180.0/22",
    "62.72.184.0/22",
    "62.72.188.0/22",
    "77.245.0.0/22",
    "77.245.4.0/22",
    "77.245.8.0/22",
    "77.245.12.0/22",
    "79.134.128.0/22",
    "79.134.132.0/22",
    "79.134.136.0/22",
    "79.134.140.0/22",
    "79.134.144.0/22",
    "79.134.148.0/22",
    "79.134.152.0/22",
    "79.134.156.0/22",
    "79.173.212.0/22",
    "79.173.216.0/22",
    "79.173.220.0/22",
    "79.173.228.0/22",
    "79.173.232.0/22",
    "79.173.248.0/22",
    "79.173.252.0/22",
    "80.90.160.0/22",
    "80.90.164.0/22",
    "80.90.168.0/22",
    "80.90.172.0/22",
    "81.21.4.0/22",
    "81.21.8.0/22",
    "81.21.12.0/22",
    "81.28.120.0/22",
    "81.28.124.0/22",
    "82.212.64.0/22",
    "82.212.68.0/22",
    "82.212.72.0/22",
    "82.212.76.0/22",
    "82.212.80.0/22",
    "82.212.84.0/22",
    "82.212.88.0/22",
    "82.212.92.0/22",
    "82.212.96.0/22",
    "82.212.100.0/22",
    "82.212.104.0/22",
    "82.212.108.0/22",
    "82.212.112.0/22",
    "82.212.120.0/22",
    "82.212.124.0/22",
    "84.18.32.0/22",
    "84.18.40.0/22",
    "86.108.4.0/22",
    "86.108.8.0/22",
    "86.108.12.0/22",
    "86.108.32.0/22",
    "86.108.52.0/22",
    "86.108.76.0/22",
    "86.108.108.0/22",
    "91.106.96.0/22",
    "91.106.104.0/22",
    "91.106.108.0/22",
    "92.241.36.0/22",
    "92.241.52.0/22",
    "92.253.20.0/22",
    "92.253.48.0/22",
    "92.253.72.0/22",
    "92.253.92.0/22",
    "92.253.100.0/22",
    "92.253.104.0/22",
    "92.253.108.0/22",
    "92.253.112.0/22",
    "92.253.116.0/22",
    "92.253.120.0/22",
    "92.253.124.0/22",
    "94.142.32.0/22",
    "94.142.36.0/22",
    "94.142.40.0/22",
    "94.142.48.0/22",
    "94.142.52.0/22",
    "94.142.60.0/22",
    "94.249.0.0/22",
    "94.249.56.0/22",
    "94.249.60.0/22",
    "94.249.68.0/22",
    "94.249.76.0/22",
    "94.249.80.0/22",
    "94.249.84.0/22",
    "94.249.88.0/22",
    "94.249.96.0/22",
    "94.249.112.0/22",
    "94.249.124.0/22",
    "109.107.232.0/22",
    "109.107.236.0/22",
    "109.107.240.0/22",
    "109.107.244.0/22",
    "109.107.248.0/22"
  ];

  var BYPASS_DOMAINS = [
    "raw.githubusercontent.com",
    "github.com",
    "gitlab.com",
    "bitbucket.org"
  ];

  var YT_DOMAINS = [
    "youtube.com","youtu.be","googlevideo.com","ytimg.com","youtube-nocookie.com"
  ];

  var PUBG_DOMAINS = {
    LOBBY: [
      "*.pubgmobile.com","*.pubgmobile.net",
      "*.proximabeta.com","*.igamecj.com"
    ],
    MATCH: [
      "*.gcloud.qq.com","gpubgm.com",
      "*.igamecj.com","*.proximabeta.com"
    ],
    RECRUIT: [
      "match.igamecj.com","match.proximabeta.com",
      "teamfinder.igamecj.com","teamfinder.proximabeta.com",
      "clan.igamecj.com"
    ],
    UPDATES: [
      "cdn.pubgmobile.com","updates.pubgmobile.com",
      "patch.igamecj.com","hotfix.proximabeta.com",
      "dlied1.qq.com","dlied2.qq.com"
    ],
    CDNs: [
      "cdn.igamecj.com","cdn.proximabeta.com",
      "cdn.tencentgames.com",
      "*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"
    ]
  };

  var URL_PATTERNS = {
    LOBBY: [
      "*/account/login*","*/client/version*",
      "*/status/heartbeat*","*/presence/*","*/friends/*"
    ],
    MATCH: [
      "*/matchmaking/*","*/mms/*",
      "*/game/start*","*/game/join*",
      "*/report/battle*"
    ],
    RECRUIT: [
      "*/teamfinder/*","*/clan/*",
      "*/social/*","*/search/*","*/recruit/*"
    ],
    UPDATES: [
      "*/patch*","*/update*","*/hotfix*",
      "*/download*","*/assets/*","*/assetbundle*","*/obb*"
    ],
    CDNs: [
      "*/cdn/*","*/image/*","*/media/*",
      "*/video/*","*/res/*","*/pkg/*"
    ]
  };

  function proxyLine(port) {
    return "SOCKS5 " + JO_PROXY_HOST + ":" + port;
  }

  function matchDomain(h, list) {
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (p.indexOf("*") >= 0) {
        if (shExpMatch(h, p)) return true;
      } else {
        if (dnsDomainIs(h, p)) return true;
      }
    }
    return false;
  }

  function matchURL(u, list) {
    for (var i = 0; i < list.length; i++) {
      if (shExpMatch(u, list[i])) return true;
    }
    return false;
  }

  function ip4ToInt(ip) {
    var p = ip.split('.');
    return ((p[0]<<24)>>>0) + (p[1]<<16) + (p[2]<<8) + (p[3]>>>0);
  }

  function inCidrV4(ip, cidr) {
    var a = cidr.split('/');
    var base = a[0];
    var bits = (a.length > 1) ? parseInt(a[1], 10) : 32;
    var ipInt = ip4ToInt(ip);
    var baseInt = ip4ToInt(base);
    var mask = bits === 0 ? 0 : ((~((1 << (32-bits)) - 1)) >>> 0);
    return (ipInt & mask) === (baseInt & mask);
  }

  function isJO(ip) {
    if (!ip || ip.indexOf('.') < 0) return false;
    for (var i = 0; i < JO_V4_PREFIXES.length; i++) {
      if (inCidrV4(ip, JO_V4_PREFIXES[i])) return true;
    }
    return false;
  }

  if (typeof _stickyCache === "undefined") {
    var _stickyCache = {};
  }

  function nowMin() {
    return Math.floor((new Date()).getTime() / 60000);
  }

  function stickyGet(h) {
    var e = _stickyCache[h];
    if (!e) return null;
    if (nowMin() - e.t > STICKY_MINUTES) return null;
    return e.v;
  }

  function stickyPut(h, v) {
    _stickyCache[h] = { t: nowMin(), v: v };
  }

  if (matchDomain(host, BYPASS_DOMAINS)) return "DIRECT";
  if (matchDomain(host, YT_DOMAINS))    return "DIRECT";

  var cached = stickyGet(host);
  if (cached) return cached;

  var ip = dnsResolve(host);
  var jo = isJO(ip);

  function decideFor(port) {
    var out;
    if (jo) {
      out = "DIRECT";
    } else {
      out = proxyLine(port);
    }
    stickyPut(host, out);
    return out;
  }

  if (matchDomain(host, PUBG_DOMAINS.MATCH) || matchURL(url, URL_PATTERNS.MATCH)) {
    return decideFor(PORT_MATCH);
  }
  if (matchDomain(host, PUBG_DOMAINS.RECRUIT) || matchURL(url, URL_PATTERNS.RECRUIT)) {
    return decideFor(PORT_RECRUIT);
  }
  if (matchDomain(host, PUBG_DOMAINS.LOBBY) || matchURL(url, URL_PATTERNS.LOBBY)) {
    return decideFor(PORT_LOBBY);
  }
  if (matchDomain(host, PUBG_DOMAINS.UPDATES) || matchURL(url, URL_PATTERNS.UPDATES)) {
    return decideFor(PORT_UPDATES);
  }
  if (matchDomain(host, PUBG_DOMAINS.CDNs) || matchURL(url, URL_PATTERNS.CDNs)) {
    return decideFor(PORT_CDN);
  }

  if (jo) {
    stickyPut(host, "DIRECT");
    return "DIRECT";
  }

  stickyPut(host, "DIRECT");
  return "DIRECT";
}
