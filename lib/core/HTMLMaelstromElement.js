var Observer = require("./Observer.js");
var Processor = require("./Processor.js");

var ElementProto = Object.create(HTMLElement.prototype);

document.registerElement("maelstrom-template", {
  prototype: ElementProto
});

module.exports = function(template, obj) {
  var el = document.createElement("maelstrom-template");
  el.root = el.createShadowRoot();
  el.root.appendChild(template.root.cloneNode(true));
  Observer.observe(obj, template, el);
  Processor.init(template.processors, el.root);
  return el;
};
