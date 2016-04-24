var Observer = require("./Observer.js");

var ElementProto = Object.create(HTMLElement.prototype);

document.registerElement("maelstrom-template", {
  prototype: ElementProto
});

module.exports = function(template, obj) {
  var el = document.createElement("maelstrom-template");
  el._ = template;
  el.$ = Observer.observe(obj, el._);
  el.createShadowRoot().appendChild(el._.root.cloneNode(true));
  return el;
};
