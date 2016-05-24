var Type = require("../core/identifiers.js").Token;
var RegEx = require("../core/identifiers.js").RegEx;
var Token = module.exports = {
  init(lineno) {
    return {
      type: Type.UNKNOWN,
      tag: null,
      indent: 0,
      line: "",
      lineno: lineno,
      childs: []
    };
  },

  tokenize(line, lineno) {
    var token = Token.init(lineno);

    // trim front and count indent
    line = token.line = line.replace(/^([\s]*)/,
        function(str, p1, p2) {
      token.indent = p1.length;
      return "";
    }).trim();

    if(line.startsWith("//")) {
      token.type = Type.IGNORED;
    } else if(line.startsWith("%")) {
      // lets try a processor or mixin
      var split = token.line.split(" ");

      token.tag = split.shift().substr(1);
      token.line = split.join(" ");
      if(token.tag.charCodeAt(0) < 97) {
        token.type = Type.MIXIN;
      } else {
        token.type = Type.PROCESSOR;
      }
    } else if(line.startsWith("|")) {
      token.type = Type.TEXT;
      token.line = token.line.substr(1);
    } else if(line.match(/^[\#|\(|\[]/)) {
      token.type = Type.HTML;
      token.tag = "div";
    } else {
      token.line = (token.line + "\n").replace(RegEx.HTMLTags,
          function(str, p1, p2) {
        token.type = Type.HTML;
        token.tag = p1.toLowerCase();
        return p2;
      });
    }
    return token;
  }
};
