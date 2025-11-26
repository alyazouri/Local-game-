function FindProxyForURL(url, host) {
    // =======================================================
    // 1. التكوين الأساسي
    // =======================================================
    var PROXY_PRIMARY_HOST   = "91.106.109.12";   // الوكيل الأساسي
    var PROXY_FALLBACK_HOST  = "212.35.66.45";    // وكيل احتياطي
    var BLOCK_REPLY          = "PROXY 0.0.0.0:0"; // بلوك كامل (لو احتجته)
    var DST_RESOLVE_TTL_MS   = 30 * 1000;         // 30 ثانية للكاش

    // تقسيم البورتات لكل نوع من ترافيك PUBG
    var FIXED_PORT = {
        LOBBY:      443,      // دخول اللوبي / سوشل
        MATCH:      20001,    // قيم / ماتش
        UPDATES:    80,       // تحديثات / باتشات
        CDNs:       80,       // CDN للملفات
        DEFAULT:    20001,    // افتراضي لباقي الحالات
        JO_DEFAULT: 443       // للترافيك الأردني العام
    };
    
    function buildProxy(which, port) {
        var host = (which === "PRIMARY") ? PROXY_PRIMARY_HOST : PROXY_FALLBACK_HOST;
        return "PROXY " + host + ":" + port;
    }
    
    // =======================================================
    // 2. نطاقات الأردن IPv4 و IPv6
    // =======================================================

    // IPv4 CIDRs
    var JO_V4_CIDRS = [
        "82.212.128.0/17",
        "37.236.0.0/14",
        "91.151.192.0/18",
        "188.161.0.0/16",
        "176.29.0.0/16",
        "94.249.0.0/18",
        "213.139.160.0/19"
    ];

    // المستقبل: IPv6 – نطاقات أردنية قوية
    var JO_V6_CIDRS = [
        "2001:1678::/32",
        "2a00:da40::/32",
        "2a02:9e0::/32"
    ];
    
    // =======================================================
    // 3. نطاقات PUBG Mobile
    // =======================================================
    var PUBG_DOMAINS = {
        LOBBY:   ["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com", "*.gpubgm.com"],
        MATCH:   ["*.gcloud.qq.com", "gpubgm.com", "match.igamecj.com", "match.proximabeta.com"],
        UPDATES: ["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com", "hotfix.proximabeta.com", "dlied*.qq.com"],
        CDNs:    ["cdn.igamecj.com", "cdn.proximabeta.com", "cdn.tencentgames.com", "*.qcloudcdn.com", "*.cloudfront.net", "*.edgesuite.net"]
    };
    
    // =======================================================
    // 4. استثناءات على مسار PROXY_FALLBACK (سناب / إنستا / تيك توك / تليغرام / نتفلكس)
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
    // 5. دوال مساعدة – IPv4
    // =======================================================
    function ipv4ToInt(ip) {
        var parts = ip.split(".");
        if (parts.length !== 4) return 0;
        return (parseInt(parts[0], 10) << 24) >>> 0 |
               (parseInt(parts[1], 10) << 16) >>> 0 |
               (parseInt(parts[2], 10) <<  8) >>> 0 |
               (parseInt(parts[3], 10)      >>> 0);
    }

    function ipv4Mask(bits) {
        if (bits <= 0) return 0;
        if (bits >= 32) return 0xFFFFFFFF >>> 0;
        return (0xFFFFFFFF << (32 - bits)) >>> 0;
    }

    function ipv4InCidr(ip, cidr) {
        var p = cidr.split("/");
        if (p.length !== 2) return false;
        var base = p[0];
        var bits = parseInt(p[1], 10);
        var ipInt   = ipv4ToInt(ip);
        var baseInt = ipv4ToInt(base);
        var mask    = ipv4Mask(bits);
        return ((ipInt & mask) >>> 0) === ((baseInt & mask) >>> 0);
    }

    function ipv4InCidrList(ip, list) {
        for (var i = 0; i < list.length; i++) {
            if (ipv4InCidr(ip, list[i])) return true;
        }
        return false;
    }

    // =======================================================
    // 6. دوال مساعدة – IPv6
    // =======================================================
    function expandIPv6(address) {
        // يرجّع مصفوفة من 8 أرقام (0–65535)
        var parts = address.split("::");
        var head = parts[0] ? parts[0].split(":") : [];
        var tail = (parts.length > 1 && parts[1]) ? parts[1].split(":") : [];
        var missing = 8 - (head.length + tail.length);
        var full = [];
        var i;

        for (i = 0; i < head.length; i++) full.push(head[i]);
        for (i = 0; i < missing; i++)    full.push("0");
        for (i = 0; i < tail.length; i++) full.push(tail[i]);

        for (i = 0; i < 8; i++) {
            full[i] = parseInt(full[i] || "0", 16);
            if (isNaN(full[i])) full[i] = 0;
        }
        return full;
    }

    function ipv6InCidr(ip, cidr) {
        var p = cidr.split("/");
        if (p.length !== 2) return false;
        var base = p[0];
        var prefixLen = parseInt(p[1], 10);
        if (prefixLen <= 0) return true;
        if (prefixLen > 128) prefixLen = 128;

        var ipArr   = expandIPv6(ip);
        var baseArr = expandIPv6(base);

        var bitsLeft = prefixLen;
        for (var i = 0; i < 8 && bitsLeft > 0; i++) {
            if (bitsLeft >= 16) {
                if (ipArr[i] !== baseArr[i]) return false;
                bitsLeft -= 16;
            } else {
                var mask = (~((1 << (16 - bitsLeft)) - 1)) & 0xFFFF;
                if ((ipArr[i] & mask) !== (baseArr[i] & mask)) return false;
                bitsLeft = 0;
            }
        }
        return true;
    }

    function ipv6InCidrList(ip, list) {
        for (var i = 0; i < list.length; i++) {
            if (ipv6InCidr(ip, list[i])) return true;
        }
        return false;
    }

    // =======================================================
    // 7. دوال منطق الأردن + PUBG
    // =======================================================
    function isJordanIP(ip) {
        if (!ip) return false;
        if (ip.indexOf(":") >= 0) {
            // IPv6
            return ipv6InCidrList(ip, JO_V6_CIDRS);
        }
        if (ip.indexOf(".") >= 0) {
            // IPv4
            return ipv4InCidrList(ip, JO_V4_CIDRS);
        }
        return false;
    }

    function hostMatchesAnyDomain(h, patterns) {
        for (var i = 0; i < patterns.length; i++) {
            if (shExpMatch(h, patterns[i])) return true;
        }
        return false;
    }

    function getPubgCategory(h) {
        h = h.toLowerCase();
        for (var cat in PUBG_DOMAINS) {
            if (hostMatchesAnyDomain(h, PUBG_DOMAINS[cat])) return cat;
        }
        return null;
    }

    function isClientInJordan() {
        var myip = myIpAddress();
        if (!myip || isPlainHostName(myip)) return false;
        return isJordanIP(myip);
    }

    // =======================================================
    // 8. كاش للـ DNS
    // =======================================================
    var CACHE = {};
    function resolveDstCached(h) {
        if (!h || isPlainHostName(h)) return h;

        // لو هو IP جاهز (IPv4 أو IPv6) لا نحتاج DNS
        if (isIPAddress(h) || h.indexOf(":") >= 0 ||
           (h.indexOf(".") >= 0 && h.split(".").length === 4)) {
            return h;
        }
        
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
    // 9. منطق قرار الوكيل (Ultra-Strict PUBG)
    // =======================================================
    
    var dst_ip = host;
    
    if (!isIPAddress(host)) {
        dst_ip = resolveDstCached(host);
    } 
    
    // 9.1 استثناءات (سناب + إنستا + تيك توك + تليغرام + نتفلكس) → FALLBACK فقط
    for (var i = 0; i < SPECIAL_FALLBACK_DOMAINS.length; i++) {
        if (shExpMatch(host, SPECIAL_FALLBACK_DOMAINS[i])) {
            return buildProxy("FALLBACK", FIXED_PORT.DEFAULT);
        }
    }

    var dst_is_jo    = isJordanIP(dst_ip);
    var client_is_jo = isClientInJordan();
    var category     = getPubgCategory(host);

    // 9.2 PUBG فقط (مقسّم على بورتات)
    if (category !== null) {
        var port        = FIXED_PORT[category] || FIXED_PORT.DEFAULT;
        var primaryCat  = buildProxy("PRIMARY", port);
        var fallbackCat = buildProxy("FALLBACK", port);

        // Ultra-Strict: LOBBY دائمًا على PRIMARY فقط
        if (category === "LOBBY") {
            // الهدف الأساسي: زيادة عدد لاعبين الأردن داخل اللوبي
            // نرغم اللوبي يطلع من المسار الأردني (PROXY_PRIMARY) على البورت المخصص
            return primaryCat;
        }

        // MATCH (الجيم)
        if (category === "MATCH") {
            if (dst_is_jo)        return primaryCat;                 // سيرفر أردني → PRIMARY
            if (client_is_jo)     return primaryCat + "; " + fallbackCat;
            return fallbackCat + "; " + primaryCat;
        }

        // UPDATES / CDNs → خفّ الضغط على الأردني، خليه احتياطي
        if (category === "UPDATES" || category === "CDNs") {
            return fallbackCat + "; " + primaryCat;
        }

        // أي تصنيف PUBG آخر (لو أضفنا لاحقاً)
        if (dst_is_jo)        return primaryCat;
        if (client_is_jo)     return primaryCat + "; " + fallbackCat;
        return fallbackCat + "; " + primaryCat;
    }

    // 9.3 أي سيرفر أردني (مش PUBG) → PRIMARY على بورت أردني افتراضي
    if (dst_is_jo) {
        return buildProxy("PRIMARY", FIXED_PORT.JO_DEFAULT);
    }

    // 9.4 باقي الترافيك → FALLBACK (لا يوجد DIRECT نهائياً)
    return buildProxy("FALLBACK", FIXED_PORT.DEFAULT);
}
