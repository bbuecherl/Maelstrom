    /**
     * Template processor constructor
     * @constructor
     * @private
     *
     * @param {string} line template line
     * @param {Object} data template data of child elements
     * @param {TemplateProcessor|Template} parent parent fragment
     * @param {Template} root root template
     * @param {Array} predefined predefined logic variables
     */
    var TemplateProcessor = function(line, data, parent, root) {
        this.line = line;

        this.root = root;
        this.parent = parent;
        this.vars = {};
        this.derived = [];

        var elm, next, list, i, name, tmp, node;

        //Logic Fragment
        if(this.line.startsWith("logic")) {
            this.node = "logic";
            // build structure
            if(data.l.length>0)
                this.childs = buildStructure(this,root,data);
            next="";
        // TextNode
        } else if(this.line.startsWith("|")) {
            this.node = "|";
            next = this.line.slice(1);
        // Node
        } else {
            // build structure
            if(data.l.length>0)
                this.childs = buildStructure(this,root,data);

            //build element
            if(this.line.startsWith("#")||this.line.startsWith(".")) {
                //default is div
                next = this.line;
                this.node = "DIV";
            } else {
                elm = splitByIdentifiers(this.line);
                next = this.line.slice(elm[0].length);
                this.node = elm[0].toUpperCase();
            }
            //classes & ids
            this.classes = "";
            this.id = "";
            while(next.length>0) {
                if(next.startsWith("#")) {
                    elm = splitByIdentifiers(next.slice(1));
                    next = next.slice(elm[0].length+1).trim();

                    this.id = elm[0];
                } else if(next[0].startsWith(".")) {
                    elm = splitByIdentifiers(next.slice(1));
                    next = next.slice(elm[0].length+1).trim();

                    this.classes += " " + elm[0];
                } else {
                    break;
                }
            }

            // attributes
            this.attrs = {};
            if(next.startsWith("(")) {
                for(i = 1; i < next.length;++i) {
                    if(next.startsWith(")",i))
                        break;
                }
                elm = next.slice(1,i).trim();
                next = next.slice(i+1);

                list = splitArgs(elm);

                for(name in list) {
                    if(list[name].contains($varPre)) {
                        tmp = list[name].split($varPre)[1].split($varClose)[0];

                        (this.vars[tmp] = this.vars[tmp] || []).push({
                            type: TemplateProcessor.VType.ATTRIBUTE,
                            link: name,
                            inside: list[name]
                        });
                    } else {
                       this.attrs[name] = list[name];
                    }
                }
            }

            // styles
            this.styles = {};
            if(next.startsWith("{")) {
                for(i=1; i < next.length;++i) {
                    if(next.startsWith("}",i))
                        break;
                }
                elm = next.slice(1,i+1).replace("}","").trim();
                next = next.slice(i+2);

                list = splitArgs(elm);

                for(var n in list) {
                    if(list[n].contains($varPre)) {
                        tmp = list[n].split($varPre)[1].split($varClose)[0];

                        (this.vars[tmp] = this.vars[tmp] || []).push({
                            type: TemplateProcessor.VType.STYLE,
                            link: n,
                            inside: list[n]
                        });
                    } else {
                        this.styles[n] = list[n];
                    }
                }
            }
        }

        // content
        if(next.startsWith(" "))
            next = next.slice(1);
        if(next.length>0  && !isSlashNode(node)) {
            var index = 0;

            this.contents = "";

            while((elm = splitFirst(next, $varPre))) {
                this.contents += elm[0];
                elm = splitFirst(elm[1], $varClose);

                (this.vars[elm[0]] = this.vars[elm[0]] || []).push({
                    type: TemplateProcessor.VType.CONTENT,
                    inside: index++
                });
                //TODO maybe exclude uninitialized values?
                this.contents += $contentPre + $varPre + elm[0] + $varClose + $contentClose;

                next = elm[1];
            }
            this.contents += next;
        }

        //listen on root
        for(var v in this.vars) {
            root.on(v, this.render.bind(this));
        }
    };

    TemplateProcessor.prototype = {
        /**
         * Function to rerender a placeholder
         * @private
         *
         * @param {string} name placeholder name
         * @param {Object} value new value
         */
        render: function(name, value) {
            if(typeof name === "undefined") {
                //todo : render with predefined values
            } else {
                if(this.vars.hasOwnProperty(name)) {
                    for(var i = 0, j, tmp = this.vars[name], link; i < tmp.length; ++i) {
                        link = tmp[i].link;

                        if(tmp[i].type == TemplateProcessor.VType.ATTRIBUTE) {
                            this.attrs[link] = tmp[i].inside.replace($varPre + name + $varClose, value);

                            for(j = 0; j < this.derived.length; ++j)
                                this.derived[j].setAttribute(link, this.attrs[link]);


                        } else if(tmp[i].type == TemplateProcessor.VType.STYLE) {
                            this.styles[link] = tmp[i].inside.replace($varPre + name + $varClose, value);

                            for(j = 0; j < this.derived.length; ++j)
                                this.derived[j].setStyle(link, this.styles[link]);

                        } else if(tmp[i].type == TemplateProcessor.VType.CONTENT) {

                            var t = this.contents,
                                rep = $contentPre + t.split($contentPre)[tmp[i].inside+1]
                                    .split($contentClose)[0] + $contentClose;

                            this.contents = t.replace(rep, $contentPre + value + $contentClose);

                            for(j = 0; j < this.derived.length; ++j)
                                this.derived[j].setContent(t.replace(rep, $contentPre + value + $contentClose));
                        }
                    }
                }
            }
        },

        /**
         * Function to build a derived element
         * @private
         *
         * @returns {TemplateElement} derived element
         */
        build: function(defined) {
            var tmp = new TemplateElement(this, defined);
            this.derived.push(tmp);
            return tmp.get();
        }
    };

    /**
     * List of variable types
     * @private
     * @static
     *
     * @property {Number} ATTRIBUTE 1
     * @property {Number} STYLE 2
     * @property {Number} CONTENT 3
     */
    TemplateProcessor.VType = {
        ATTRIBUTE: 1,
        STYLE: 2,
        CONTENT: 3
    };
