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
        c = LINKMAP[key][i];
        if(c.simple) {
          console.log("x");
          c.render(el, obj, key);
        }
      }
    }

/*    if(template.variables[key]) {
      for(var i = 0; i < template.variables[key].length; ++i) {
        var v = template.variables[key][i];
        var e = el.root.querySelector("." + v[1]);

        switch(v[0]) {
          case 0: // Template.VAR_STYLE:
            e.style[v[2]] = Observer.update(v[3], obj);
            break;
          case 1: // Template.VAR_ATTR:
            e[v[2]] = Observer.update(v[3], obj);
            break;
          case 2: // Template.VAR_TEXT:
            e.textContent = utils.deepPathFind(obj, v[2]);
            break;
        }
      }
    }*/
  },
};
