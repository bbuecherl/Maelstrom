var Processor = require("../core/Processor.js");
var HTMLMaelstromElement = require("../html/HTMLMaelstromElement");

var each = module.exports = function(ast, token, AST, filePath) {
  Processor.call(this, ast, token, AST, true, filePath);
  var split = this.token.line.split(" ");
  this.value = split.shift();
  split.shift();
  this.rightSide = split.join(" ").trim();

  this.array = Processor.parseArgument(this.rightSide);
  if(!this.array) {
    throw new SyntaxError("Could not parse argument: " + this.rightSide);
  }
};

each.prototype = {
  render: function(element, objs, arr) {
    element.root.innerHTML = "";
    if(arr) {
      for(var i = 0; i < arr.length; ++i) {
        var obj = {};
        obj[this.value] = arr[i];
        var inner = HTMLMaelstromElement(this.inner, objs, obj);
        element.root.appendChild(inner);
      }
    }
  },

  getCode: function() {
    return this.array;
  }
};
