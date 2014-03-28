    /**
     * Template element constructor
     * @constructor
     * @private
     *
     * @param {TemplateProcessor} proc template processor to be build on
     * @param {Object} defined predefined internal variables
     */
    var TemplateElement = function(proc, defined) {
        this.processor = proc;

        if(proc.node=="|"||proc.node=="logic") {
            this.domElement = $createFragment();
        } else {
            this.domElement = $createElement(proc.node);

            if(proc.id.length>0)
                this.domElement.id = proc.id;
            if(proc.classes.length>0)
                this.domElement.className = proc.classes.trim();

            for(var name in proc.attrs) {
                this.setAttribute(name, proc.attrs[name]);
            }

            for(name in proc.styles) {
                this.setStyle(name, proc.styles[name]);
            }
        }

        if(typeof proc.contents !== "undefined") {
            this.textNode = $createText("");
            this.setContent(proc.contents);
            this.domElement.appendChild(this.textNode);
        }

        this.redefine(defined);

        if(typeof proc.childs !== "undefined")
            for(var i = 0; i < proc.childs.length; ++i)
                this.domElement.appendChild(proc.childs[i].build(defined));
    };

    TemplateElement.prototype = {
        /**
         * Function to redefine internal variables
         * @private
         *
         * @param {Object} defined internal variables
         */
        redefine: function(defined) {
            this.defined = concatObject(defined, this.defined);
            var value, i, tmp, link;
            for(var name in defined) {
                if(this.processor.vars.hasOwnProperty(name)) {
                    value = defined[name];
                    for(i = 0,tmp = this.processor.vars[name]; i < tmp.length; ++i) {
                        link = tmp[i].link;

                        if(tmp[i].type == TemplateProcessor.VType.ATTRIBUTE) {
                            this.setAttribute(link, tmp[i].inside.replace($varPre + name + $varClose, value));
                        } else if(tmp[i].type == TemplateProcessor.VType.STYLE) {
                            this.setStyle(link, tmp[i].inside.replace($varPre + name + $varClose, value));
                        } else if(tmp[i].type == TemplateProcessor.VType.CONTENT) {
                            var t = this.contents,
                                rep = $contentPre + t.split($contentPre)[tmp[i].inside+1]
                                    .split($contentClose)[0] + $contentClose;
                            this.setContent(t.replace(rep, $contentPre + value + $contentClose));
                        }
                    }
                }
            }
        },

        /**
         * Getter for the DOM element
         * @private
         *
         * @returns {Node} DOM node
         */
        get: function() {
            return this.domElement;
        },

        /**
         * Function to set the text content of this element
         * @private
         *
         * @param {string} str new text content
         */
        setContent: function(str) {
            this.contents = str;
            this.textNode.textContent = str.replace($contentPre, "").replace($contentClose, "");
        },

        /**
         * Function to set attributes on this element
         * @private
         *
         * @param {string} name attribute name
         * @param {string} value value of the attribute
         */
        setAttribute: function(name, value) {
            this.domElement.setAttribute(name, value);
        },

        /**
         * Function to set styles on this element
         * @private
         *
         * @param {string} name style name
         * @param {string} value value of the style rule
         */
        setStyle: function(name, value) {
            name = name.split("-");
            for(var i = 0; i < name.length; ++i) {
                if(i!==0)
                    name[i] = name[i].slice(0,1).toUpperCase()+name[i].slice(1);
            }

            this.domElement.style[name.join("")] = value;
        }
    };
