var is = require("node-is");
var utils = require("./index.js");

var map = module.exports = function() {
  var obj = {};

  for(var i = 0, prop; i < arguments.length; ++i) {
    prop = arguments[i];
    if(is.Function(prop)) {
      prop(obj);
    } else if(is.Object(prop)) {
      if(prop.value) {
          obj[prop.name] = prop.value;
      } else {
        property(prop.name, prop.obj, prop.key, prop.default, prop.check,
            prop.flags, obj)
      }
    }
  }

  return obj;
};

map.prop = function(name, obj, key, defaultValue, check, flags) {
  if(!key) {
    return function(o) {
      o[name] = obj;
    };
  } else {
    return property.bind(null, name, obj, key, defaultValue, check, flags);
  }
};

map.WRITE = 0x0;
map.READONLY = 0x1;

function property(name, obj, key, defaultValue, check, flags, o) {
  Object.defineProperty(o, name, {
    enumerable: true,
    configurable: false,

    set: flags !== map.READONLY ? function(val) {
      console.log("setter");
      
      if(is.Function(check) && !check(val))
        return;

      var split = key.split(".");
      for(var i = 0, k; i < split.length - 1; ++i) {
        k = split[i];
        if(obj.hasOwnProperty(k)) {
          obj = obj[k];
        } else {
          obj[k] = {};
        }
      }
      obj[split.pop()] = val;
    } : undefined,

    get: function() {
      try {
        return utils.deepPathFind(obj, key, true);
      } catch(e) {
        return defaultValue;
      }
    }
  });

  return o;
}
