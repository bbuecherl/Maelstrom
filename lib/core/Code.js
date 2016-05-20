var _ = require("regexgen.js");
var acorn = require("acorn/dist/acorn_loose.js");
var utils = require("../utils/index.js");
var RegEx = require("./identifiers.js").RegEx;
var CodeType = require("./identifiers.js").Code;

var RenderMap = new WeakMap();
var BiDirectionals = ["checked", "selected", "value"];

var Code = module.exports = function(str) {
  this.content = str.trim();
  this.simple = RegEx.SIMPLE_CODE.test(this.content);

  if(!this.simple) {
    var ast = acorn.parse_dammit(this.content, {});
    var params = this.params = [];
    var inner = [];

    (function walk(ast) {
      if(ast.body) {
        for(var i = 0; i < ast.body.length; ++i) {
          walk(ast.body[i]);
        }
      }
      if(ast.declarations) {
        for(var i = 0; i < ast.declarations.length; ++i) {
          walk(ast.declarations[i]);
        }
      }
      if(ast.left) {
        walk(ast.left);
      } if(ast.right) {
        walk(ast.right);
      } if(ast.argument) {
        walk(ast.argument);
      } if(ast.init) {
        walk(ast.init);
      } if(ast.test) {
        walk(ast.test);
      } if(ast.update) {
        walk(ast.update);
      }

      if(ast.type === "VariableDeclaration") {
        for(var j = 0; j < ast.declarations.length; ++j) {
          inner.push(ast.declarations[j].id.name);
        }
      } else if(ast.type === "Identifier" && params.indexOf(ast.name) === -1) {
        params.push(ast.name);
      }
    })(ast);

    for(var i = 0; i < inner.length; ++i) {
      var index = this.params.indexOf(inner[i]);
      if(index !== -1) {
        this.params.splice(index, 1);
      }
    }

    this.funct = new Function(this.params.join(","), this.content);
  }
};

Code.prototype = {
  apply: function(dom, typ, key) {
    this.type = typ;
    this.domClass = dom;
    this.key = key;
  },

  execute: function(objs) {
    if(this.simple) {
      return utils.deepPathFindMulti(objs, this.content);
    } else {
      var args = [];
      for(var i = 0; i < this.params.length; ++i) {
        args[i] = utils.deepPathFindMulti(objs, this.params[i]);
      }
      return this.funct.apply(null, args);
    }
  },

  render: function(el, obj, key) {
    var e = el.root.querySelector("." + this.domClass);

    var newVal = this.execute([obj]);

    switch(this.type) {
      case CodeType.TEXT:
        e.textContent = newVal;
        break;
      case CodeType.ATTR:
        if(BiDirectionals.indexOf(this.key) !== -1) {
          var renders = RenderMap.get(e);
          if(!renders) {
            RenderMap.set(e, renders = []);
          }
          if(renders.indexOf(this.domClass) === -1) {
            renders.push(this.domClass);
            e.addEventListener("change", function() {
              obj[key] = toTypeOf(obj[key], e[this.key]);
            }.bind(this), false);
          }
        }

        e[this.key] = newVal;
        break;
      case CodeType.STYLE:
        e.style[this.key] = newVal;
        break;
      case CodeType.PROCESSOR:
        this.key.processors[this.domClass].render(e, [obj], newVal);
        break;
    }
  }
};

Code.parse = function(str) {
  var out = [];
  RegEx.CODE.exec("no");
  var res = RegEx.CODE.exec(str);
  if(res) {
    for(var i = 1; i < res.length; ++i) {
      out.push(new Code(res[i]));
    }
  }
  return out;
};

function toTypeOf(o, n) {
  switch(typeof o) {
    case "string":
      return n + "";
    case "number":
      return Number(n);
    case "boolean":
      return !!n;
  }
  return n;
}
