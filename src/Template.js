    /**
     * Template constructor
     * @constructor
     * @private
     *
     * @param {string} str template string
     */
    var Template = function(str) {
        this.lines = splitLines(str);
    };

    Template.prototype.create = function() {
        return new TemplateElement(this.lines);
    };
