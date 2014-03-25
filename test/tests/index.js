var expect = chai.expect,
    blob = document.getElementById("blob"),

    $htmlTags = [
        "body", "section", "nav", "article", "aside", "h1", "h2", "h3", "h4", "h5", "h6", "header", 
        "footer", "address", "main", "p", "pre", "blockquote", "ol", "ul", "li", "dl", "dt", "dd",
        "figure", "figcaption", "div", "a", "em", "strong", "small", "s", "cite", "q", "dfn", "abbr",
        "data", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "ruby", "rt",
        "rp", "bdi", "bdo", "span", "ins", "del", "canvas", "embed", "object", "param", "meta",
        "video", "audio", "source", "track", "map", "svg", "math", "table", "caption", "tr", "colgroup",
        "col", "tbody", "thead", "tfoot", "td", "th", "form", "formset", "legend", "label", "button",
        "select", "datalist", "optgroup", "option", "textarea", "keygen", "output", "progress", "meter",
        "details", "summary", "menu", "menuitem", "style", "script", "noscript", "html", "head", "base",
    ], $slashTags = [
        "br", "hr", "input", "img", "meta", "link", "wbr", "area"
    ],

    tmp,
    tmplStr,
    tmpl,
    sandbox,
    test,

    removeControl = function(str) {
        return str.replace("\u0091","").replace("\u0092","");
    };

describe("Static Templates", function() {
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        sandbox.stub(blob, "appendChild");
    });
    afterEach(function() {
        sandbox.restore();
    });

    describe("//comments", staticComments);
    describe("<>HTML Elements", staticHtml);
    describe("#id", staticId);
    describe(".class", staticClass);
    describe("()attributes", staticAttrs);
    describe("{}styles", staticStyles);
    describe("\"\"content", staticContent);
});

describe("Dynamic Templates", function() {
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        sandbox.stub(blob, "appendChild");
    });
    afterEach(function() {
        sandbox.restore();
    });

    describe("dynamic .render()", dynamicRender);
    describe("dynamic .subscribe()", dynamicSubscribe);
});

describe("Logical Templates", function() {
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        sandbox.stub(blob, "appendChild");
    });
    afterEach(function() {
        sandbox.restore();
    });

});

describe("Performance and Stress tests", performance);
