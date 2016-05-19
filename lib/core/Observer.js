require("object.observe");
var utils = require("../utils/index.js");

var Observer = module.exports = {
  observe: function(objs, template, el) {
    // build code - key link map
    var LINKMAP = {};
    for(var i = 0, c; i < template.codes.length; ++i) {
      c = template.codes[i];

      if(c.simple) {
        (LINKMAP[c.content] = LINKMAP[c.content] || []).push(c);
      } else {
        for(var j = 0, p; j < c.params.length; ++j) {
          p = c.params[j];
          (LINKMAP[p] = LINKMAP[p] || []).push(c);
        }
      }
    }

    objs.forEach(function(obj) {
      var o = Object.observe(obj, function(changes) {
        for(var i = 0; i < changes.length; ++i) {
          Observer.changed(changes[i].name, obj, template, el, LINKMAP);
        }
      });
      Object.keys(obj).forEach(function(key) {
        Observer.changed(key, obj, template, el, LINKMAP);
      });
    });
  },

  changed: function(key, obj, template, el, LINKMAP) {
    if(LINKMAP[key]) {
      for(var i = 0, c; i < LINKMAP[key].length; ++i) {
        LINKMAP[key][i].render(el, obj, key);
      }
    }
  }
};
