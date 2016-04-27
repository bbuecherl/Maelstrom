var url = require("url");
var request = require("sync-request");

var fs_wrap = module.exports = {
  // process
  cwd: function() { return document.location.href; },

  // path
  resolve: url.resolve,
  dirname: function(file) {
    file = file.split("/");
    file.pop();
    return file.join("/");
  },

  // fs
  readFileSync: function(file, options) {
    var res = request("GET", file);
    if(res.statusCode >= 300) {
      console.error("requested file: " + file + " not found");
      return file + " not found";
    } else {
      return res.body;
    }
  }
};
