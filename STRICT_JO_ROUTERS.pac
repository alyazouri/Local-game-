function FindProxyForURL(url, host) {
  // STRICT_JO_ROUTERS (Catch) — live-built (الآن اسرائيلي)
  var JO_PROXY_HOST = "2.54.232.40";
  var PORT_LOBBY = 10010;
  var PORT_MATCH = 20001;
  var PORT_RECRUIT_SEARCH = 12000;
  var PORT_UPDATES = 8080;
  var PORT_CDN = 443;
  var STICKY_MINUTES = 10;

  var JO_V4_PREFIXES = [
     "79.176.0.0/19",
    "77.124.0.0/18",
    "2.52.0.0/14",
    "84.108.0.0/18"
  ];

  function proxyLine(port){ return "SOCKS5 " + JO_PROXY_HOST + ":" + port; }
  function matchDomain(h,l){for(var i=0;i<l.length;i++){var p=l[i];if(p.indexOf("*")>=0){if(shExpMatch(h,p))return true;}else{if(dnsDomainIs(h,p))return true;}}return false;}
  function matchURL(u,ps){for(var i=0;i<ps.length;i++){if(shExpMatch(u,ps[i]))return true;}return false;}

  var PUBG_DOMAINS = {
    LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH:["*.gcloud.qq.com","gpubgm.com","*.igamecj.com","*.proximabeta.com"],
    RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com","clan.igamecj.com"],
    UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com"],
    CDNs:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };
  var URL_PATTERNS = {
    LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES:["*/patch*","*/update*","*/hotfix*","*/download/*","*/assets/*","*/assetbundle*","*/obb*"],
    CDNs:["*/cdn/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  function ip4ToInt(ip){var p=ip.split('.');return((p[0]<<24)>>>0)+(p[1]<<16)+(p[2]<<8)+(p[3]>>>0);}
  function inCidrV4(ip,c){var a=c.split('/'),b=a[0],t=a.length>1?parseInt(a[1],10):32;var i=ip4ToInt(ip),bi=ip4ToInt(b);var m=t===0?0:(~((1<<(32-t))-1))>>>0;return (i&m)===(bi&m);}
  function isJO(ip){if(!ip||ip.indexOf('.')<0)return false;for(var i=0;i<JO_V4_PREFIXES.length;i++) if(inCidrV4(ip,JO_V4_PREFIXES[i]))return true;return false;}

  if(typeof _stickyCache==="undefined"){var _stickyCache={};}function nowMin(){return Math.floor((new Date()).getTime()/60000);}
  function stickyGet(h){var e=_stickyCache[h];if(!e)return null;if(nowMin()-e.t>STICKY_MINUTES)return null;return e.v;}
  function stickyPut(h,v){_stickyCache[h]={t:nowMin(),v:v};}

  var YT=["youtube.com","youtu.be","googlevideo.com","ytimg.com","youtube-nocookie.com"]; if (matchDomain(host,YT)) return "DIRECT";

  var c=stickyGet(host); if (c) return c;
  var ip=dnsResolve(host), jo=isJO(ip);

  function dec(port){ if (jo){ stickyPut(host,"DIRECT"); return "DIRECT"; } var l=proxyLine(port); stickyPut(host,l); return l; }
  if (matchDomain(host,PUBG_DOMAINS.MATCH) || matchURL(url,URL_PATTERNS.MATCH)) return dec(20001);
  if (matchDomain(host,PUBG_DOMAINS.RECRUIT_SEARCH) || matchURL(url,URL_PATTERNS.RECRUIT_SEARCH)) return dec(12000);
  if (matchDomain(host,PUBG_DOMAINS.LOBBY) || matchURL(url,URL_PATTERNS.LOBBY)) return dec(10010);

  if (matchDomain(host,PUBG_DOMAINS.UPDATES) || matchURL(url,URL_PATTERNS.UPDATES)) { if (jo){ stickyPut(host,"DIRECT"); return "DIRECT"; } var u=proxyLine(8080); stickyPut(host,u); return u; }
  if (matchDomain(host,PUBG_DOMAINS.CDNs) || matchURL(url,URL_PATTERNS.CDNs)) { if (jo){ stickyPut(host,"DIRECT"); return "DIRECT"; } var d=proxyLine(443); stickyPut(host,d); return d; }

  if (jo) { stickyPut(host,"DIRECT"); return "DIRECT"; }
  var fb=proxyLine(10010); stickyPut(host,fb); return fb;
}
