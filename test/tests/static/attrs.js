var staticAttrs = function() {
    it("should add attributes", function() {
        tmplStr = "input(value=\"test\")";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].value=="test"
                && value.childNodes[0].getAttribute("value") == "test");
        }, "test");
        sinon.assert.calledWith(blob.appendChild, test);
    });

    it("should add multiple attributes", function() {
        tmplStr = "input(value =  \"test\"  ,  placeholder= \"testing\",width=\"3000\")";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].value == "test"
                && value.childNodes[0].getAttribute("value")=="test"
                && value.childNodes[0].getAttribute("placeholder")=="testing"
                && value.childNodes[0].getAttribute("width")=="3000");
        }, "test");
        sinon.assert.calledWith(blob.appendChild, test);
    });

    it("should render static placeholders inside attributes", function() {
        tmplStr = "input(value=\"hello, [[$test]]!\")";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);
        tmpl.render({test: "world"});

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].value == "hello, world!");
        }, "test");
        sinon.assert.calledWith(blob.appendChild, test);
    });


    it("should append static placeholders inside attributes after rendering", function() {
        tmplStr = "input(value=\"hello, [[$test]]!\")";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.render({test: "world"});
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].value == "hello, world!");
        }, "test");
        sinon.assert.calledWith(blob.appendChild, test);
    });
};
