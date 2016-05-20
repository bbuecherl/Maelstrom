var Observer = require("../core/Observer.js");
var utils = require("../utils/index.js");

var ElementProto = Object.create(HTMLElement.prototype);
document.registerElement("maelstrom-template", {
  prototype: ElementProto
});

module.exports = function(template) {
  var el = document.createElement("maelstrom-template");
  var objs = utils.flatten(Array.prototype.slice.call(arguments, 1));
  el.root = el.createShadowRoot();
  el.root.appendChild(template.root.cloneNode(true));
  Observer.observe(objs, template, el);
  return el;
};
