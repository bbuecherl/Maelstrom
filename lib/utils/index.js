var utils = module.exports = {
  isNode: (typeof process != "undefined") && (process.release.name === "node"),
  flatten: function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ?
          flatten(toFlatten) : toFlatten);
    }, []);
  },

  deepPathFind: function deepPathFind(obj, path, flagThrow) {
    var split = path.split(".");
    for(var i = 0; i < split.length; ++i) {
      if(obj.hasOwnProperty(split[i]))
        obj = obj[split[i]];
      else if(flagThrow)
        throw new Error("could not find");
    }
    return obj;
  },

  deepPathFindMulti: function deepPathFindMulti(objs, path) {
    for(var j = objs.length - 1, split, obj; j >= 0; --j) {
      split = path.split(".");
      obj = objs[j];

      for(var i = 0; i < split.length; ++i) {
        if(obj.hasOwnProperty(split[i])) {
          obj = obj[split[i]];

          if(split.length === i + 1) {
            return obj;
          }
        } else {
          break;
        }
      }
    }
  },

  toTypeOf: function toTypeOf(o, n) {
    switch(typeof o) {
      case "string":
        return n + "";
      case "number":
        return Number(n);
      case "boolean":
        return !!n;
    }
    return n;
  },

  dashToUpper: function(str) {
    split = str.split("-");
    str = split.shift();
    for(var i = 0; i < split.length; ++i) {
      str += split[i][0].toUpperCase() + split[i].substr(1);
    }
    return str;
  },

  domEmpty(el) {
    while(el.firstChild)
      el.removeChild(el.firstChild);
  }
};
