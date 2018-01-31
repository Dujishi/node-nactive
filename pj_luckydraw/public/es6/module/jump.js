/**
 * @description
 * @author  yinshi
 * @date 16/12/2.
 */



export  default (function() {
    var IOS_VERSION_RE = /OS\s+(\d)_/;
    var timers = [];
    var userAgent = window.navigator.userAgent;
    var isAndroid = function() {
        return /Android/.test(userAgent);
    };
    var isIOS = function() {
        return /(?:i(?:Phone|P(?:o|a)d))/.test(userAgent);
    };
    var iOSVersion = function() {
        return isIOS() ? parseInt(userAgent.match(IOS_VERSION_RE)[1], 10) : 0;
    };
    var isChrome = function() {
        return /Chrome/.test(userAgent) && !/OPR/.test(userAgent);
    };
    var isFirefox = function() {
        return /Firefox/.test(userAgent);
    };

    return {
        clearTimers: function() {
            console.log("Clearing timers: [" + timers.join(', ') + ']');
            timers.map(clearTimeout);
            timers = [];
        },
        openApp: function(deeplink, storeURI) {
            var launcher = this;
            var storeLaunched = false;
            var gotStoreURI = "string" == typeof storeURI;

            gotStoreURI && timers.push(window.setTimeout(function() {
                console.log('Launching App Store: ' + storeURI);
                storeLaunched = true;
                window.top.location = storeURI;
            }, 3000));

            isIOS() && timers.push(window.setTimeout(function() {
                console.log('Reloading page');
                storeLaunched && window.location.reload()
            }, 5000));

            console.log('Launching app: ' + deeplink);
            window.location = deeplink;
        },
        getStoreURI: function() {
            return "http://dl.ddyc.com?tips=1";
        },
        init: function(uri,getStoreURI) {
            var launcher = this;
            var events = ["pagehide", "blur"];
            const  pageid = 'ddyc://home/mall?url='+encodeURIComponent(uri);
            if (isIOS() || (isAndroid() && !isChrome())) {
                events.push("beforeunload");
            }
            console.log("Listening window events: " + events.join(", "));
            $(window).on(events.join(" "), function(e) {
                console.log("Window event: " + e.type);
                launcher.clearTimers();
            });

            // document.getElementById('openInApp').onclick = function() {
            //     setTimeout(function() {
            //         launcher.openApp.call(launcher, pageid, launcher.getStoreURI());
            //     }.bind(this), 0)
            // };
            //
            // document.getElementById('openInApp').click();

            launcher.openApp( pageid,getStoreURI)
        }
    };
})();