var staticContent = function() {
    it("should add content to an element", function() {
        tmplStr = "div with test content";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].childNodes[0].textContent == "with test content");
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });

    it("should add multiline content to an element", function() {
        tmplStr = "div with test content\n" 
                + "    | and multiple lines";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].childNodes.length===2  
                && value.childNodes[0].childNodes[0].textContent == "with test content"
                && value.childNodes[0].childNodes[1].textContent == "and multiple lines");
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });

    it("should render static placeholders inside content", function() {
        tmplStr = "div hello, [[$test]]!";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.render({test: "world"});
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].childNodes.length===1  
                && value.childNodes[0].childNodes[0].textContent == "hello, world!");
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });
};
