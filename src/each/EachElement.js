    /**
     * Each element constructor
     * @constructor
     * @private
     *
     * @param {EachProcessor} proc each processor to be build on
     * @param {Object} defined predefined internal variables
     */
    var EachElement = function(proc, defined) {
        this.childs = [];
        this.childProcessor = proc.childProcessor;
        this.renderCount = 0;
        this.domElement = $createFragment();
        this.redefine(defined);
    };

    EachElement.prototype = {
        /**
         * Function to redefine internal variables
         * @private
         *
         * @param {Object} defined internal variables
         */
        redefine: function(defined) {
            this.defined = concatObject(defined, this.defined);
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
         * Function to add a new child to the element
         * @private
         */
        addChild: function(defined) {
            ++this.renderCount;
            if(this.childs.length<this.renderCount)
                this.childs.push(this.childProcessor.build(defined));
            else
                this.childs[this.renderCount-1].redefine(defined);

            this.domElement.appendChild(this.childs[this.renderCount-1]);
        },

        redefineChild: function(id, defined) {
            if(id<this.renderCount)
                this.childs[id].redefine(defined);
        },

        /**
         * Function to remove a child from the element
         * @private
         */
        removeChild: function() {
            if(this.renderCount===0) return;
            --this.renderCount;
            this.domElement.removeChild(this.childs[this.renderCount].get());
        }
    };
