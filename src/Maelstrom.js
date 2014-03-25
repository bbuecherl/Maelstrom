    /**
     * Maelstrom namespace
     * @namespace Maelstrom
     */
    var Maelstrom = {
        /**
         * Function to compile a template
         * @static
         *
         * @param {string} str template string
         * @param {Object} [data] data object to subscribe the template to
         */
        compile: function(str, data) {
            var tmp = new Template(str);

            if(typeof data !== "undefined")
                tmp.subscribe(data);
            
            return tmp;
        }
    };
