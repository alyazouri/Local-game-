// =====================================================
//  JO_PUBG_JO_LOCK.pac
//  - هدفه: حصر PUBG قدر الإمكان داخل النطاقات المعرّفة
//  - كل IPv6 literal خارجها يتم منعه
//  - كل PUBG يمر عبر بروكسي 212.35.66.45
// =====================================================

var PROXY_IP      = "212.35.66.45";
var FORBID_NON_JO = true;           // يمنع أي IPv6 literal خارج النطاقات
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
// 2) JO_V6_INTERVALS — النطاقات التي تعتبر "مسموح / أردنية قوية"
// =====================================================

var JO_V6_INTERVALS = [
  { prefix: "2a00:18d8:2000::/32", start: "2a00:18d8::",       end: "2a00:18d8:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a00:18d9::/32",      start: "2a00:18d9::",       end: "2a00:18d9:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a00:18da::/32",      start: "2a00:18da::",       end: "2a00:18da:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a01:9700::/32",      start: "2a01:9700::",       end: "2a01:9700:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a01:9701::/32",      start: "2a01:9701::",       end: "2a01:9701:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:1800::/29",      start: "2a02:1800::",       end: "2a02:1807:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:2f00::/29",      start: "2a02:2f00::",       end: "2a02:2f07:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:800::/29",       start: "2a02:800::",        end: "2a02:807:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:8000::/29",      start: "2a02:8000::",       end: "2a02:8007:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:840::/29",       start: "2a02:840::",        end: "2a02:847:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:880::/29",       start: "2a02:880::",        end: "2a02:887:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:8c0::/29",       start: "2a02:8c0::",        end: "2a02:8c7:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:900::/29",       start: "2a02:900::",        end: "2a02:907:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:9c0::/32",       start: "2a02:9c0::",        end: "2a02:9c0:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:a00::/29",       start: "2a02:a00::",        end: "2a02:a07:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:be0::/29",       start: "2a02:be0::",        end: "2a02:be7:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:bf0::/29",       start: "2a02:bf0::",        end: "2a02:bf7:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a03:b640::/29",      start: "2a03:b640::",       end: "2a03:b647:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a03:b640:1000::/40", start: "2a03:b640:1000::",  end: "2a03:b640:10ff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a03:b641::/32",      start: "2a03:b641::",       end: "2a03:b641:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a03:b642::/32",      start: "2a03:b642::",       end: "2a03:b642:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0d:1000::/32",      start: "2a0d:1000::",       end: "2a0d:1000:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0d:1001::/32",      start: "2a0d:1001::",       end: "2a0d:1001:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0d:3a00::/32",      start: "2a0d:3a00::",       end: "2a0d:3a00:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0d:3a01::/32",      start: "2a0d:3a01::",       end: "2a0d:3a01:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0d:8d80::/32",      start: "2a0d:8d80::",       end: "2a0d:8d80:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0d:8d81::/32",      start: "2a0d:8d81::",       end: "2a0d:8d81:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0d:8d82::/32",      start: "2a0d:8d82::",       end: "2a0d:8d82:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0e:1c00::/32",      start: "2a0e:1c00::",       end: "2a0e:1c00:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0e:1c01::/32",      start: "2a0e:1c01::",       end: "2a0e:1c01:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0e:97c0::/32",      start: "2a0e:97c0::",       end: "2a0e:97c0:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0e:97c1::/32",      start: "2a0e:97c1::",       end: "2a0e:97c1:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0e:fc00::/29",      start: "2a0e:fc00::",       end: "2a0e:fc07:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a0e:fc01::/32",      start: "2a0e:fc01::",       end: "2a0e:fc01:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a10:b9c0::/29",      start: "2a10:b9c0::",       end: "2a10:b9c7:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a10:b9c1::/32",      start: "2a10:b9c1::",       end: "2a10:b9c1:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a14:c4c0::/29",      start: "2a14:c4c0::",       end: "2a14:c4c7:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a14:c4c1::/32",      start: "2a14:c4c1::",       end: "2a14:c4c1:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a14:c4c2::/32",      start: "2a14:c4c2::",       end: "2a14:c4c2:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2001:67c:27c0::/48",  start: "2001:67c:27c0::",   end: "2001:67c:27c0:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2001:67c:27c1::/48",  start: "2001:67c:27c1::",   end: "2001:67c:27c1:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2001:67c:27c4::/48",  start: "2001:67c:27c4::",   end: "2001:67c:27c4:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:1801::/32",      start: "2a02:1801::",       end: "2a02:1801:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:1802::/32",      start: "2a02:1802::",       end: "2a02:1802:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:1803::/32",      start: "2a02:1803::",       end: "2a02:1803:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:1804::/32",      start: "2a02:1804::",       end: "2a02:1804:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:2f01::/32",      start: "2a02:2f01::",       end: "2a02:2f01:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:2f02::/32",      start: "2a02:2f02::",       end: "2a02:2f02:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:2f03::/32",      start: "2a02:2f03::",       end: "2a02:2f03:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:2f04::/32",      start: "2a02:2f04::",       end: "2a02:2f04:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:801::/32",       start: "2a02:801::",        end: "2a02:801:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:841::/32",       start: "2a02:841::",        end: "2a02:841:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:881::/32",       start: "2a02:881::",        end: "2a02:881:ffff:ffff:ffff:ffff:ffff:ffff" },
  { prefix: "2a02:901::/32",       start: "2a02:901::",        end: "2a02:901:ffff:ffff:ffff:ffff:ffff:ffff" }
];

