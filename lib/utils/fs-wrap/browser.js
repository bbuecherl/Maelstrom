var url = require("url");
var http = require("http");
var request = require("sync-request");
var toString = require("stream-to-string");

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
  },
  readFile: function(file, options, callback) {
    var parsed = url.parse(file);
    http.get({
      path: parsed.pathname,
      host: parsed.host
    }, function(res) {
      if(res.statusCode < 400) {
        toString(res, callback);
      } else {
        callback(new Error("could not find file '" + file + "'"));
      }
    }).end();
  }
};
