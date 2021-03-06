var transformer = require("jstransformer");
var Processor = require("../core/Processor.js");

var transform = module.exports = function(ast, token, AST, filePath) {
  Processor.call(this, ast, token, AST, false, filePath);
  var name = this.token.line.split(" ").shift();
  try {
    this.transformer = transformer(require("jstransformer-" +name));

    try {
      this.content = this.transformer.render(token.childs.reduce(function(prev,
          current) {
            return prev + "\n" + current.line;
      }, "")).body;
    } catch(e) {
      console.warn("failed to transform", e);
      this.content = "";
    }
  } catch(e) {
    throw new Error("Could not find transformer, maybe install 'npm install " +
        "jstransformer-" + name + "'. at " + filePath + ":" + token.lineno +
        ":" + token.indent);
    this.transformer = false;
    this.content = "";
  }
};

transform.prototype = {
  render: function(element, objs) {
    element.root.innerHTML = this.content;
  }
};
