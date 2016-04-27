var transformer = require("jstransformer");
var Processor = require("../core/Processor.js");

var each = module.exports = function(ast, token, AST, filePath) {
  Processor.call(this, ast, token, AST, false, filePath);
  try {
    this.transformer = transformer(require("jstransformer-" +
        this.token.line.split(" ").shift()));
    this.content = this.transformer.render(token.childs.reduce(function(prev,
        current) {
          return prev + "\n" + current.line;
    }, "")).body;
    console.log(this.content);
  } catch(e) {
    console.log("failed to transform");
    this.transformer = false;
    this.content = "";
  }
};

each.prototype = {
  render: function(element, objs) {
    element.innerHTML = this.content;
  }
};
