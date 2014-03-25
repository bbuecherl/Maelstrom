var performance = function() {
    afterEach(function() {
        blob.innerHTML="";
    });

    it("should render a 11000 line template with classes and styles", function() {
        tmp = [];
        for(var i = 0; i < 100; ++i) {
            tmp = tmp.concat($slashTags.concat($htmlTags));
        }
        console.log(tmp);
        tmplStr = tmp.join(".cl{width=\"10px\"}\n");
        tmpl = Maelstrom.compile(tmplStr);
        tmpl.append(blob);

        expect(tmpl.childs.length).to.equal(11000);
        expect(blob.childNodes.length).to.equal(11000);
    });
};