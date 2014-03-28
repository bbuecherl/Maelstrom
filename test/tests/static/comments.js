var staticComments = function() {
    it("should not render commands", function() {
        tmplStr = "// test";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);
        expect(tmpl.childs.length).to.equal(0);
        expect(blob.appendChild).to.have.callCount(0);
    });
    
    it("should not render block commands", function() {
        tmplStr =   "// test\n    blocked command";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);
        expect(tmpl.childs.length).to.equal(0);
        expect(blob.appendChild).to.have.callCount(0);
    });
    
    it("should not render empty lines", function() {
        tmplStr = "      \n  ";
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);
        expect(tmpl.childs.length).to.equal(0);
        expect(blob.appendChild).to.have.callCount(0);
    });
};