var ElementProto = Object.create(HTMLElement.prototype);
ElementProto.createdCallback = function() {
  this.root = this.createShadowRoot();
};

document.registerElement("maelstrom-processor", {
  prototype: ElementProto
});

module.exports = function(cn) {
    var el = document.createElement("maelstrom-processor");
    el.className = cn;
    return el;
};
