var Processor = require("../core/Processor.js");
var HTMLMaelstromElement = require("../html/HTMLMaelstromElement");

var each = module.exports = function(ast, token, AST) {
  Processor.call(this, ast, token, AST, true);
  var split = this.token.line.split(" ");
  this.value = split.shift();
  split.shift();
  this.array = JSON.parse(split.join(" "));
};

each.prototype = {
  render: function(element, objs) {
    for(var i = 0; i < this.array.length; ++i) {
      var obj = {};
      obj[this.value] = this.array[i];
      var inner = HTMLMaelstromElement(this.inner, objs, obj);
      element.appendChild(inner);
    }
  }
};
