var _ = require("regexgen.js");

var Identifiers = module.exports = {
  Token: {
    UNKNOWN: 0,
    TEXT: 1,
    HTML: 2,
    PROCESSOR: 3,
    IGNORED: 4,
    MIXIN: 5
  },

  AST: {
    UNKNOWN: 0,
    TEMPLATE: 1,
    HTMLNODE: 2,
    HTMLEND: 3,
    PROCESSOR: 4,
    TEXT: 5,
    TEXTFRAGMENT: 6,
    VARIABLETEXTFRAGMENT: 7,
    MIXIN: 8
  },

  Code: {
    TEXT: 0,
    ATTR: 1,
    STYLE: 2,
    PROCESSOR: 3
  },

  RegEx: {
    CODE: _(
      "{{",
        _.capture( _.anyCharBut("}}").repeat() ),
      "}}",
      _.searchAll()
    ),
    SIMPLE_CODE: /^[0-9a-z_\.\[\]]+$/i,
    VARIABLE: /\{\{([^\}]+)\}\}/gi,
    HTMLID: /^\#[\w\-]+/i,
    HTMLCLASSES: /^\.[\w\-\.]+/i,
    DOUBLEQUOTE: /^\"(.*)\"$/,
    SINGLEQUOTE: /^\'(.*)\'$/,
    HTMLTags: new RegExp("^(html|base|head|link|meta|style|title" +
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
      "|plaintext|spacer|strike|tt|xmp)([\#|\(|\[|\.|\ |\n])", "i")
  }
};
