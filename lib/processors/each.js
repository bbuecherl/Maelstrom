var Processor = require("../core/Processor.js");

var each = module.exports = function(ast, token) {
  Processor.call(this, ast, token);
  this.childs = true;
  var split = this.token.line.split(" ");
  this.value = split.shift();
  split.shift();
  this.array = JSON.parse(split.join(" "));
  this.content = document.createDocumentFragment();
};

each.prototype = {
  render: function(element) {
    for(var i = 0; i < this.array.length; ++i) {
      var c = this.content.cloneNode(true);
      element.appendChild(c);
    }
  }
};
