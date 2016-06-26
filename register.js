var path = require("path");
var is = require("node-is");
var Maelstrom = require("./lib/index.js");

var CACHE = {};
var ErrorRegExp = /maelstrom\/register\.js.*\n[^\(]*\(([^\)]*)\)/gi;

/*var nodeRequire = require;
console.log(nodeRequire.main.require);
nodeRequire.main.require = global.require =*/
require.extensions[".maelstrom"] = function(m, file) {
  console.log(m, file);
  var f;
  try {
    f = require.resolve(file);
  } catch(e) {
    var result = ErrorRegExp.exec(e.stack);
    ErrorRegExp.lastIndex = 0;
    f = path.resolve(path.dirname(result[1].split(":").shift()), file);
  }

  if(CACHE[f]) {
    return CACHE[f];
  }
  var ext = path.extname(f);
  //if (is.String(ext) && Maelstrom.FILEEXT.indexOf(ext.toLowerCase()) !== -1) {
    return (CACHE[f] = Maelstrom.compile(f));
  /*} else {
    require(f);
  }*/
};
/*
console.log(nodeRequire.main.require);
console.log(nodeRequire.main);

Object.keys(nodeRequire).forEach(function(key) {
  global.require[key] = nodeRequire[key];
});
*/
