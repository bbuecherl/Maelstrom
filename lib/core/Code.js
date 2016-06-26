var _ = require("regexgen.js");
var acorn = require("acorn/dist/acorn_loose.js");
var utils = require("../utils/index.js");
var RegEx = require("./identifiers.js").RegEx;
var CodeType = require("./identifiers.js").Code;

var RenderMap = new WeakMap();
var BiDirectionals = ["checked", "selected", "value"];

var Code = module.exports = function(str) {
  this.content = str.trim();
  this.updater = null;

  if(RegEx.SIMPLE_CODE.test(this.content)) {
    this.content = "return " + this.content + ";";
  }

  var ast = acorn.parse_dammit(this.content, {});
  var params = this.params = [];
  var inner = [];

  (function walk(ast) {
    if(ast.body) {
      for(var i = 0; i < ast.body.length; ++i) {
        walk(ast.body[i]);
      }
    } if(ast.declarations) {
      for(var i = 0; i < ast.declarations.length; ++i) {
        walk(ast.declarations[i]);
      }
    } if(ast.left) {
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
    } if(ast.object) {
      walk(ast.object);
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
};

Code.prototype = {
  bind: function(clas, updater) {
    this.domClass = clas;
    this.updater = updater;
    console.log(this.updater);
  },

  execute: function(objs) {
    var args = [];
    for(var i = 0; i < this.params.length; ++i) {
      args[i] = utils.deepPathFindMulti(objs, this.params[i]);
    }
    return this.funct.apply(null, args);
  },

  render: function(el, obj, key) {
    var e = el.root.querySelector("." + this.domClass);
    var objs = [obj];
    console.log(this.updater);
    this.updater && this.updater(this.execute(objs), e, objs);
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
