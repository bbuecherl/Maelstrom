(function(global, factory) {
    if(typeof define === "function" && define.amd) {
        define(["Maelstrom"], factory);
    } else {
        global.Maelstrom = factory();
    }
})(this, function() {
"use strict";
