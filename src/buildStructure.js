    /**
     * Function to build the template structure
     * @private
     *
     * @param {TemplateFragment|Template} parent parent fragment
     * @param {Template} root root template
     * @param {Object} data template data for child elements
     * @returns {Array} array of child elements
     */
    var buildStructure = function(parent, root, data) {
        var min = data.o.min(),
            tmpL = [],
            tmpO = [],
            ret = [],
            old = 0;

        for(var i = 0; i < data.l.length; ++i) {
            if(min==data.o[i]) {
                if(i!==old) {
                    ret.push(new TemplateFragment(data.l[old], {l: tmpL, o: tmpO}, parent, root));
                    tmpL = [];
                    tmpO = [];
                    old = i;
                }
            } else {
                tmpL.push(data.l[i]);
                tmpO.push(data.o[i]);
            }
        }
        ret.push(new TemplateFragment(data.l[old], {l: tmpL, o: tmpO}, parent, root));

        return ret;
    };
