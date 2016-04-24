var Token = require("./Token.js");
var AST = require("./AST.js");

var Parser = module.exports = {
  parse: function(str) {
    // line list
    var lines = str.split(/\r*\n/g);

    // parse tokens
    var tokens = [];
    for(var i = 0; i < lines.length; ++i) {
      if(lines[i].length < 1) {
        continue;
      }
      var token = Token.tokenize(lines[i]);

      // bring tokens in correct order
      if(token.intend === 0) {
        tokens.push(token);
      } else {
        for(var j = tokens.length - 1; j >= 0; --j) {
          var parent = tokens[j];
          if(parent.intend < token.intend) {
            parent.childs.push(token);
            break;
          }
        }
      }
    }

    // generate ast
    var ast = AST.generate(tokens);

    return ast;
  }
};
