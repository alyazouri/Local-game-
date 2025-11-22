بما أن التحليل أكد أن السكربت الحالي محكم وفعال في فرض المسار الأردني عبر البروكسي (`37.220.120.16`) لجميع حركة المرور الخارجية (والتي ليست محلية أو مستثناة)، مع آلية حظر صارمة لـ IPv6 غير الأردني، فإن النسخة المقدمة هي عملياً النسخة النهائية والمحسّنة لتحقيق هدفك.

السكربت التالي هو النسخة التي قمت بتحليلها، وهي تمثل **السكربت النهائي والمحسّن** لضمان أن كل `route` (مسار) هو مسار أردني عن طريق البروكسي المحدد:

```javascript
// =====================================================
//  JO_PUBG_JO_LOCK.pac - النسخة النهائية المطورة والمؤكدة
//  - حصر وتوجيه كل الترافيك الخارجي عبر البروكسي الأردني
//  - منع أي IPv6 literal يخرج عن النطاقات الأردنية المحددة
//  - توجيه الترافيك الداخلي والمسارات المستثناة مباشرة (DIRECT)
//  Proxy: 37.220.120.16
// =====================================================

var PROXY_IP      = "37.220.120.16";
var FORBID_NON_JO = true;
var BLOCK_REPLY   = "PROXY 0.0.0.0:0"; // طريقة PAC لحظر الاتصال عبر بروكسي غير موجود

// =====================================================
// 1) PRIVATE / LOCAL
// =====================================================
function isPrivateOrLocal(host) {
    if (isPlainHostName(host)) return true;
    var ip = dnsResolve(host);
    if (!ip) return false;

    // IPv4 Private and reserved ranges
    if (isInNet(ip,"127.0.0.0","255.0.0.0")) return true;
    if (isInNet(ip,"10.0.0.0","255.0.0.0")) return true;
    if (isInNet(ip,"172.16.0.0","255.240.0.0")) return true;
    if (isInNet(ip,"192.168.0.0","255.255.0.0")) return true;
    if (isInNet(ip,"169.254.0.0","255.255.0.0")) return true;
    if (isInNet(ip,"100.64.0.0","255.192.0.0")) return true;

    return false;
}

// =====================================================
// 2) JO_V6_INTERVALS — النطاقات الأردنية (لفرض IPv6 Lock)
// =====================================================

var JO_V6_INTERVALS = [
    { "prefix": "2a02:1828:ff60::/44", "start": "2a02:1828:ff60::", "end": "2a02:1828:ff6f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:ff70::/44", "start": "2a02:1828:ff70::", "end": "2a02:1828:ff7f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:ff80::/44", "start": "2a02:1828:ff80::", "end": "2a02:1828:ff8f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:ff90::/44", "start": "2a02:1828:ff90::", "end": "2a02:1828:ff9f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:ffa0::/44", "start": "2a02:1828:ffa0::", "end": "2a02:1828:ffaf:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:ffb0::/44", "start": "2a02:1828:ffb0::", "end": "2a02:1828:ffbf:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:ffc0::/44", "start": "2a02:1828:ffc0::", "end": "2a02:1828:ffcf:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:ffd0::/44", "start": "2a02:1828:ffd0::", "end": "2a02:1828:ffdf:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:ffe0::/44", "start": "2a02:1828:ffe0::", "end": "2a02:1828:ffef:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a02:1828:fff0::/44", "start": "2a02:1828:fff0::", "end": "2a02:1828:ffff:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1000::/44", "start": "2a03:6b00:1000::", "end": "2a03:6b00:100f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:100::/44", "start": "2a03:6b00:100::", "end": "2a03:6b00:10f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1010::/44", "start": "2a03:6b00:1010::", "end": "2a03:6b00:101f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1020::/44", "start": "2a03:6b00:1020::", "end": "2a03:6b00:102f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1030::/44", "start": "2a03:6b00:1030::", "end": "2a03:6b00:103f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1040::/44", "start": "2a03:6b00:1040::", "end": "2a03:6b00:104f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1050::/44", "start": "2a03:6b00:1050::", "end": "2a03:6b00:105f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1060::/44", "start": "2a03:6b00:1060::", "end": "2a03:6b00:106f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1070::/44", "start": "2a03:6b00:1070::", "end": "2a03:6b00:107f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1080::/44", "start": "2a03:6b00:1080::", "end": "2a03:6b00:108f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1090::/44", "start": "2a03:6b00:1090::", "end": "2a03:6b00:109f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:10::/44", "start": "2a03:6b00:10::", "end": "2a03:6b00:1f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:10a0::/44", "start": "2a03:6b00:10a0::", "end": "2a03:6b00:10af:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:10b0::/44", "start": "2a03:6b00:10b0::", "end": "2a03:6b00:10bf:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:10c0::/44", "start": "2a03:6b00:10c0::", "end": "2a03:6b00:10cf:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:10d0::/44", "start": "2a03:6b00:10d0::", "end": "2a03:6b00:10df:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:10e0::/44", "start": "2a03:6b00:10e0::", "end": "2a03:6b00:10ef:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:10f0::/44", "start": "2a03:6b00:10f0::", "end": "2a03:6b00:10ff:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1100::/44", "start": "2a03:6b00:1100::", "end": "2a03:6b00:110f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:110::/44", "start": "2a03:6b00:110::", "end": "2a03:6b00:11f:ffff:ffff:ffff:ffff:ffff" },
    { "prefix": "2a03:6b00:1110::/44", "start": "2a03:6b00:1110::", "end": "2a03:6b00:111f:ffff:ffff:ffff:ffff:ffff" }
];

// دمج المتغيرات لتجنب التكرار في المنطق
var STRONG_JO_V6_INTERVALS = JO_V6_INTERVALS.slice(); 

// =====================================================
// 3) IPv6 HELPERS - وظائف مساعدة لـ IPv6
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
    return isJOIPv6(ip); 
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
// 4) PUBG SIGNATURES - لتحديد ترافيك اللعبة
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
// 5) MODES + PORTS - لتحديد المنفذ المناسب لكل نمط اتصال
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

function buildProxy(mode){
    var p = PORTS[mode] || PORTS.LOBBY;
    return "PROXY "+PROXY_IP+":"+p;
}

var PORTS = {
    LOBBY:          443,
    MATCH:          20001,
    RECRUIT_SEARCH: 10012,
    UPDATES:        80,
    CDNS:           80
};

// =====================================================
// 6) MAIN - الدالة الرئيسية
// =====================================================

function FindProxyForURL(url,host){

    // 0) استثناءات مباشرة (DIRECT) لتجنب البروكسي (مثل الـ GitHub)
    if (dnsDomainIs(host, "raw.githubusercontent.com")) {
        return "DIRECT";
    }

    // 1) الترافيك المحلي/الخاص يذهب DIRECT (تخفيف الحمل)
    if (isPrivateOrLocal(host))
        return "DIRECT"; 

    var ipv6   = extractIPv6Host(host);
    var isGame = isPubgTraffic(url,host);
    var jo     = ipv6 ? isJOIPv6(ipv6) : false; // التحقق من النطاق الأردني

    // 2) *** نقطة الصرامة 1: منع أي IPv6 literal يخرج عن النطاقات الأردنية ***
    if (ipv6 && !jo && FORBID_NON_JO)
        return BLOCK_REPLY;

    // 3) PUBG TRAFFIC: توجيهه لأقرب منفذ مناسب عبر البروكسي الأردني
    if (isGame){
        var mode = detectMode(url);
        // التوجيه إلى البروكسي الأردني (37.220.120.16)
        return buildProxy(mode);
    }

    // 4) *** نقطة الصرامة 2: أي شيء غير PUBG وغير محلي/مستثنى → بروكسي أردني (LOBBY Port) ***
    // هذا يضمن أن 'كل' مسار خارجي يمر بالبروكسي الأردني
    return buildProxy("LOBBY");
}
// =====================================================
```
