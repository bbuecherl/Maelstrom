var path = require("path");
var fs = require("fs");
var is = require("node-is");
var Template = require("./core/Template.js");
var Parser = require("./parser/index.js");

var Maelstrom = module.exports = {
  compile: function(file) {
    var content = file;
    var ext = path.extname(file);
    if (is.String(ext) && Maelstrom.FILEEXT.indexOf(ext.toLowerCase()) !== -1) {
      content = fs.readFileSync(file, {encoding: "utf-8"});
    }

    var parsed = Parser.parse(content);
    return Template.create(parsed);
  },

  FILEEXT: [".maelstrom"]
};
