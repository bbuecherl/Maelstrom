var Maelstrom = require("../index");
//or require("../register");

var TestTemplate = Maelstrom.compile("./test.maelstrom");
//or var TestTemplate = require("./test.maelstrom");

var objToWatch = {
  val: 15
};

var el = new TestTemplate(objToWatch);
// or var el = TestTemplate.render(objToWatch);

//document.body.appendChild(el);
