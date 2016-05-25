var Processor = require("../core/Processor.js");
var Template = require("../core/Template.js");
var HTMLMaelstromElement = require("../html/HTMLMaelstromElement.js");
var utils = require("../utils/index.js");

var _switch = module.exports = function(ast, token, AST, filePath, tmp) {
  Processor.call(this, ast, token, AST, false, filePath);
  this.value = Processor.parseArgument("{{return " + this.token.line + ";}}");
  if(!this.value) {
    throw new SyntaxError("Could not parse argument: " + this.token.line);
  }
  this._caseChecks = [];
  this._cases = [];
  this._default = null;

  token.childs.forEach(function(token) {
    if(token.tag === "case") {
      this._cases.push(Template.create(AST.generate(token.childs)));
      this._caseChecks.push(Processor.parseArgument("{{return " + token.line +
          ";}}"));
    } else if(token.tag === "default") {
      if(this._default) {
        throw new SyntaxError("only one default statement per switch is " +
            "supported");
      }
      this._default = Template.create(AST.generate(token.childs));
    } else {
      throw new SyntaxError("switch-statement only supports case or default " +
          "childs");
    }
  }.bind(this));
};

_switch.prototype = {
  render: function(element, objs, val) {
    utils.domEmpty(element.root);
    for(var i = 0; i < this._cases.length; ++i) {
      if(val === this._caseChecks[i].execute(objs)) {
        element.root.appendChild(HTMLMaelstromElement(this._cases[i], objs));
        return;
      }
    }
    if(this._default) {
      element.root.appendChild(HTMLMaelstromElement(this._default, objs));
    }
  },

  getCode: function() {
    return this.value;
  }
};
