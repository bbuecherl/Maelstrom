var path = require("path");
var Processor = require("../core/Processor.js");
var Maelstrom = require("../index.js");
var RegEx = require("../core/identifiers.js").RegEx;

var include = module.exports = function(ast, token, AST, filePath) {
  Processor.call(this, ast, token, AST, false, filePath);
  var split = this.token.line.split(" ");
  this.InnerTemplate = Maelstrom.compile(path.resolve(filePath,
      split.shift()));
  split.forEach(function(str) {
    if (str.length > 4 && str.test(RegEx.VARIABLE)) {
      if (!this.vars) {
        this.vars = [];
      }
      this.vars.push(str.substr(2, -2));
    }
  });
};

include.prototype = {
  render: function(element, objs) {
    element.appendChild(this.InnerTemplate(objs));
  }
};
