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
      codes: [],
      mixins: {},
      mixin_processors: {}
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
          var cn = generateCodeClassName();
          dom = HTMLVariableElement(cn);
          el.name.bind(cn, function(val, element, objs) {
            element.textContent = val;
          });
          tmpl.codes.push(el.name);
          break;
        case AST.HTMLEND:
          dom = document.createElement(el.tag);
          el.id && (dom.id = el.id);
          el.classes && (dom.className = el.classes.join(", "));
          Template.applyAttrsAndStyles(tmpl, dom, el);
          break;
        case AST.HTMLNODE:
          dom = document.createElement(el.tag);
          el.id && (dom.id = el.id);
          el.classes && (dom.className = el.classes.join(", "));
          Template.applyAttrsAndStyles(tmpl, dom, el);
          Template.make(tmpl, dom, el.childs);
          break;
        case AST.PROCESSOR:
          var cn = generateCodeClassName();
          dom = HTMLProcessorElement(cn);
          if(el.processor.getCode) {
            var code = el.processor.getCode();
            tmpl.codes.push(code);
            code.bind(cn, function(val, element, objs) {
              tmpl.processors[cn].render(element, objs, val)
            });
          } if(el.processor._processor === "mixin") {
            tmpl.mixin_processors[el.processor.name] = el.processor;
          }
          el.processor.cn = cn;
          tmpl.processors[cn] = el.processor;
          break;
        case AST.MIXIN:
          var cn = generateCodeClassName();
          dom = HTMLProcessorElement(cn);
          var codes = el.mixin.getCode();
          tmpl.mixins[cn] = el.mixin;
          tmpl.codes.push(code);
          break;
        default:
          // ignore
          return;
      }
      root.appendChild(dom);
    }
  },

  applyAttrsAndStyles: function(tmpl, el, ast) {
    if(ast.attrs) { // TODO Two-way data-binding!
      Object.keys(ast.attrs).forEach(function(key) {
        var val = ast.attrs[key];
        if(val instanceof Code) {
          var cn = generateCodeClassName();
          el.classList.add(cn);
          val.bind(cn, function(val, element, objs) {
            element[key] = val;
          });
          tmpl.codes.push(val);
        } else {
          el[key] = val;
        }
      });
    }
    if(ast.styles) {
      Object.keys(ast.styles).forEach(function(key) {
        var val = ast.styles[key];
        if(val instanceof Code) {
          var cn = generateCodeClassName();
          el.classList.add(cn);
          val.bind(cn, function(val, element, objs) {
            console.log(cn, val, element, objs);
            element.style[key] = val;
          });
          tmpl.codes.push(val);
        } else {
          el.style[key] = val;
        }
      });
    }
  },
};

var vID = 0;
function generateCodeClassName() {
  return "__maelstrom-code-" + (vID++) + "__";
};
