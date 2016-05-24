var Processor = require("../core/Processor.js");
var Template = require("../core/Template.js");
var HTMLMaelstromElement = require("../html/HTMLMaelstromElement.js");

var mixin = module.exports = function(ast, token, AST, filePath) {
  Processor.call(this, ast, token, AST, false, filePath);
  this._processor = "mixin";
  this.args = this.token.line.split(" ");
  this.name = this.args.shift();
  this.inner = Template.create(AST.generate(token.childs));
};

mixin.prototype = {
  render: function(element, objs) {
    return;
  },

  mixin: function(element, objs, args) {
    console.log(objs, args);
    element.appendChild(HTMLMaelstromElement(this.inner, objs, args));
  }
};
