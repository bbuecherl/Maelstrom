var Processor = require("./Processor.js");
var ASTType = require("./identifiers.js").AST;

var RegExpSplit = /[^\s\}\{]+|\{\{([^\}]*)\}\}/g;

var Mixin = module.exports = function(token, ast, AST, filePath) {
  Processor.call(this, ast, token, true, AST, filePath);
  this.args = [];

  this.token.line.split(RegExpSplit).forEach(function(arg) {
    this.args.push(Processor.parseArgument(arg));
  }.bind(this));
};

Mixin.prototype = {
  render: function(element, template, objs, arr) {
    var m = template.mixin_processors[this.ast.tag];
    var args = {};

    console.log(m.args, arr);

    for(var i = 0; i < m.args.length; ++i) {
      args[m.args[i]] = arr[i];
    }

    m.mixin(element, objs, args);
  },

  getCode: function() {
    return this.args;
  }
};

Mixin.parse = function(token, ast, AST, filePath) {
  var mixin = new Mixin(token, ast, AST, filePath);
  ast.type = ASTType.MIXIN;
  ast.mixin = mixin;
  ast.tag = token.tag;
  return ast;
}
