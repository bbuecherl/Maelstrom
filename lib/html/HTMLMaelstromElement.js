var Observer = require("../core/Observer.js");

var ElementProto = Object.create(HTMLElement.prototype);
document.registerElement("maelstrom-template", {
  prototype: ElementProto
});

module.exports = function(template) {
  var el = document.createElement("maelstrom-template");
  var objs = flatten(Array.prototype.slice.call(arguments, 1));
  el.root = el.createShadowRoot();
  el.root.appendChild(template.root.cloneNode(true));
  Observer.observe(objs, template, el);

  // render processors TODO: live updating
  Object.keys(template.processors).forEach(function(k) {
    template.processors[k].render(el.root.querySelector("." + k).root, objs);
  });
  return el;
};

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ?
        flatten(toFlatten) : toFlatten);
  }, []);
};
