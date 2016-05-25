var Identifiers = require("../core/identifiers.js");
var Processor = require("../core/Processor.js");
var Mixin = require("../core/Mixin.js");
var Code = require("../core/Code.js");

var RegEx = Identifiers.RegEx;
var Token = Identifiers.Token;
var Type = Identifiers.AST;

var AST = module.exports = {
  generate: function(tokens, filePath) {
    var out = {type: Type.TEMPLATE, childs: AST.createChilds(tokens,
        filePath)};
    return out;
  },

  createChilds(tokens, filePath) {
    var childs = [];
    var tmp = {lastIf: null};
    for(var i = 0; i < tokens.length; ++i) {
      var ast = AST.create(tokens[i], filePath, tmp);
      if(ast)
        childs.push(ast);
    }
    return childs;
  },

  create: function(token, filePath, tmp) {
    var ast = {};
    switch(token.type) {
      case Token.TEXT:
        ast.type = Type.TEXT;
        ast.childs = parseText(token.line);
        break;
      case Token.HTML:
        ast.tag = token.tag;
        if(AST.SELFCLOSING.indexOf(token.tag) !== -1) {
          ast.type = Type.HTMLEND;
        } else {
          ast.type = Type.HTMLNODE;
          ast.childs = AST.createChilds(token.childs);
        }
        token.line = token.line.replace(RegEx.HTMLID, function(match) {
          ast.id = match.substr(1);
          return "";
        });
        token.line = token.line.replace(RegEx.HTMLCLASSES, function(match) {
          var split = match.split(".");
          split.shift();
          ast.classes = split;
          return "";
        });
        var end;
        if(token.line.startsWith("(") &&
            (end = token.line.indexOf(")")) !== -1) {
          ast.attrs = AST.parseAttributes(token.line.substr(1, end - 1));
          token.line = token.line.substr(end + 1);
        }
        if(token.line.startsWith("[") &&
            (end = token.line.indexOf("]")) !== -1) {
          ast.styles = AST.parseAttributes(token.line.substr(1, end - 1));
          token.line = token.line.substr(end + 1);
        }
        token.line = token.line.trim();
        if(token.line.length > 0) {
          ast.childs.unshift.apply(ast.childs, parseText(token.line));
        }
        break;
      case Token.PROCESSOR:
        return Processor.parse(token, ast, AST, filePath, tmp);
        break;
      case Token.MIXIN:
        console.info("mixins currently not supported");
        return null;
        //return Mixin.parse(token, ast, AST, filePath);
      case Token.IGNORED:
        return null;
      default:
        throw new SyntaxError("Unknown Token: " + token.line + " in " +
            filePath + ":" + token.lineno + ":" + token.indent);
        return null;
    }
    return ast;
  },

  createTextFragment: function(text) {
    return {
      type: Type.TEXTFRAGMENT,
      text: text
    };
  },

  createVariableTextFragment: function(name) {
    return {
      type: Type.VARIABLETEXTFRAGMENT,
      name: new Code(name)
    };
  },

  parseAttributes: function(attrs) {
    var out = {};
    attrs = attrs.split(",");
    for(var i = 0; i < attrs.length; ++i) {
      var attr = attrs[i].trim().split("=");
      if(attr.length == 1) {
        out[attr[0]] = attr[0];
      } else {
        var key = attr.shift();
        var val = attr.join("=").trim().replace(RegEx.DOUBLEQUOTE,
            function(match) {
          return match;
        }).replace(RegEx.SINGLEQUOTE, function(match) {
          return match;
        });
        out[key] = val;
      }
    }
    return out;
  },

  SELFCLOSING: ["area", "base", "br", "col", "command", "embed", "hr", "img",
    "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]
};

function parseText(line) {
  var childs = [];
  var split = line.split(/\{\{|\}\}/g);
  for(var i = 0; i < split.length; i += 2) {
    if(split[i].length > 0) {
      childs.push(AST.createTextFragment(split[i]));
    }
    if(split[i + 1]) {
      childs.push(AST.createVariableTextFragment(split[i + 1]));
    }
  }
  return childs;
}
