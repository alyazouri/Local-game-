// =====================================================
//  JO_PUBG_PURE_56_ONLY.pac
//  - فقط نطاقات /56 الأردنية
//  - أعلى دقة وأقوى أولوية لظهور لاعبين أردنية
//  Proxy: 212.35.66.45
// =====================================================

var PROXY_IP      = "212.35.66.45";
var FORBID_NON_JO = true;
var BLOCK_REPLY   = "PROXY 0.0.0.0:0";

// =====================================================
// 1) PRIVATE / LOCAL
// =====================================================
function isPrivateOrLocal(host) {
    if (isPlainHostName(host)) return true;
    var ip = dnsResolve(host);
    if (!ip) return false;

    if (isInNet(ip,"127.0.0.0","255.0.0.0")) return true;
    if (isInNet(ip,"10.0.0.0","255.0.0.0")) return true;
    if (isInNet(ip,"172.16.0.0","255.240.0.0")) return true;
    if (isInNet(ip,"192.168.0.0","255.255.0.0")) return true;
    if (isInNet(ip,"169.254.0.0","255.255.0.0")) return true;
    if (isInNet(ip,"100.64.0.0","255.192.0.0")) return true;

    return false;
}

// =====================================================
// 2) ONLY /56 INTERVALS
// =====================================================

var JO_V6_INTERVALS = [
  { start: "2001:32c0:1000::", end: "2001:32c0:10ff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2001:32c2:1000::", end: "2001:32c2:10ff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2001:32c3:1000::", end: "2001:32c3:10ff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2001:32c5:1000::", end: "2001:32c5:10ff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2001:32c6:1000::", end: "2001:32c6:10ff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2001:32c7:1000::", end: "2001:32c7:10ff:ffff:ffff:ffff:ffff:ffff" },

  { start: "2a03:6b00:1000::", end: "2a03:6b00:10ff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a03:6b02:1000::", end: "2a03:6b02:10ff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a03:6b03:1000::", end: "2a03:6b03:10ff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a03:6b05:1000::", end: "2a03:6b05:10ff:ffff:ffff:ffff:ffff:ffff" },

  { start: "2a02:9c0:3fff:ff00::", end: "2a02:9c0:3fff:ffff:ffff:ffff:ffff:ffff" },
  { start: "2a02:9c0:4fff:ff00::", end: "2a02:9c0:4fff:ffff:ffff:ffff:ffff:ffff" }
];

// STRONG = نفسهم لأننا نستخدم فقط /56
var STRONG_JO_V6_INTERVALS = JO_V6_INTERVALS.slice();

// =====================================================
// 3) IPv6 HELPERS
// =====================================================

function expandIPv6(address) {
    var zoneIndex = address.indexOf("%");
    if (zoneIndex > 0) address = address.substring(0, zoneIndex);

    var parts = address.split("::");
    var head = parts[0].split(":");
    var tail = (parts.length > 1) ? parts[1].split(":") : [];

    function parsePart(arr) {
        var out = [];
        for (var i=0;i<arr.length;i++)
            if (arr[i]) out.push(parseInt(arr[i],16)||0);
        return out;
    }

    head = parsePart(head);
    tail = parsePart(tail);

    var missing = 8 - (head.length+tail.length);
    var full = [];

    for (var i=0;i<head.length;i++) full.push(head[i]);
    for (var i=0;i<missing;i++) full.push(0);
    for (var i=0;i<tail.length;i++) full.push(tail[i]);

    return full;
}

function cmpIPv6(a,b){
    for (var i=0;i<8;i++){
        if (a[i]<b[i]) return -1;
        if (a[i]>b[i]) return 1;
    }
    return 0;
}

function ip6_in_range(ip,start,end){
    var ipArr=expandIPv6(ip);
    return cmpIPv6(ipArr,expandIPv6(start))>=0 &&
           cmpIPv6(ipArr,expandIPv6(end))<=0;
}

function isJOIPv6(ip){
    if (!ip) return false;
    for (var i=0;i<JO_V6_INTERVALS.length;i++){
        if (ip6_in_range(ip,JO_V6_INTERVALS[i].start,JO_V6_INTERVALS[i].end))
            return true;
    }
    return false;
}

function isStrongJOIPv6(ip){
    if (!ip) return false;
    for (var i=0;i<STRONG_JO_V6_INTERVALS.length;i++){
        if (ip6_in_range(ip,STRONG_JO_V6_INTERVALS[i].start,STRONG_JO_V6_INTERVALS[i].end))
            return true;
    }
    return false;
}

function extractIPv6Host(host){
    if (!host) return null;
    if (host.charAt(0)==="[") return host.substring(1,host.indexOf("]"));
    if (host.indexOf(":")>=0 && host.indexOf(".")<0) return host;
    return null;
}

// =====================================================
// 4) PUBG SIGNATURES
// =====================================================

var GAME_DOMAINS=[
  "igamecj.com","igamepubg.com","pubgmobile.com","tencentgames.com",
  "proximabeta.com","proximabeta.net","qcloudcdn.com","tencentyun.com",
  "qcloud.com","gtimg.com","game.qq.com","gameloop.com",
  "cdn-ota.qq.com","cdngame.tencentyun.com"
];

var KEYWORDS=["pubg","tencent","igame","proximabeta","qcloud","tencentyun",
              "gcloud","gameloop","match","squad","party","team","rank","room"];

function hostMatchesGameDomain(host){
    if (!host) return false;
    var h=host.toLowerCase();
    for (var i=0;i<GAME_DOMAINS.length;i++){
        var d=GAME_DOMAINS[i];
        if (dnsDomainIs(h,d) || shExpMatch(h,"*."+d)) return true;
    }
    return false;
}

function urlHasKeywords(url){
    var u=url.toLowerCase();
    for (var i=0;i<KEYWORDS.length;i++)
        if (u.indexOf(KEYWORDS[i])!==-1) return true;
    return false;
}

function isPubgTraffic(url,host){
    return hostMatchesGameDomain(host) || urlHasKeywords(url);
}

// =====================================================
// 5) MODES + PORTS
// =====================================================

function detectMode(url){
    var u=url.toLowerCase();
    if (u.includes("match")||u.includes("squad")||u.includes("rank")||u.includes("team"))
        return "MATCH";
    if (u.includes("recruit")||u.includes("party")||u.includes("room"))
        return "RECRUIT_SEARCH";
    if (u.includes("update")||u.includes("patch")||u.includes("ota"))
        return "UPDATES";
    if (u.includes("cdn")||u.includes("asset"))
        return "CDNS";
    return "LOBBY";
}

var PORTS={
    LOBBY:          8443,
    MATCH:          20001,
    RECRUIT_SEARCH: 10012,
    UPDATES:        8080,
    CDNS:           28080
};

function buildProxy(mode){
    var p=PORTS[mode]||PORTS.LOBBY;
    return "PROXY "+PROXY_IP+":"+p;
}

// =====================================================
// 6) MAIN
// =====================================================

function FindProxyForURL(url,host){

    if (isPrivateOrLocal(host))
        return buildProxy("LOBBY");

    var ipv6=extractIPv6Host(host);
    var isGame=isPubgTraffic(url,host);
    var jo=ipv6?isJOIPv6(ipv6):false;
    var strong=ipv6?isStrongJOIPv6(ipv6):false;

    if (ipv6 && !jo && FORBID_NON_JO)
        return BLOCK_REPLY;

    if (isGame){
        var mode=detectMode(url);
        if (strong) return buildProxy(mode);
        if (jo)     return buildProxy("LOBBY");
        return buildProxy(mode);
    }

    return buildProxy("LOBBY");
}
