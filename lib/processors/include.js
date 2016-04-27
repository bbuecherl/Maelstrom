var path = require("path");
var Processor = require("../core/Processor.js");
var Maelstrom = require("../index.js");

var include = module.exports = function(ast, token, AST, filePath) {
  Processor.call(this, ast, token, AST, false, filePath);
  var split = this.token.line.split(" ");
  this.InnerTemplate = Maelstrom.compile(path.resolve(filePath,
      split.shift()));
};

include.prototype = {
  render: function(element, objs) {
    element.appendChild(this.InnerTemplate(objs));
  }
};
