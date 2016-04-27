var fs = require("fs");
var path = require("path");

var fs_wrap = module.exports = {
  // process
  cwd: process.cwd,

  // path
  resolve: path.resolve,
  dirname: path.dirname,

  // fs
  readFileSync: fs.readFileSync
};
