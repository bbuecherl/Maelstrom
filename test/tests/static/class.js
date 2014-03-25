var staticClass = function() {
    it("should add a class to an element", function() {
        tmplStr = "script.test";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes[0].className == "test");
        });
        sinon.assert.calledWith(blob.appendChild, test);
        sinon.assert.calledOnce(blob.appendChild);
    });

    it("should add a class to a default element", function() {
        tmplStr = ".test";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes[0].className == "test");
        });
        sinon.assert.calledWith(blob.appendChild, test);
        sinon.assert.calledOnce(blob.appendChild);
    });

    it("should add multiple class to an element", function() {
        tmplStr = "script.test.classes.are.awesome";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes[0].className == "test classes are awesome");
        });
        sinon.assert.calledWith(blob.appendChild, test);
        sinon.assert.calledOnce(blob.appendChild);
    });

    it("should be no class by default", function() {
        tmplStr = "script";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (typeof value.childNodes[0].className === "undefined" || value.childNodes[0].className.length === 0);
        });
        sinon.assert.calledWith(blob.appendChild, test);
        sinon.assert.calledOnce(blob.appendChild);
    });
};
