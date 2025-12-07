function FindProxyForURL(url, host) {

    // ================== إعدادات البروكسي ================== //

    var PROXY_LOBBY      = "91.106.109.12:443";
    var PROXY_MATCH      = "91.106.109.12:20001";
    var PROXY_MATCH_FALL = "212.35.66.45:20001";

    var BLOCK_REPLY = "PROXY 0.0.0.0:0";

    // ================== دومينات PUBG (بدون صوت) ================== //

    var PUBG_DOMAINS = [
      ".igamecj.com",
      ".proximabeta.com",
      ".pubgmobile.com",
      ".tencentgamer.com",
      ".gcloudcs.com",
      ".gcloudsdk.com",
      ".qq.com",
      ".smoba.qq.com",
      ".tencentcs.com",
      ".dl.qq.com",
      ".cdn.qq.com",
      ".file.myqcloud.com",
      ".qcloudcdn.com",
      ".pay.qq.com",
      ".myapp.com",
      ".bugly.qq.com",
      ".qcloud.com",
      ".me.pubgmobile.com",
      ".asia.pubgmobile.com",
      ".eu.pubgmobile.com",
      ".friends.qq.com",
      ".social.qq.com"
    ];

    // ================== نطاقات الأردن IPv4 (CIDR – النسخة المدموجة الجديدة) ================== //

    var JO_V4_CIDR = [

      { base: "5.45.128.0",   mask: 21 },

      { base: "37.202.64.0",  mask: 20 },
      { base: "37.202.80.0",  mask: 21 },
      { base: "37.220.120.0", mask: 29 },

      { base: "46.23.112.0",  mask: 20 },
      { base: "46.32.96.0",   mask: 20 },

      { base: "46.185.128.0", mask: 25 },
      { base: "46.185.144.0", mask: 24 },
      { base: "46.185.176.0", mask: 22 },

      { base: "46.248.192.0", mask: 25 },

      { base: "62.72.160.0",  mask: 21 },

      { base: "77.245.0.0",   mask: 21 },

      { base: "79.134.136.0", mask: 21 },
      { base: "79.173.192.0", mask: 18 },

      { base: "80.90.160.0",  mask: 20 },

      { base: "81.21.0.0",    mask: 21 },
      { base: "81.28.112.0",  mask: 20 },

      { base: "82.212.72.0",  mask: 21 },
      { base: "82.212.80.0",  mask: 21 },
      { base: "82.212.96.0",  mask: 21 },

      { base: "84.18.32.0",   mask: 20 },

      { base: "87.236.232.0", mask: 21 },

      { base: "92.241.32.0",  mask: 21 },
      { base: "92.241.48.0",  mask: 21 },

      { base: "94.142.32.0",  mask: 19 },

      { base: "94.249.0.0",   mask: 21 },
      { base: "94.249.40.0",  mask: 20 },
      { base: "94.249.80.0",  mask: 20 },

      { base: "109.107.232.0", mask: 22 },

      { base: "176.29.0.0",   mask: 19 },
      { base: "176.29.56.0",  mask: 21 },
      { base: "176.29.72.0",  mask: 21 },
      { base: "176.29.104.0", mask: 21 },
      { base: "176.29.144.0", mask: 20 },
      { base: "176.29.192.0", mask: 21 },
      { base: "176.29.248.0", mask: 21 },

      { base: "178.238.184.0", mask: 21 },

      { base: "212.118.0.0",  mask: 20 },
      { base: "213.186.160.0", mask: 19 }
    ];

    // ================== دوال الفحص ================== //

    function ip4ToLong(ip) {
        var p = ip.split(".");
        if (p.length !== 4) return -1;
        var n = (((parseInt(p[0], 10) * 256 +
                   parseInt(p[1], 10)) * 256 +
                   parseInt(p[2], 10)) * 256 +
                   parseInt(p[3], 10));
        if (isNaN(n)) return -1;
        return n;
    }

    function ipInCidr(ip, base, maskBits) {
        var ipNum   = ip4ToLong(ip);
        var baseNum = ip4ToLong(base);
        if (ipNum < 0 || baseNum < 0) return false;
        var shift = 32 - maskBits;
        return (ipNum >> shift) === (baseNum >> shift);
    }

    function isIpInJoV4(ip) {
        for (var i = 0; i < JO_V4_CIDR.length; i++) {
            var r = JO_V4_CIDR[i];
            if (ipInCidr(ip, r.base, r.mask)) return true;
        }
        return false;
    }

    function isPubgHost(h) {
        h = h.toLowerCase();
        if (shExpMatch(h, "*.*.*.*")) return true;

        for (var i = 0; i < PUBG_DOMAINS.length; i++) {
            if (dnsDomainIs(h, PUBG_DOMAINS[i])) return true;
        }
        return false;
    }

    function classifyPubgPhase(u, h) {
        u = u.toLowerCase();
        h = h.toLowerCase();

        if (shExpMatch(u, "*recruit*") || shExpMatch(u, "*social*") || shExpMatch(h, "*friends*"))
            return "RECRUIT";

        if (shExpMatch(u, "*match*") || shExpMatch(u, "*game*") ||
            shExpMatch(h, "*igamecj*") || shExpMatch(h, "*proximabeta*"))
            return "MATCH";

        if (shExpMatch(h, "*dl.*") || shExpMatch(u, "*.apk*") || shExpMatch(u, "*.obb*"))
            return "UPDATE";

        return "LOBBY";
    }

    // ================== منطق PUBG النهائي ================== //

    if (isPubgHost(host)) {

        var phase = classifyPubgPhase(url, host);

        var ip = host;
        if (!shExpMatch(host, "*.*.*.*")) {
            ip = dnsResolve(host);
            if (ip === null) return BLOCK_REPLY;
        }

        if (shExpMatch(ip, "*:*")) return BLOCK_REPLY;

        if (!isIpInJoV4(ip)) return BLOCK_REPLY;

        if (phase === "MATCH" || phase === "RECRUIT") {
            return "PROXY " + PROXY_MATCH + "; PROXY " + PROXY_MATCH_FALL + ";";
        }

        if (phase === "UPDATE") {
            return "PROXY " + PROXY_LOBBY + ";";
        }

        return "PROXY " + PROXY_LOBBY + ";";
    }

    // ================== باقي الإنترنت ================== //
    return "DIRECT";
}
