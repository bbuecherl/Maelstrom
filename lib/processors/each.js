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

  this.array = Processor.parseArgument(this.rightSide);
  if(!this.array) {
    throw new SyntaxError("Could not parse argument: " + this.rightSide);
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
