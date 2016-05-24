var path = require("path");
var is = require("node-is");
var fs_wrap = require("./utils/fs-wrap/node.js");
var Template = require("./core/Template.js");
var Processor = require("./core/Processor.js");
var Parser = require("./parser/index.js");
var HTMLMaelstromElement = require("./html/HTMLMaelstromElement.js");

var Maelstrom = module.exports = {
  compile: function(file, callback) {
    var content = file;
    var ext = path.extname(file);
    var filePath = fs_wrap.cwd();

    if(is.Function(callback)) { // async
      if(is.String(ext) &&
          Maelstrom.FILEEXT.indexOf(ext.toLowerCase()) !== -1) {
        file = fs_wrap.resolve(fs_wrap.cwd(), file);
        filePath = fs_wrap.dirname(file);
        fs_wrap.readFile(file, {encoding: "utf-8"}, function(err, body) {
          if(err) {
            callback(err);
          } else {
            var parsed = Parser.parse(content, filePath);
            var template = Template.create(parsed);
            callback(null, HTMLMaelstromElement.bind(null, template));
          }
        });
      }
    } else { // sync
      if (is.String(ext) &&
          Maelstrom.FILEEXT.indexOf(ext.toLowerCase()) !== -1) {
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
    }
  },

  FILEEXT: [".maelstrom"]
};
