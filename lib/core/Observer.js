require("object.observe");

var Observer = module.exports = {
  observe: function(obj, template) {
    var o = Object.observe(obj, function(changes) {
      for(var i = 0; i < changes.length; ++i) {
        Observer.changed(changes[i].name, obj, template);
      }
    });
    console.log(o, obj, o === obj);

    Object.keys(obj).forEach(function(key) {
      Observer.changed(key, obj, template);
    });
  },

  changed: function(key, obj, template) {
    if(template.variables[key]) {
      for(var i = 0; i < template.variables[key].length; ++i) {
        var v = template.variables[key][i];

        switch(v[0]) {
          case 0: // Template.VAR_STYLE:
            v[1].style[v[2]] = Observer.update(v[3], obj);
            break;
          case 1: // Template.VAR_ATTR:
            console.log(v[1][v[2]]);
            v[1][v[2]] = Observer.update(v[3], obj);
            console.log(v[1][v[2]]);
            break;
          case 2: // Template.VAR_TEXT:
            v[1].textContent = Observer.update(v[3], obj);
            break;
        }
      }
    }
  },

  update: function(value, obj) {
    console.log(value, obj);
    return value.replace(/\{\{([^\}]+)\}\}/gi, function(match, p1) {
      var split = p1.split(".");
      for(var i = 0; i < split.length; ++i) {
        obj = obj[split[i]];
      }
      console.log(value, obj);
      return obj;
    });
  }
};
