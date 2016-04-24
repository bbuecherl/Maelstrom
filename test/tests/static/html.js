var staticHtml = function() {
    it("should create all 110 html elements (note: testing is the performance leak!)", function() {
        tmp = $slashTags.concat($htmlTags);
        var x = 0;

        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].nodeName==tmp[x].toUpperCase());
        }, "test");

        for(var i = 0; i < tmp.length; ++i, ++x) {
            tmplStr = tmp[i];
            tmpl = Maelstrom.compile(tmplStr);
            tmpl.append(blob);

            expect(tmpl.childs.length).to.equal(1);
            expect(blob.appendChild).to.have.been.calledWith(test);
        }
        expect(blob.appendChild).to.have.callCount(tmp.length);
    });

    it("should create a \"DIV\" element by default", function() {
        tmplStr = "#exampleid";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(1);

        test = sinon.match(function(value) {
            return (value.childNodes.length===1 && value.childNodes[0].nodeName=="DIV");
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });

    it("should create a 110 line template", function() {
        tmp = $slashTags.concat($htmlTags);
        tmplStr = tmp.join("\n");
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(tmp.length);

        test = sinon.match(function(value) {
            if(value.childNodes.length==tmp.length) {
                for(var i = 0; i < tmp.length; ++i)
                    if(value.childNodes[i].nodeName != tmp[i].toUpperCase()) return false;

                return true;
            } else {
                return false;
            }
        }, "test");
        expect(blob.appendChild).to.have.been.calledWith(test);
        expect(blob.appendChild).to.have.callCount(1);
    });
};