var path = require("path");
var is = require("node-is");
var Maelstrom = require("./lib/index.js");

var CACHE = {};

var nodeRequire = global.require;
global.require = function(file) {
  var f = nodeRequire.resolve(file);
  if(CACHE[f]) {
    return CACHE[f];
  }

  var ext = path.extname(f);
  if (is.String(ext) && Maelstrom.FILEEXT.indexOf(ext.toLowerCase()) !== -1) {
    return (CACHE[f] = Maelstrom.compile(f));
  } else {
    nodeRequire(f);
  }
};

Object.keys(nodeRequire).forEach(function(key) {
  global.require[key] = nodeRequire[key];
});
