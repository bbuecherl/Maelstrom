var dynamicRender = function() {
    it("should rerender after calling render again", function(done) {
        tmplStr = "div(name=\"[[$name]]\"){width=\"[[$width]]px\"} with [[$content]]";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.render({width: "10", name: "test", content: "content"});
        tmpl.append(blob);

        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].style.width == "100px"
                && value.childNodes[0].getAttribute("name") == "testing"
                && value.childNodes[0].childNodes[0].textContent == "with dynamic content");
        }, "test");

        setTimeout(function() {
            tmpl.render({width: "100", name: "testing", content: "dynamic content"});

            sinon.assert.calledOnce(blob.appendChild);
            sinon.assert.calledWith(blob.appendChild, test);
            done();
        });
    });
};
