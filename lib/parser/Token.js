var Token = module.exports = {
  tokenize(line) {
    var token = {
      type: Token.UNKNOWN,
      tag: null,
      intend: 0,
      line: "",
      childs: []
    };

    // trim front and count intend
    line = token.line = line.replace(/^([\s]*)/,
        function(str, p1, p2) {
      token.intend = p1.length;
      return "";
    }).trim();

    if(line.startsWith("//")) {
      token.type = IGNORED;
    } else if(line.startsWith("%")) {
      // lets try a processor
      var split = token.line.split(" ");

      token.type = Token.PROCESSOR;
      token.tag = split.shift().substr(1);
      token.line = split.join(" ");
    } else if(line.startsWith("|")) {
      token.type = Token.TEXT;
      token.line = token.line.substr(1);
    } else if(line.match(/^[\#|\(|\[]/)) {
      token.type = Token.HTML;
      token.tag = "div";
    } else {
      token.line = (token.line + "\n").replace(new RegExp(Token.HTMLTags, "i"),
          function(str, p1, p2) {
        token.type = Token.HTML;
        token.tag = p1.toLowerCase();
        return p2;
      });
    }
    return token;
  },

  UNKNOWN: 0,
  TEXT: 1,
  HTML: 2,
  PROCESSOR: 3,
  IGNORED: 4,

  HTMLTags: "^(html|base|head|link|meta|style|title" +
    "|address|article|footer|header|h1|h2|h3|h4|h5" +
    "|h6|hgroup|nav|section|dd|div|dl|dt|figcaption" +
    "|figure|hr|li|main|ol|p|pre|ul|a|abbr|b" +
    "|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark" +
    "|q|rp|rt|rtc|ruby|s|samp|small|span|strong" +
    "|sub|sup|time|u|var|wbr|area|audio|map|track" +
    "|video|embed|object|param|source|canvas|noscript" +
    "|script|del|ins|caption|col|colgroup|table|tbody" +
    "|td|tfoot|th|thead|tr|button|datalist|fieldset" +
    "|form|input|label|legend|meter|optgroup|option|output" +
    "|progress|select|textarea|details|dialog|menu|menuitem" +
    "|summary|content|element|shadow|template|acronym|applet" +
    "|basefont|big|blink|center|command|content|dir|font" +
    "|frame|frameset|isindex|keygen|listing|marquee|noembed" +
    "|plaintext|spacer|strike|tt|xmp)([\#|\(|\[|\.|\ |\n])"
};
