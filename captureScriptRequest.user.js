// ==UserScript==
// @name         capture script requests
// @namespace    https://github.com/frf-nn-ru/userscripts
// @version      0.1
// @description  example how to handle script requests
// @author       FRF-NN-RU
// @match        http://ya.ru/
// @grant        none
// ==/UserScript==

(function(insertBefore) {
    console.log("Replace HTMLHeadElement.insertBefore");
    HTMLHeadElement.prototype.insertBefore = function() {
        /*
        if(!window.dbg) {
            window.dbg = true;
            debugger;
        }
        */
        var self = this;
        var args = Array.prototype.slice.call(arguments, 0);
        //console.log(args);
        var script = args[0];
        if(script.tagName == "SCRIPT") {
            var src = args[0].src;
            var parts = src.split("?");
            var parts2 = parts[1].split("&");
            for(var n in parts2) {
                var parts3 = parts2[n].split("=");
                if(parts3[0] == "callback") {
                    var new_cb = "qJerry_" + (new Date()).getTime();
                    window[new_cb] = (function(callback, new_cb) {
                        return function() {
                            delete window[new_cb];
                            var args = Array.prototype.slice.call(arguments, 0);
                            //console.log(args);
                            console.log(args[0][0]);
                            for(var m in args[0][1]) {
                                console.log(args[0][1][m][1]);
                            }
                            window[callback].apply(window, args);
                        };
                    })(parts3[1], new_cb);
                    parts3[1] = new_cb;
                    parts2[n] = parts3.join("=");
                    break;
                }
            }
            parts[1] = parts2.join("&");
            src = parts.join("?");
            args[0].src = src;
        }
        //console.log(src);
        insertBefore.apply(self, args);
    };
})(HTMLHeadElement.prototype.insertBefore);
