var RegEx = require("../core/identifiers.js").RegEx;

var Attributes = module.exports = {
  parse: function(line, ast) {
/*    var out = {};
    attrs = attrs.split(",");
    for(var i = 0; i < attrs.length; ++i) {
      var attr = attrs[i].trim().split("=");
      if(attr.length == 1) {
        out[attr[0]] = attr[0];
      } else {
        var key = attr.shift();
        var val = attr.join("=").trim().replace(RegEx.DOUBLEQUOTE,
            function(match) {
          return match;
        }).replace(RegEx.SINGLEQUOTE, function(match) {
          return match;
        });
        out[key] = val;
      }
    }
    ast.attrs =  out;*/
    return "";
  }
};
