var shady = require("shady-css-parser");
var Code = require("../core/Code.js");
var RegEx = require("../core/identifiers.js").RegEx;
var utils = require("../utils/index.js");

function MaelstromNodeFactory() { }
MaelstromNodeFactory.prototype = Object.create(shady.NodeFactory.prototype);

MaelstromNodeFactory.prototype.expression = function(text) {
  if(RegEx.CSS_CODE.test(text)) {
    return {
      type: "codeExpression",
      code: text.replace(RegEx.CSS_CODE, function(p0, p1) { return p1; })
    };
  } else {
    return shady.NodeFactory.prototype.expression.apply(this, arguments);
  }
};

var CSSParser = new shady.Parser(new MaelstromNodeFactory());

var CSS = module.exports = {
  parse: function(line, ast) {
    var codes = [];
    ast.styles = {};

    line = line.replace(RegEx.CODE, function(p0, p1) {
      codes.push(Code.parse("{{" + p1 + "}}")[0]);
      return "code(" + (codes.length - 1) + ")";
    }) + ";";
    var css = CSSParser.parse(line);

    console.log(line, ast, css, codes);

    for(var i = 0, rule; i < css.rules.length; ++i) {
      rule = css.rules[i];
      if(rule && rule.name)
        ast.styles[utils.dashToUpper(rule.name)] = convert(rule.value, codes);
    }
  }
};

function convert(expr, codes) {
  switch(expr.type) {
    case "codeExpression":
      return codes[expr.code];
    default:
      return expr.text;
  }
};
