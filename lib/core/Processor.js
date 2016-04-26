var path = require("path");
var Template = require("./Template.js");
var ASTType = require("./identifiers.js").AST;

var Processor = module.exports = function(ast, token, AST, allowChilds) {
  this.ast = ast;
  this.token = token;

  if(allowChilds && token.childs && token.childs.length) {
    this.inner = Template.create(AST.generate(token.childs));
  }
};

Processor.get = function(name) {
  try {
    return require(path.join(__dirname, "..", "processors", name + ".js"));
  } catch(e) {
    console.warn("Unknown Processor: " + name);
    return null;
  }
};

Processor.parse = function(token, ast, AST) {
  var Proc = Processor.get(token.tag.toLowerCase());
  if(Proc) {
    ast.type = ASTType.PROCESSOR;
    ast.tag = token.tag;
    ast.processor = new Proc(ast, token, AST);
    return ast;
  } else {
    return null;
  }
};
