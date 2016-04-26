var path = require("path");

var Processor = module.exports = function(ast, token) {
  this.ast = ast;
  this.token = token;
};

Processor.get = function(name) {
  try {
    return require(path.join(__dirname, "..", "processors", name + ".js"));
  } catch(e) {
    console.warn(e);
    return null;
  }
};

Processor.init = function(processors, element) {
  Object.keys(processors).forEach(function(key) {
    console.dir(element.querySelector("." + key));
    processors[key].render(element.querySelector("." + key).root);
  });
};
