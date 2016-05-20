var path = require("path");
var is = require("node-is");
var fs_wrap = require("./utils/fs-wrap/node.js");
var Template = require("./core/Template.js");
var Processor = require("./core/Processor.js");
var Parser = require("./parser/index.js");
var HTMLMaelstromElement = require("./html/HTMLMaelstromElement.js");

var Maelstrom = module.exports = {
  compile: function(file) {
    var content = file;
    var ext = path.extname(file);
    var filePath = fs_wrap.cwd();
    if (is.String(ext) && Maelstrom.FILEEXT.indexOf(ext.toLowerCase()) !== -1) {
      try {
        file = fs_wrap.resolve(fs_wrap.cwd(), file);
        filePath = fs_wrap.dirname(file);
        content = fs_wrap.readFileSync(file, {encoding: "utf-8"});
      } catch(e) {
        throw new Error("could not read file '" + file + "'");
      }
    }

    var parsed = Parser.parse(content, filePath);
    var template = Template.create(parsed);
    return HTMLMaelstromElement.bind(null, template);
  },

  FILEEXT: [".maelstrom"]
};
