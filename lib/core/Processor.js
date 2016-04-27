var path = require("path");
var Template = require("./Template.js");
var ASTType = require("./identifiers.js").AST;

var Processor = module.exports = function(ast, token, AST,
    allowChilds, filePath) {
  this.ast = ast;
  this.token = token;
  this.path = filePath;

  if(allowChilds && token.childs && token.childs.length) {
    this.inner = Template.create(AST.generate(token.childs));
  }
};

Processor.Registered = {};

Processor.get = function(name) {
  try {
    return require(path.join(__dirname, "..", "processors", name + ".js"));
  } catch(e) {
    var processor = Processor.Registered[name];
    if(processor)
      return processor;

    console.warn("Unknown Processor: " + name);
    return null;
  }
};

Processor.parse = function(token, ast, AST, filePath) {
  var Proc = Processor.get(token.tag.toLowerCase());
  if(Proc) {
    ast.type = ASTType.PROCESSOR;
    ast.tag = token.tag;
    ast.processor = new Proc(ast, token, AST, filePath);
    return ast;
  } else {
    return null;
  }
};
