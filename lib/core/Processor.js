var path = require("path");
var Template = require("./Template.js");
var ASTType = require("./identifiers.js").AST;
var Code = require("./Code.js");

var Processor = module.exports = function(ast, token, AST,
    allowChilds, filePath) {
  this.ast = ast;
  this.token = token;
  this.path = filePath;

  if(allowChilds && token.childs && token.childs.length) {
    this.inner = Template.create(AST.generate(token.childs));
  }
};

Processor.get = function(name) {
  try { // first check internal processors
    return require(path.join(__dirname, "..", "processors", name + ".js"));
  } catch(e) {
    console.warn(e);
    try { // look for installed processors in node modules
      return require(name);
    } catch(ex) {
      return null;
    }
  }
};

Processor.parse = function(token, ast, AST, filePath, tmp) {
  var Proc = Processor.get(token.tag.toLowerCase());
  if(Proc) {
    ast.type = ASTType.PROCESSOR;
    ast.tag = token.tag.toLowerCase();
    ast.processor = new Proc(ast, token, AST, filePath, tmp);
    return ast;
  } else {
    throw new SyntaxError("Unknown Processor '" + token.tag.toLowerCase() +
        "' at " + filePath + ":" + token.lineno + ":" + token.indent);
  }
};

Processor.parseArgument = function(arg) {
  arg = arg.trim();
  if(!arg.startsWith("{{")) {
    arg = "{{" + arg + "}}";
  }
  code = Code.parse(arg);
  if(code.length === 1) {
    return code[0];
  }
  return null;
};
