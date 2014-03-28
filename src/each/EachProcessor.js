    /**
     * Each-logic processor constructor
     * @constructor
     * @private
     *
     * @param {string} line template line
     * @param {Object} data template data of child elements
     * @param {TemplateProcessor|Template} parent parent fragment
     * @param {Template} root root template
     */
    var EachProcessor = function(line, data, parent, root) {
        var arr = splitFirst(line, " in "),
            tmp,
            obj;

        this.root = root;
        this.data = data;
        this.derived = [];
        this.childs = [];

        this.valueIterator = null;
        this.indexIterator = null;

        this.data.l.unshift("logic ");
        this.data.o.unshift(0);

        this.childProcessor = buildStructure(this, this.root, this.data)[0];

        if(arr[0].contains(",")) {
            tmp = arr[0].split(",");
            this.valueIterator = tmp[0].trim();
            this.indexIterator = tmp[1].trim();
        } else {
            this.valueIterator = arr[0].trim();
        }


        // live logic!
        if(arr[1].contains($varPre)) {
            this.logic = arr[1].split($varPre)[1].split($varClose)[0];

            root.on(this.logic, function(name, value) {
                if(typeof value === "string")
                    this.obj = JSON.parse(value);
                else
                    this.obj = value;

                this.render();
            }.bind(this));
        // simple static logic calculation
        } else {
            this.obj = JSON.parse(arr[1].trim());

            this.render();
        }
    };

    EachProcessor.prototype = {
        /**
         * Function to build a derived element
         * @private
         *
         * @returns {EachElement} derived element
         */
        build: function(defined) {
            var tmp = new EachElement(this, defined);
            for(var i = 0; i < this.obj.length; ++i)
                tmp.addChild(this.childs[i]);

            this.derived.push(tmp);
            return tmp.get();
        },

        render: function() {
            if(isArray(this.obj)) {
                for(var i = 0, j; i < this.obj.length; ++i) {
                    if(this.childs.length == i)
                        this.childs[i] = {};

                    if(this.indexIterator !== null)
                        this.childs[i][this.indexIterator] = i;
                    this.childs[i][this.valueIterator] = this.obj[i];
                    for(j = 0; j < this.derived.length; ++j) {
                        if(this.derived[j].renderCount<=i)
                            this.derived[j].addChild(this.childs[i]);
                        else
                            this.derived[j].redefineChild(i, this.childs[i]);
                    }
                }
            } else if(typeof this.obj === "object" && this.obj !== null) {
                /* TODO for(var p in this.obj) {
                    if(this.indexIterator !== null) {
                        this.defined[this.indexIterator] = p;
                    }
                    this.defined[this.valueIterator] = this.obj[p];

                    this.childs = this.childs.concat(buildStructure(this, this.root, this.data));
                }*/
            //isFinite makes sure its not Infinite or NaN.
            } else if(typeof this.obj === "number" && isFinite(this.obj)) {
                var tmp = parseInt(this.obj,10);
                //TODO
            } else {
                throw new Exception("TypeError", "EachProcessor can iterate over arrays, objects and numbers only");
            }
            //for(var j = 0; j < this.childs.length; ++j)
            //    this.domElement.appendChild(this.childs[j].domElement);
        }
    };
