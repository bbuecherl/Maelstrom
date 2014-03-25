var dynamicSubscribe = function() {
    it("should rerender after changing the subscribed object", function(done) {
        var obj = {width: "10", name: "test", content: "content"};
        tmplStr = "div(name=\"[[$name]]\"){width=\"[[$width]]px\"} with [[$content]]";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.subscribe(obj);
        tmpl.append(blob);

        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].style.width == "100px"
                && value.childNodes[0].getAttribute("name") == "test"
                && value.childNodes[0].childNodes[0].textContent == "with dynamic content");
        }, "test");

        setTimeout(function() {
            obj.width = "100";
            obj.content = "dynamic content";

            sinon.assert.calledOnce(blob.appendChild);
            sinon.assert.calledWith(blob.appendChild, test);
            done();
        });
    });

    it("should not rerender after unsubscribing", function(done) {
        var obj = {width: "10", name: "test", content: "content"};
        tmplStr = "div(name=\"[[$name]]\"){width=\"[[$width]]px\"} with [[$content]]";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.subscribe(obj);
        tmpl.append(blob);

        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].style.width == "10px"
                && value.childNodes[0].getAttribute("name") == "test"
                && value.childNodes[0].childNodes[0].textContent == "with content");
        }, "test");

        setTimeout(function() {
            tmpl.unsubscribe();
            obj.width = "100";
            obj.content = "dynamic content";

            sinon.assert.calledOnce(blob.appendChild);
            sinon.assert.calledWith(blob.appendChild, test);
            done();
        });
    });
};
