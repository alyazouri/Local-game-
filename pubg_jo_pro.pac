function FindProxyForURL(url, host) {
    // =======================================================
    // 1. التكوين الأساسي (يجب تعديل هذه القيم حسب الحاجة)
    // =======================================================
    var PROXY_PRIMARY   = "91.106.109.12:20001";  // الوكيل الأساسي
    var PROXY_FALLBACK  = "212.35.66.45:20001";   // وكيل احتياطي
    var BLOCK_REPLY     = "PROXY 0.0.0.0:0";     // بلوك كامل لو حبيت تستخدمه
    var DST_RESOLVE_TTL_MS = 30 * 1000;          // 30 ثانية للكاش
    
    // =======================================================
    // 2. نطاقات IP الأردنية (JO_IP_RANGES)
    // =======================================================
    var JO_IP_RANGES = [
        "82.212.128.0/17","37.236.0.0/14","91.151.192.0/18","188.161.0.0/16",
        "176.29.0.0/16","94.249.0.0/18","213.139.160.0/19","212.38.128.0/19",
        "217.145.224.0/20","212.38.128.0/19","95.142.16.0/20","87.236.232.0/21",
        "83.150.0.0/18","77.81.64.0/19","77.81.0.0/18","5.22.192.0/18",
        "5.39.0.0/17","62.240.64.0/18"
    ];
    var JO_IP_6 = ["2001:1678::/32"],
    // =======================================================
    // 3. النطاقات وأنماط URL الخاصة بببجي موبايل (PUBG Mobile)
    // =======================================================
    var PUBG_DOMAINS = {
        LOBBY:   ["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com", "*.gpubgm.com"],
        MATCH:   ["*.gcloud.qq.com", "gpubgm.com", "match.igamecj.com", "match.proximabeta.com"],
        UPDATES: ["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com", "hotfix.proximabeta.com", "dlied*.qq.com"],
        CDNs:    ["cdn.igamecj.com", "cdn.proximabeta.com", "cdn.tencentgames.com", "*.qcloudcdn.com", "*.cloudfront.net", "*.edgesuite.net"]
    };
    
    // =======================================================
    // 4. استثناءات إضافية على مسار PROXY_FALLBACK
    // =======================================================
    var SPECIAL_FALLBACK_DOMAINS = [
        // Snapchat
        "snapchat.com","*.snapchat.com",
        "sc-cdn.net","*.sc-cdn.net",
        "snapkit.com","*.snapkit.com",
        "snap-dev.net","*.snap-dev.net",
        // Instagram
        "instagram.com","*.instagram.com",
        "cdninstagram.com","*.cdninstagram.com",
        // TikTok
        "tiktok.com","*.tiktok.com",
        "ttwstatic.com","*.ttwstatic.com",
        "byteoversea.com","*.byteoversea.com",
        // Telegram
        "t.me","*.t.me",
        "telegram.me","*.telegram.me",
        "telegram.org","*.telegram.org",
        // Netflix
        "netflix.com","*.netflix.com",
        "nflximg.net","*.nflximg.net",
        "nflxvideo.net","*.nflxvideo.net",
        "nflxso.net","*.nflxso.net",
        "nflxext.com","*.nflxext.com"
    ];
    
    // =======================================================
    // 5. الدوال المساعدة الأساسية
    // =======================================================
    
    function ipToInt(ip) {
        var parts = ip.split(".");
        return (parseInt(parts[0]) * 16777216) +
               (parseInt(parts[1]) * 65536) +
               (parseInt(parts[2]) * 256) +
               parseInt(parts[3]);
    }

    // ملاحظة: السكربت الأصلي يعتـمِد أن JO_IP_RANGES عبارة عن [start,end]
    // هنا تركته كما هو احتراماً لبنيتك، مع أن أفضل شيء يكون range حقيقي.
    function ipInAnyJordanRange(ip) {
        if (!ip || isPlainHostName(ip)) return false;
        var ipNum = ipToInt(ip);
        for (var i = 0; i < JO_IP_RANGES.length; i++) {
            var start = ipToInt(JO_IP_RANGES[i][0]);
            var end   = ipToInt(JO_IP_RANGES[i][1]);
            if (ipNum >= start && ipNum <= end) return true;
        }
        return false;
    }

    function isPubgDomain(h) {
        h = h.toLowerCase();
        for (var cat in PUBG_DOMAINS) {
            if (hostMatchesAnyDomain(h, PUBG_DOMAINS[cat])) return true;
        }
        return false;
    }
    
    function hostMatchesAnyDomain(h, patterns) {
        for (var i = 0; i < patterns.length; i++) {
            if (shExpMatch(h, patterns[i])) return true;
        }
        return false;
    }

    // تقريب لمسار أردني بناءً على IP العميل نفسه
    function isClientInJordan() {
        var myip = myIpAddress();
        if (!myip || isPlainHostName(myip)) return false;
        return ipInAnyJordanRange(myip);
    }

    var CACHE = {};
    function resolveDstCached(h) {
        if (!h || isPlainHostName(h) || isIPAddress(h)) return h;
        
        var now = new Date().getTime();
        var c = CACHE[h];
        
        if (c && (now - c.t) < DST_RESOLVE_TTL_MS) return c.ip;
        
        var ip = dnsResolve(h);
        
        if (ip && ip !== "0.0.0.0") {
             CACHE[h] = {ip: ip, t: now};
        }
        return ip;
    }

    // =======================================================
    // 6. منطق قرار الوكيل
    // =======================================================
    
    var dst_ip = host;
    var proxy_primary_str  = "PROXY " + PROXY_PRIMARY;
    var proxy_fallback_str = "PROXY " + PROXY_FALLBACK;
    
    if (!isIPAddress(host)) {
        dst_ip = resolveDstCached(host);
    } 
    
    // 6.1 استثناءات (سناب + إنستغرام + تيك توك + تليغرام + نتفلكس)
    for (var i = 0; i < SPECIAL_FALLBACK_DOMAINS.length; i++) {
        if (shExpMatch(host, SPECIAL_FALLBACK_DOMAINS[i])) {
            return proxy_fallback_str;
        }
    }

    // 6.2 PUBG + المسار الأردني التقريبي
    var dst_is_jo    = isIPAddress(dst_ip) && ipInAnyJordanRange(dst_ip);
    var client_is_jo = isClientInJordan();

    if (isPubgDomain(host) || dst_is_jo) {
        // لو الهدف أردني فعلياً → PRIMARY
        if (dst_is_jo) {
            return proxy_primary_str;
        }
        // لو الهدف مش واضح أردني لكن العميل أردني → فضّل PRIMARY ثم FALLBACK
        if (client_is_jo) {
            return proxy_primary_str + "; " + proxy_fallback_str;
        }
        // غير هيك → FALLBACK أولاً ثم PRIMARY
        return proxy_fallback_str + "; " + proxy_primary_str;
    }

    // 6.3 باقي الترافيك → على بروكسي احتياطي بشكل افتراضي
    return proxy_fallback_str;
}
