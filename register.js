var path = require("path");
var is = require("node-is");
var Maelstrom = require("./lib/index.js");

var nodeRequire = global.require;
global.require = function(file) {
  var f = nodeRequire.resolve(file);
  var ext = path.extname(f);
  if (is.String(ext) && Maelstrom.FILEEXT.indexOf(ext.toLowerCase()) !== -1) {
    return Maelstrom.compile(f);
  } else {
    nodeRequire(f);
  }
};
Object.keys(nodeRequire).forEach(function(key) {
  global.require[key] = nodeRequire[key];
});
