    /**
     * Template element constructor
     * @constructor
     * @private
     *
     * @param {TemplateProcessor} proc template processor to be build on
     */
    var TemplateElement = function(proc) {
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

        if(typeof proc.childs !== "undefined")
            for(var i = 0; i < proc.childs.length; ++i)
                this.domElement.appendChild(proc.childs[i].build().get());
    };

    TemplateElement.prototype = {
        get: function() {
            return this.domElement;
        },

        setContent: function(str) {
            this.contents = str;
            this.textNode.textContent = str.replace($contentPre, "").replace($contentClose, "");
        },

        setAttribute: function(name, value) {
            this.domElement.setAttribute(name, value);
        },

        /**
         * Function to set styles to an element
         * @private
         *
         * @param {Element} elm element
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