// الكل STRONG
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
        for (var i=0;i<arr.length;i++) {
            if (arr[i]) out.push(parseInt(arr[i],16) || 0);
        }
        return out;
    }

    head = parsePart(head);
    tail = parsePart(tail);

    var missing = 8 - (head.length + tail.length);
    var full = [];

    for (var i=0;i<head.length;i++) full.push(head[i]);
    for (var j=0;j<missing;j++)     full.push(0);
    for (var k=0;k<tail.length;k++) full.push(tail[k]);

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
    var ipArr = expandIPv6(ip);
    return (cmpIPv6(ipArr, expandIPv6(start)) >= 0) &&
           (cmpIPv6(ipArr, expandIPv6(end))   <= 0);
}

function isJOIPv6(ip){
    if (!ip) return false;
    for (var i=0;i<JO_V6_INTERVALS.length;i++){
        var r = JO_V6_INTERVALS[i];
        if (ip6_in_range(ip, r.start, r.end))
            return true;
    }
    return false;
}

function isStrongJOIPv6(ip){
    if (!ip) return false;
    for (var i=0;i<STRONG_JO_V6_INTERVALS.length;i++){
        var r = STRONG_JO_V6_INTERVALS[i];
        if (ip6_in_range(ip, r.start, r.end))
            return true;
    }
    return false;
}

function extractIPv6Host(host){
    if (!host) return null;
    if (host.charAt(0)==="["){
        var idx = host.indexOf("]");
        if (idx>0) return host.substring(1,idx);
    }
    if (host.indexOf(":")>=0 && host.indexOf(".")<0)
        return host;
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

var KEYWORDS=[
  "pubg","tencent","igame","proximabeta","qcloud","tencentyun",
  "gcloud","gameloop","match","squad","party","team","rank","room"
];

function hostMatchesGameDomain(host){
    if (!host) return false;
    var h=host.toLowerCase();
    for (var i=0;i<GAME_DOMAINS.length;i++){
        var d=GAME_DOMAINS[i];
        if (dnsDomainIs(h,d) || shExpMatch(h,"*."+d))
            return true;
    }
    return false;
}

function urlHasKeywords(url){
    var u=url.toLowerCase();
    for (var i=0;i<KEYWORDS.length;i++){
        if (u.indexOf(KEYWORDS[i])!==-1) return true;
    }
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
    if (u.indexOf("match")!==-1 || u.indexOf("squad")!==-1 ||
        u.indexOf("rank") !==-1 || u.indexOf("team") !==-1)
        return "MATCH";

    if (u.indexOf("recruit")!==-1 || u.indexOf("party")!==-1 ||
        u.indexOf("room")   !==-1)
        return "RECRUIT_SEARCH";

    if (u.indexOf("update")!==-1 || u.indexOf("patch")!==-1 ||
        u.indexOf("ota")   !==-1)
        return "UPDATES";

    if (u.indexOf("cdn")!==-1 || u.indexOf("asset")!==-1)
        return "CDNS";

    return "LOBBY";
}

var PORTS = {
    LOBBY:          8443,
    MATCH:          20001,
    RECRUIT_SEARCH: 10012,
    UPDATES:        8080,
    CDNS:           28080
};

function buildProxy(mode){
    var p = PORTS[mode] || PORTS.LOBBY;
    return "PROXY "+PROXY_IP+":"+p;
}

// =====================================================
// 6) MAIN
// =====================================================

function FindProxyForURL(url,host){

    // 1) Local / Private → نمرره عبر البروكسي (ما في DIRECT)
    if (isPrivateOrLocal(host))
        return buildProxy("LOBBY");

    var ipv6   = extractIPv6Host(host);
    var isGame = isPubgTraffic(url,host);
    var jo     = ipv6 ? isJOIPv6(ipv6)       : false;
    var strong = ipv6 ? isStrongJOIPv6(ipv6) : false;

    // 2) منع أي IPv6 literal برا النطاقات (مش بس PUBG)
    if (ipv6 && !jo && FORBID_NON_JO)
        return BLOCK_REPLY;

    // 3) PUBG TRAFFIC → دايمًا بروكسي + أولويّة للنطاقات
    if (isGame){
        var mode = detectMode(url);

        if (strong) return buildProxy(mode);   // أردني قوي
        if (jo)     return buildProxy("LOBBY"); // أردني عادي
        return buildProxy(mode);               // لو host بدون literal IPv6
    }

    // 4) أي شيء غير PUBG → بروكسي لابي
    return buildProxy("LOBBY");
}
