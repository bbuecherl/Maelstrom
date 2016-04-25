var Token = require("./Token.js");

var AST = module.exports = {
  generate: function(tokens) {
    var out = {type: AST.TEMPLATE, childs: AST.createChilds(tokens)};
    return out;
  },

  createChilds(tokens) {
    var childs = [];
    for(var i = 0; i < tokens.length; ++i) {
      var ast = AST.create(tokens[i]);
      if(ast)
        childs.push(ast);
    }
    return childs;
  },

  create: function(token) {
    var ast = {};
    switch(token.type) {
      case Token.TEXT:
        ast.type = AST.TEXT;
        ast.childs = [];
        var split = token.line.split(/\{\{|\}\}/g);
        console.log(split);
        for(var i = 0; i < split.length; i += 2) {
          ast.childs.push(AST.createTextFragment(split[i]));
          if(split[i + 1]) {
            ast.childs.push(AST.createVariableTextFragment(split[i + 1]));
          }
        }
        break;
      case Token.HTML:
        ast.tag = token.tag;
        if(AST.SELFCLOSING.indexOf(token.tag) !== -1) {
          ast.type = AST.HTMLEND;
        } else {
          ast.type = AST.HTMLNODE;
          ast.childs = AST.createChilds(token.childs);
        }
        token.line = token.line.replace(AST.HTMLID, function(match) {
          ast.id = match.substr(1);
          return "";
        });
        token.line = token.line.replace(AST.HTMLCLASSES, function(match) {
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
        break;
      case Token.PROCESSOR:
        ast.type = AST.PROCESSOR;
        ast.tag = token.tag;
        // TODO parse ast function
        ast.childs = AST.createChilds(token.childs);
        break;
      case Token.IGNORED:
        return null;
      default:
        console.warn("Unknown Token: " + JSON.stringify(token));
        return null;
    }
    return ast;
  },

  createTextFragment: function(text) {
    return {
      type: AST.TEXTFRAGMENT,
      text: text
    };
  },

  createVariableTextFragment: function(name) {
    return {
      type: AST.VARIABLETEXTFRAGMENT,
      name: name
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
        var val = attr.join("=").trim().replace(AST.DOUBLEQUOTE,
            function(match) {
          return match;
        }).replace(AST.SINGLEQUOTE, function(match) {
          return match;
        });
        out[key] = val;
      }
    }
    return out;
  },

  UNKNOWN: 0,
  TEMPLATE: 1,
  HTMLNODE: 2,
  HTMLEND: 3,
  PROCESSOR: 4,
  TEXT: 5,
  TEXTFRAGMENT: 6,
  VARIABLETEXTFRAGMENT: 7,

  SELFCLOSING: ["area", "base", "br", "col", "command", "embed", "hr", "img",
    "input", "keygen", "link", "meta", "param", "source", "track", "wbr"],
  HTMLID: /^\#[\w\-]+/i,
  HTMLCLASSES: /^\.[\w\-\.]+/i,
  DOUBLEQUOTE: /^\"(.*)\"$/,
  SINGLEQUOTE: /^\'(.*)\'$/,
};
