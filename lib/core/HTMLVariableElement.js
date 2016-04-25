var ElementProto = Object.create(HTMLElement.prototype);

document.registerElement("maelstrom-variable", {
  prototype: ElementProto
});

module.exports = function(cn) {
    var el = document.createElement("maelstrom-variable");
    el.textContent = "";
    el.className = cn;
    return el;
};
