/**
 * Maelstrom v0.0.1-1403201723
 * https://github.com/bbuecherl/Maelstrom/
 * by Bernhard Buecherl http://bbuecherl.de/
 * License: MIT http://bbuecherl.mit-license.org/ */
(function(global, factory) {
    if(typeof define === "function" && define.amd) {
        define(["Maelstrom"], factory);
    } else {
        global.Maelstrom = factory();
    }
})(this,function() {
"use strict";

    // https://gist.github.com/eliperelman/1035982 trim polyfill
    if(typeof "".trim !== "undefined")
        String.prototype.trim = function() {
            return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"");
        };

    // object.watch polyfill by Eli Grey, http://eligrey.com
    if (!Object.prototype.watch) {
        Object.defineProperty(Object.prototype, "watch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop, handler) {
                var oldval = this[prop],
                    newval = oldval,
                    getter = function () {
                        return newval;
                    },
                    setter = function (val) {
                        oldval = newval;
                        return (newval = handler.call(this, prop, oldval, val));
                    };
                
                if (delete this[prop]) { // can't watch constants
                    Object.defineProperty(this, prop, {
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        });
    }
    if (!Object.prototype.unwatch) {
        Object.defineProperty(Object.prototype, "unwatch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop) {
                var val = this[prop];
                delete this[prop]; // remove accessors
                this[prop] = val;
            }
        });
    }

    //minimum of array
    Array.prototype.min = function() {
        return Math.min.apply(this,this);
    };

    var $doc = document,
        $createElement = $doc.createElement.bind($doc),
        $createFragment = $doc.createDocumentFragment.bind($doc),
        $createText = $doc.createTextNode.bind($doc);

        /**
         * Function to split the template string into lines and calculate the offset
         * @private
         *
         * @param {string} str template string
         * @returns {Object} object containing arrays with information about the line contents and offsets
         */
    var splitLines = function(str) {
            var arr = [],
                off = [],
                lines = str.split("\n"), 
                i = 0,
                len = lines.length,
                count = 0,
                comment = -1;
            
            for(;i<len;++i) {
                count = countLeadingSpace(lines[i]);
                if(lines[i].charAt(count) == "/" && lines[i].charAt(count+1) == "/") {
                    comment = count;
                } else if(count !== lines[i].length && ( comment==-1 ? true : comment >= count )) {
                    arr.push(lines[i]);
                    off.push(count);
                    comment = -1;
                }
            }
            return {l: arr, o: off};
        },
        /**
         * Function to count the leading whitespace of a template line
         * @private
         *
         * @param {string} str template line
         * @returns {Number} count of leading whitespaces
         */
        countLeadingSpace = function(str) {
            for (var i = 0, len = str.length; i < len; ++i) {
                if (str[i] != " " && str[i] != "\t") {
                    return i;
                }
            }
            return str.length;
        },
        /**
         * Function to split a string by main identifiers
         * @private
         * @todo : replace the RegExp?
         *
         * @param {string} str template string
         * @returns {Array} splitted array 
         */
        splitByIdentifiers = function(str) {
            return str.split(/#|\.|\(|\{| /g); //replace RegExp?
        },

        /**
         * Function to split a string by first occurence
         * modified version of http://stackoverflow.com/a/2878746/995320
         * @private
         *
         * @param {string} str string
         * @returns {Array} splitted array
         */
        splitFirst = function(s, delim) {
            var i = s.indexOf(delim);

            if(i!=-1)
                return [s.slice(0,i), s.slice(i+delim.length)];
            else
                return false;
        },

        /**
         * Function to determine, whether an object has a property or not
         * @private
         *
         * @param {Object} obj object
         * @param {string} varName property name
         * @returns {Boolean}
         */
        objHasVar = function(obj, varName) {
            var path = varName.split(".");
            for(var i = 0; i < path.length; ++i) {
                if(obj.hasOwnProperty(path[i]))
                    obj = obj[path[i]];
                else
                    return false;
            }
            return true;
        },

        /**
         * Function to return the value of a property in an object
         * @private
         *
         * @param {Object} obj object
         * @param {string} varName property name
         * @returns {Object}
         */
        objGetVar = function(obj, varName) {
            var path = varName.split(".");
            for(var i = 0; i < path.length; ++i) { 
                obj = obj[path[i]];
            }
            return obj;
        },

        /**
         * Function to split a list of arguments
         * @private
         *
         * @param {string} str arguments string
         * @returns {Object} object of arguments
         */
        splitArgs = function(str) {
            var ret = {},
                list = [],
                i = 0,
                last = 0;

            for(; i < str.length; ++i) {
                if(str[i]==",") {
                    list.push(str.slice(last,i).trim());
                    last = i+1;
                }
            }
            list.push(str.slice(last));
            last = i;

            for(i=0; i < list.length; ++i) {
                if(list[i].length!==0) {
                    last = list[i].split("=");
                    ret[last[0].trim()] = last[1].trim().slice(1,last[1].length-1).trim();
                }
            }

            return ret;
        },

        /**
         * Function to set styles to an element
         * @private
         *
         * @param {Element} elm element
         * @param {string} name style name
         * @param {string} value value of the style rule
         */
        setStyle = function(elm, name, value) {
            name = name.split("-");
            for(var i = 0; i < name.length; ++i) {
                if(i!==0)
                    name[i] = name[i].slice(0,1).toUpperCase()+name[i].slice(1);
            }

            elm.style[name.join("")] = value;
        },

        /**
         * List of slash node elements
         * @static
         * @private
         */
        _isSlashNode = ["br", "hr", "input", "img", "meta", "link"],

        /**
         * Test if element is slash node
         * @private
         *
         * @param {string} elm element name
         * @returns {Boolean}
         */
        isSlashNode = function(elm) {
            if(typeof elm === "undefined") return false;
            return _isSlashNode.indexOf(elm)!=-1;
        };

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
            var tmp = new Template(str).create();

            if(typeof data !== "undefined")
                tmp.subscribe(data);
            
            return tmp;
        }
    };

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

    /**
     * Template element constructor
     * @constructor
     *
     * @param {Array} lines template lines
     */
    var TemplateElement = function(lines) {
        this.fragments = [];
        this.listeners = {};

        this.subscription = false;

        // build structure
        this.childs = buildStructure(this, this, lines);
    };

    /**
     * Function to append the template to an element
     *
     * @param {Element} elm element
     * @returns {TemplateElement} this
     */
    TemplateElement.prototype.append = function(elm) {
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
     * @returns {TemplateElement} this
     */
    TemplateElement.prototype.remove = function(elm) {
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
     * @returns {TemplateElement} this
     */
    TemplateElement.prototype.on = function(path, listener) {
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
     * @returns {TemplateElement} this
     */
    TemplateElement.prototype.off = function(path, listener) {
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
     * @returns {TemplateElement} this
     */
    TemplateElement.prototype.trigger = function(path, value) {
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
     * @returns {TemplateElement} this
     */
    TemplateElement.prototype.render = function(data) {
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
     * @returns {TemplateElement} this
     */
    TemplateElement.prototype.subscribe = function(data) {
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
     * @returns {TemplateElement} this
     */
    TemplateElement.prototype.unsubscribe = function() {
        return this.subscribe(false);
    };

    /**
     * TemplateFragment constructor
     * @constructor
     *
     * @param {string} line template line
     * @param {Object} data template data of child elements
     * @param {TemplateFragment|Template} parent parent fragment
     * @param {Template} root root template
     */
    var TemplateFragment = function(line, data, parent, root) {
        this.line = line.trim();
        
        var elm, next, list, i, name, tmp, node;
        root.fragments.push(this);

        // TextNode
        if(this.line[0]=="|") {
            this.domElement = $createFragment();
            next = this.line.slice(1);
        // Node
        } else {
            // build structure
            if(data.l.length>0)
                this.childs = buildStructure(this,root,data);

            //build element
            if(this.line[0]=="#") {
                //default is div
                next = this.line;
                node = "div";
            } else {
                elm = splitByIdentifiers(this.line);
                next = this.line.slice(elm[0].length);
                node = elm[0].toLowerCase();
            }
            this.domElement = $createElement(node);

            //classes & ids
            var classes = "";
            while(next.length>0) {
                if(next[0]=="#") {
                    elm = splitByIdentifiers(next.slice(1));
                    next = next.slice(elm[0].length+1).trim();

                    this.domElement.id = elm[0];
                } else if(next[0]==".") {
                    elm = splitByIdentifiers(next.slice(1));
                    next = next.slice(elm[0].length+1).trim();

                    classes += elm[0];
                } else {
                    break;
                }
            }
            if(classes.length!==0) //no need for a classList polyfill that way
                this.domElement.className = classes.trim();

            // attributes
            if(next.length>0&&next[0]=="(") {
                for(i = 1; i < next.length;++i) {
                    if(next[i]==")")
                        break;
                }
                elm = next.slice(1,i).trim();
                next = next.slice(i+1);

                list = splitArgs(elm);

                for(name in list) {
                    if(list[name].replace("[[$","").length!=list[name].length) {
                        tmp = list[name].split("[[$")[1].split("]]")[0];

                        (function(el) {
                            var t1 = tmp,
                                t2 = name,
                                t3 = list[t2];

                            root.on(tmp, function(value) {
                                this.domElement.setAttribute(t2, t3.replace("[[$"+t1+"]]", value));
                            }.bind(el));
                        })(this);
                    } else {
                        this.domElement.setAttribute(name, list[name]);
                    }
                }

                this.attrs = elm;
            }

            // styles
            if(next.length>0&&next[0]=="{") {
                for(i=1; i < next.length;++i) {
                    if(next[i]=="}")
                        break;
                }
                elm = next.slice(1,i+1).replace("}","").trim();
                next = next.slice(i+2);

                list = splitArgs(elm);

                for(var n in list) {
                    if(list[n].replace("[[$","").length!=list[n].length) {
                        tmp = list[n].split("[[$")[1].split("]]")[0];

                        (function(el) {
                            var t1 = tmp,
                                t2 = n,
                                t3 = list[n];

                            root.on(tmp, function(value) {
                                setStyle(this.domElement, t2, t3.replace("[[$"+t1+"]]", value));
                            }.bind(el));
                        })(this);
                    } else {
                        setStyle(this.domElement,n,list[n]);
                    }
                }

                this.styles = elm;                
            }
        }

        // content
        if(next.length>0  && !isSlashNode(node)) {
            while((elm = splitFirst(next,"[[$"))) {
                tmp = $createText(elm[0]);
                this.domElement.appendChild(tmp);

                elm = splitFirst(elm[1],"]]");

                tmp = $createText("[[$"+elm[0]+"]]");
                this.domElement.appendChild(tmp);

                (function() {
                    var t1 = tmp,
                        t2 = elm[0];

                    root.on(t2, function(value) {
                        t1.textContent = value;
                    });
                })();

                next = elm[1];
            }
            tmp = $createText(next);
            this.domElement.appendChild(tmp);
        }


        // append childs
        if(typeof this.childs !== "undefined")
            for(i = 0; i < this.childs.length; ++i)
                this.domElement.appendChild(this.childs[i].domElement);
    };

    return Maelstrom;
});
