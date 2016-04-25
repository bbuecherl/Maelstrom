require("object.observe");

var Observer = module.exports = {
  observe: function(obj, template, el) {
    var o = Object.observe(obj, function(changes) {
      for(var i = 0; i < changes.length; ++i) {
        Observer.changed(changes[i].name, obj, template, el);
      }
    });

    Object.keys(obj).forEach(function(key) {
      Observer.changed(key, obj, template, el);
    });
  },

  changed: function(key, obj, template, el) {
    if(template.variables[key]) {
      for(var i = 0; i < template.variables[key].length; ++i) {
        var v = template.variables[key][i];
        var e = el.root.querySelector("." + v[1]);

        console.log("changed", key, v);

        switch(v[0]) {
          case 0: // Template.VAR_STYLE:
            e.style[v[2]] = Observer.update(v[3], obj);
            break;
          case 1: // Template.VAR_ATTR:
            e[v[2]] = Observer.update(v[3], obj);
            break;
          case 2: // Template.VAR_TEXT:
            e.textContent = deepPathFind(obj, v[2]);
            break;
        }
      }
    }
  },

  update: function(value, obj) {
    console.log(value, obj);
    return value.replace(/\{\{([^\}]+)\}\}/gi, function(match, p1) {
      return deepPathFind(obj, p1);
    });
  }
};

function deepPathFind(obj, path) {
  var split = path.split(".");
  for(var i = 0; i < split.length; ++i) {
    obj = obj[split[i]];
  }
  return obj;
}
