var AST = require("./identifiers.js").AST;
var HTMLVariableElement = require("../html/HTMLVariableElement.js");
var HTMLProcessorElement = require("../html/HTMLProcessorElement.js");

var Template = module.exports = {
  create: function(parsed) {
    var template = {
      ast: parsed,
      root: document.createDocumentFragment(),
      variables: {},
      processors: {}
    };
    global.tmpl = template;

    Template.make(template, template.root, template.ast.childs);
    return template;
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
          dom = document.createTextNode(el.text);
          break;
        case AST.VARIABLETEXTFRAGMENT:
          var cn = generateVariableClassName();
          dom = HTMLVariableElement(cn);
          if(!tmpl.variables[el.name]) {
            tmpl.variables[el.name] = [];
          }
          tmpl.variables[el.name].push([Template.VAR_TEXT, cn, el.name, null]);
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
        case AST.PROCESSOR:
          var cn = generateProcessorClassName();
          dom = HTMLProcessorElement(cn);
          el.processor.cn = cn;
          tmpl.processors[cn] = el.processor;
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
            var cn = generateVariableClassName();
            tmpl.variables[res[i]].push([Template.VAR_ATTR, cn, key, val]);
            el.classList.add(cn);
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
            var cn = generateVariableClassName();
            tmpl.variables[res[i]].push([Template.VAR_STYLE, cn, key, val]);
            el.classList.add(cn);
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

var vID = 0;
function generateVariableClassName() {
  return "__maelstrom-variable-" + (vID++) + "__";
};

var pID = 0;
function generateProcessorClassName() {
  return "__maelstrom-processor-" + (pID++) + "__";
}
