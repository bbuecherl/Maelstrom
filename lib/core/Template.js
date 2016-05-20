var AST = require("./identifiers.js").AST;
var CodeType = require("./identifiers.js").Code;
var Code = require("./Code.js");
var HTMLVariableElement = require("../html/HTMLVariableElement.js");
var HTMLProcessorElement = require("../html/HTMLProcessorElement.js");
var RegEx = require("./identifiers.js").RegEx;

var Template = module.exports = {
  create: function(parsed) {
    var template = {
      ast: parsed,
      root: document.createDocumentFragment(),
      processors: {},
      codes: []
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
          el.name.apply(cn, CodeType.TEXT);
          tmpl.codes.push(el.name);
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
          if(el.processor.getCode) {
            var code = el.processor.getCode();
            tmpl.codes.push(code);
            code.apply(cn, CodeType.PROCESSOR, tmpl);
          }
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
        var codes = Code.parse(val);

        for(var i = 0; i < codes.length; ++i) {
          var cn = generateVariableClassName();
          codes[i].apply(cn, CodeType.ATTR, key);
          el.classList.add(cn);
          tmpl.codes.push(codes[i]);
        }

        el[key] = val;
      });
    }
    if(ast.styles) {
      Object.keys(ast.styles).forEach(function(key) {
        var val = ast.styles[key];
        var codes = Code.parse(val);

        for(var i = 0; i < codes.length; ++i) {
          var cn = generateVariableClassName();
          codes[i].apply(cn, CodeType.STYLE, key);
          el.classList.add(cn);
          tmpl.codes.push(codes[i]);
        }

        tmpl.codes.concat(codes);
        el.style[key] = val;
      });
    }
  },
};

var vID = 0;
function generateVariableClassName() {
  return "__maelstrom-variable-" + (vID++) + "__";
};

var pID = 0;
function generateProcessorClassName() {
  return "__maelstrom-processor-" + (pID++) + "__";
}
