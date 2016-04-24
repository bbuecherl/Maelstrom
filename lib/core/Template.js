var AST = require("../parser/AST.js");
var HTMLMaelstromElement = require("./HTMLMaelstromElement.js");

var Template = module.exports = {
  create: function(parsed) {
    var template = {
      ast: parsed,
      root: document.createDocumentFragment(),
      variables: {}
    };

    Template.make(template, template.root, template.ast.childs);
    return HTMLMaelstromElement.bind(null, template);
  },

  make: function(tmpl, root, childs) {
    for(var i = 0; i < childs.length; ++i) {
      var el = childs[i];
      var dom;
      switch(el.type) {
        case AST.TEXT:
          dom = document.createDocumentFragment();
          Template.make(tmpl, dom, el.childs);
          break;
        case AST.TEXTFRAGMENT:
          dom = document.createTextNode();
          dom.textContent = el.text;
          break;
        case AST.VARIABLETEXTFRAGMENT:
          dom = document.createTextNode();
          if(!tmpl.variables[el.name]) {
            tmpl.variables[el.name] = [];
          }
          tmpl.variables[el.name].push([Template.VAR_TEXT, dom, null, el.name]);
          break;
        case AST.HTMLEND:
          dom = document.createElement(el.tag);
          Template.applyAttrsAndStyles(tmpl, dom, el);
          break;
        case AST.HTMLNODE:
          dom = document.createElement(el.tag);
          Template.applyAttrsAndStyles(tmpl, dom, el);
          Template.make(tmpl, dom, el.childs);
          break;
        default:
          return;
      }
      root.appendChild(dom);
    }
  },

  applyAttrsAndStyles: function(tmpl, el, ast) {
    if(ast.attrs) {
      Object.keys(ast.attrs).forEach(function(key) {
        var val = ast.attrs[key];
        var res = Template.VARIABLE.exec(val);
        if(res) {
          for(var i = 1; i < res.length; ++i) {
            if(!tmpl.variables[res[i]]) {
              tmpl.variables[res[i]] = [];
            }
            tmpl.variables[res[i]].push([Template.VAR_ATTR, el, key, val]);
          }
        }
        el[key] = val;
      });
    }
    if(ast.styles) {
      Object.keys(ast.styles).forEach(function(key) {
        var val = ast.styles[key];
        var res = Template.VARIABLE.exec(val);
        if(res) {
          for(var i = 1; i < res.length; ++i) {
            if(!tmpl.variables[res[i]]) {
              tmpl.variables[res[i]] = [];
            }
            tmpl.variables[res[i]].push([Template.VAR_STYLE, el, key, val]);
          }
        }
        el.style[key] = val;
      });
    }
  },

  VARIABLE: /\{\{([^\}]+)\}\}/gi,
  VAR_STYLE: 0,
  VAR_ATTR: 1,
  VAR_TEXT: 2
};
