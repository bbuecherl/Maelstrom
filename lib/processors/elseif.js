var Processor = require("../core/Processor.js");
var HTMLMaelstromElement = require("../html/HTMLMaelstromElement.js");
var utils = require("../utils/index.js");

var _elseif = module.exports = function(ast, token, AST, filePath, tmp) {
  Processor.call(this, ast, token, AST, true, filePath);
  this.compare = Processor.parseArgument("{{return " + this.token.line + ";}}");
  if(!this.compare) {
    throw new SyntaxError("Could not parse argument: " + this.token.line);
  }
  if(!tmp.lastIf) {
    throw new SyntaxError("elseif-statement requires a previous if-statement");
  }
  tmp.lastIf.registerElseIf(this);
  this._if = tmp.lastIf;
};

_elseif.prototype = {
  _render: function(element, objs) {
    utils.domEmpty(element.root);
    var inner = HTMLMaelstromElement(this.inner, objs);
    element.root.appendChild(inner);
  },

  render: function(element, objs, comp) {
    this._if.render(element.previousElementSibling, objs,
        this._if.getCode().execute(objs));
  },

  getCode: function() {
    return this.compare;
  }
};
