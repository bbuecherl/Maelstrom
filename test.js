var path = require("path");
var electron = require("electron");
var Gaze = require("gaze");

var URL = "file://" + path.join(__dirname, "test.html");

electron.app.on("ready", function() {
  var win = new electron.BrowserWindow({
    width: 1000,
    height: 700
  });

  reload();

  win.webContents.openDevTools();
  var gaze = new Gaze(["**"]);
  gaze.on("all", reload);

  function reload() {
    win.loadURL(URL);
  }
});

electron.app.on("window-all-closed", function() { electron.app.quit() });
