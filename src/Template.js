    /**
     * Template constructor
     * @constructor
     *
     * @param {string} str template string
     */
    var Template = function(str) {
        this.fragments = [];
        this.listeners = {};

        this.subscription = false;

        // build structure
        this.childs = buildStructure(this, this, splitLines(str));
    };

    /**
     * Function to append the template to an element
     *
     * @param {Element} elm element
     * @returns {Template} this
     */
    Template.prototype.append = function(elm) {
        if(typeof this.frag === "undefined") {
            this.frag = $createFragment();

            for(var i = 0, len = this.childs.length; i < len; ++i)
                this.frag.appendChild(this.childs[i].domElement);
        }

        elm.appendChild(this.frag);
        return this;
    };

    /**
     * Function to remove the template from an element
     *
     * @param {Element} elm element
     * @returns {Template} this
     */
    Template.prototype.remove = function(elm) {
        if(typeof this.frag !== "undefined")
            elm.removeChild(this.frag);
        return this;
    };

    /**
     * Function to add a change listener
     * @private
     *
     * @param {string} path path identifier
     * @param {Function} listener listener function
     * @returns {Template} this
     */
    Template.prototype.on = function(path, listener) {
        if(!this.listeners.hasOwnProperty(path))
            this.listeners[path] = [];
        this.listeners[path].push(listener);
        return this;
    };

    /**
     * Function to remove a change listener
     * @private
     *
     * @param {string} path path identifier
     * @param {Function} listener listener function
     * @returns {Template} this
     */
    Template.prototype.off = function(path, listener) {
        if(this.listeners.hasOwnProperty(path)) {
            var i = this.listeners[path].indexOf(listener);
            if(i!=-1)
                delete this.listeners[path][i];
        }
        return this;
    };

    /**
     * Function to trigger a change listener
     * @private
     *
     * @param {string} path path identifier
     * @param {Object} value change value 
     * @returns {Template} this
     */
    Template.prototype.trigger = function(path, value) {
        if(this.listeners.hasOwnProperty(path)) {
            for(var i = 0; i < this.listeners[path].length; ++i) {
                this.listeners[path][i](value);
            }
        }
        return this;
    };

    /**
     * Function to render the template with a static object
     *
     * @param {Object} data data object
     * @returns {Template} this
     */
    Template.prototype.render = function(data) {
        for(var path in this.listeners) {
            if(objHasVar(data, path))
                this.trigger(path, objGetVar(data, path));
        }
        return this;
    };

    /**
     * Function to subscribe the template to a living object
     *
     * @param {Object} data living data object
     * @returns {Template} this
     */
    Template.prototype.subscribe = function(data) {
        var parent, obj, i, bool, tmp;
        if(this.subscription) {
            for(var n in this.listeners) {
                tmp = n.split(".");
                parent = this.subscription;
                obj = this.subscription;
                for(i = 0; i < tmp.length; ++i) {
                    if(obj.hasOwnProperty(tmp[i])) {
                        parent = obj;
                        bool = true;
                        obj = obj[tmp[i]];
                    } else {
                        bool = false;
                        break;
                    }
                }
                if(!bool)
                    continue;

                parent.unwatch(tmp[tmp.length-1]);
            }
        }

        this.subscription = data;

        if(this.subscription) {
            for(var name in this.listeners) {
                tmp = name.split(".");
                parent = this.subscription;
                obj = this.subscription;
                for(i = 0; i < tmp.length; ++i) {
                    if(obj.hasOwnProperty(tmp[i])) {
                        parent = obj;
                        bool = true;
                        obj = obj[tmp[i]];
                    } else {
                        bool = false;
                        break;
                    }
                }
                if(!bool)
                    continue;

                (function(el) {
                    var t1 = tmp[tmp.length-1],
                        t2 = name;
                    parent.watch(t1, function(n, oldVal, newVal) {
                        this.trigger(t2, newVal);
                        return newVal;
                    }.bind(el));
                })(this);
            }

            this.render(this.subscription);
        }
        return this;
    };

    /**
     * Function to unsubscribe the template
     *
     * @returns {Template} this
     */
    Template.prototype.unsubscribe = function() {
        return this.subscribe(false);
    };
