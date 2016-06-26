var Observer = require("../core/Observer.js");
var utils = require("../utils/index.js");

var ElementProto = Object.create(HTMLElement.prototype);
document.registerElement("maelstrom-element", {
  prototype: ElementProto
});

module.exports = function(template) {
  var el = document.createElement("maelstrom-element");
  var objs = utils.flatten(Array.prototype.slice.call(arguments, 1));
  el.root = el.createShadowRoot();
  el.root.appendChild(template.root.cloneNode(true));

  Object.keys(template.processors).forEach(function(cn) {
    !template.processors[cn].getCode &&
        template.processors[cn].render(el.root.querySelector("." + cn), objs);
  });

  Observer.observe(objs, template, el);
  return el;
};
