var staticStyles = function() {
    it("should add styles", function() {
        tmplStr = "div{width=\"200px\"}";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].style.width=="200px");
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });

    it("should add multiple styles", function() {
        tmplStr = "div{width=\"200px\", height= \"33px\"  }";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].style.width == "200px"
                && value.childNodes[0].style.height == "33px");
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });

    it("should render static placeholders inside styles", function() {
        tmplStr = "div{width=\"[[$test]]px\"}";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);
        tmpl.render({test: "15"});

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].style.width == "15px");
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });


    it("should append static placeholders inside styles after rendering", function() {
        tmplStr = "div{width=\"[[$test]]px\"}";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.render({test: "15"});
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);
        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].style.width == "15px");
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });
};
