require("object.observe");
var utils = require("../utils/index.js");

var Observer = module.exports = {
  observe: function(objs, template, el) {
    // build code - key link map
    var LINKMAP = {};
    for(var i = 0, c; i < template.codes.length; ++i) {
      c = template.codes[i];

      for(var j = 0, p; j < c.params.length; ++j) {
        p = c.params[j];
        (LINKMAP[p] = LINKMAP[p] || []).push(c);
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
        var code = LINKMAP[key][i];
        code.render(el, obj, key);
      }
    }
  }
};
