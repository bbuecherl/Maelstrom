var Processor = require("../core/Processor.js");
var Code = require("../core/Code.js");
var HTMLMaelstromElement = require("../html/HTMLMaelstromElement");

var each = module.exports = function(ast, token, AST, filePath) {
  Processor.call(this, ast, token, AST, true, filePath);
  var split = this.token.line.split(" ");
  this.value = split.shift();
  split.shift();
  this.rightSide = split.join(" ").trim();
  this.needsLiveUpdates = false;

  Code.parse(this.rightSide);

  if(this.rightSide.startsWith("[")) {
    this.array = JSON.parse(split.join(" "));
  } else {
    this.array = false;
  }

  for(var i = 0, c; i < this.inner.codes.length; ++i) {
    c = this.inner.codes[i];
    if(c.simple) {
      if(c.content !== this.value) {
        this.needsLiveUpdates = true;
        break;
      }
    } else {
      for(var j = 0; j < c.params.length; ++j) {
        if(c.params[j] !== this.value) {
          this.needsLiveUpdates = true;
          break;
        }
      }
      if(this.needsLiveUpdates) {
        break;
      }
    }
  }
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
