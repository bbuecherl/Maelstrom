var staticId = function() {
    it("should add an id to an element", function() {
        tmplStr = "script#testid";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes[0].id == "testid");
        });
        sinon.assert.calledWith(blob.appendChild, test);
        sinon.assert.calledOnce(blob.appendChild);
    });

    it("should add an id to a default element", function() {
        tmplStr = "#testid";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes[0].id == "testid");
        });
        sinon.assert.calledWith(blob.appendChild, test);
        sinon.assert.calledOnce(blob.appendChild);
    });

    it("should add only the last id", function() {
        tmplStr = "script#testid#lastid";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes[0].id == "lastid");
        });
        sinon.assert.calledWith(blob.appendChild, test);
        sinon.assert.calledOnce(blob.appendChild);
    });

    it("should be no id by default ", function() {
        tmplStr = "script";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return typeof value.childNodes[0].id === "undefined" || value.childNodes[0].id.length === 0;
        });
        sinon.assert.calledWith(blob.appendChild, test);
        sinon.assert.calledOnce(blob.appendChild);
    });
};
