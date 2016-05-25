var Processor = require("../core/Processor.js");
var HTMLMaelstromElement = require("../html/HTMLMaelstromElement.js");
var utils = require("../utils/index.js");

var _if = module.exports = function(ast, token, AST, filePath, tmp) {
  Processor.call(this, ast, token, AST, true, filePath);
  this.compare = Processor.parseArgument("{{return " + this.token.line + ";}}");
  if(!this.compare) {
    throw new SyntaxError("Could not parse argument: " + this.token.line);
  }
  tmp.lastIf = this;
  this._else = null;
  this._elseifs = [];
  this.__rendering = false;
};

_if.prototype = {
  registerElseIf: function(_elseif) {
    this._elseifs.push(_elseif);
  },
  registerElse: function(_else) {
    this._else = _else;
  },

  render: function(element, objs, comp) {
    utils.domEmpty(element.root);
    if(comp) {
      var inner = HTMLMaelstromElement(this.inner, objs);
      element.root.appendChild(inner);
    } else {
      for(var i = 0; i < this._elseifs.length; ++i) {
        if(this._elseifs[i].compare.execute(objs)) {
          this._elseifs[i]._render(element, objs);
          return;
        }
      }

      this._else && this._else._render(element, objs);
    }
  },

  getCode: function() {
    return this.compare;
  }
};
