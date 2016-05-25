var Processor = require("../core/Processor.js");
var HTMLMaelstromElement = require("../html/HTMLMaelstromElement.js");
var utils = require("../utils/index.js");

var _else = module.exports = function(ast, token, AST, filePath, tmp) {
  Processor.call(this, ast, token, AST, true, filePath);
  if(!tmp.lastIf) {
    throw new SyntaxError("else-statement requires a previous if-statement");
  }
  tmp.lastIf.registerElse(this);
  tmp.lastIf = null;
};

_else.prototype = {
  _render: function(element, objs) {
    utils.domEmpty(element.root);
    var inner = HTMLMaelstromElement(this.inner, objs);
    element.root.appendChild(inner);
  },
  render: function() {}
};
