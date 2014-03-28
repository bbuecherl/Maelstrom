        /**
         * Function to build a new parent fragment
         * @private
         *
         * @param {Array} ret return array
         * @param {string} old parent line
         * @param {Number} oldO parent line offset
         * @param {TemplateProcessor|Template} parent parent fragment
         * @param {Template} root root template
         * @param {Object} data template data for child elements
         * @param {Object} tmp a temporary placeholder
         * @param {Number} isIf for if-else identification
         * @returns {Array} array of child elements
         */
    var buildFragment = function(ret, old, oldO, parent, root, data, tmp, isIf) {
            if(old.startsWith("each")) {
                ret.push(new EachProcessor(old.slice(4), data, parent, root));
            } else if(old.startsWith("if")) {

            } else if(old.startsWith("else")) {

            } else {
                ret.push(new TemplateProcessor(old, data, parent, root));
            }
            return ret;
        },
        /**
         * Function to build the template structure
         * @private
         *
         * @param {TemplateProcessor|Template} parent parent fragment
         * @param {Template} root root template
         * @param {Object} data template data for child elements
         * @returns {Array} array of child elements
         */
        buildStructure = function(parent, root, data) {
            var min = data.o.min(),
                tmpL = [],
                tmpO = [],
                ret = [],
                old = 0,
                tmp,
                isIf = -1;

            for(var i = 0; i < data.l.length; ++i) {
                if(min==data.o[i]) {
                    if(i!==old) {
                        buildFragment(ret, data.l[old], data.o[old], parent, root, {l: tmpL, o: tmpO}, tmp, isIf);
                        tmpL = [];
                        tmpO = [];
                        old = i;
                    }
                } else {
                    tmpL.push(data.l[i]);
                    tmpO.push(data.o[i]);
                }
            }
            return buildFragment(ret, data.l[old], data.o[old], parent, root, {l: tmpL, o: tmpO}, tmp, isIf);
        };
