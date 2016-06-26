var Token = require("./Token.js");
var AST = require("./AST.js");
var RegEx = require("../core/identifiers.js").RegEx;

var Parser = module.exports = {
  parse: function(str, filePath) {
    // concat codes, styles and attributes
    str = str.replace(RegEx.CODE, function(match) {
      return match.replace(RegEx.LINES, "");
    }).replace(RegEx.CSS, function(match) {
      return match.replace(RegEx.LINES, "");
    }).replace(RegEx.ATTRIBUTES, function(match) {
      return match.replace(RegEx.LINES, "");
    });

    // line list
    var lines = str.split(RegEx.LINES);

    // parse tokens
    var tokens = [];
    var list = [];
    for(var i = 0; i < lines.length; ++i) {
      if(lines[i].length < 1) {
        continue;
      }
      var token = Token.tokenize(lines[i], i);

      // bring tokens in correct order
      if(token.indent === 0) {
        tokens.push(token);
      } else {
        for(var j = list.length - 1; j >= 0; --j) {
          var parent = list[j];
          if(parent.indent < token.indent) {
            parent.childs.push(token);
            break;
          }
        }
      }
      list.push(token);
    }

    // generate ast
    var ast = AST.generate(tokens, filePath);

    return ast;
  }
};
