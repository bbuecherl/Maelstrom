/**
 * Maelstrom v0.0.1-1403252001
 * https://github.com/bbuecherl/Maelstrom/
 * by Bernhard Buecherl http://bbuecherl.de/
 * License: MIT http://bbuecherl.mit-license.org/ */
(function(global, factory) {
    if(typeof define === "function" && define.amd) {
        define(["Maelstrom"], factory);
    } else {
        global.Maelstrom = factory();
    }
})(this, function() {
"use strict";

    // https://gist.github.com/eliperelman/1035982 string.trim polyfill
    if(typeof "".trim !== "undefined") {
        String.prototype.trim = function() {
            return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"");
        };
    }

    // object.watch polyfill by Eli Grey, http://eligrey.com
    if (!Object.prototype.watch) {
        Object.defineProperty(Object.prototype, "watch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function(prop, handler) {
                var oldval = this[prop],
                    newval = oldval,
                    getter = function() {
                        return newval;
                    },
                    setter = function(val) {
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
            value: function(prop) {
                var val = this[prop];
                delete this[prop]; // remove accessors
                this[prop] = val;
            }
        });
    }

    //minimum of array (actually not a polyfill)
    Array.prototype.min = function() {
        return Math.min.apply(this,this);
    };

    //string.startsWith polyfill (slicing is a bit faster than using indexOf in my tests, especially with longer strings)
    String.prototype.startsWith = String.prototype.startsWith || function (str, offset) {
        offset = offset || 0;
        return (this.slice(offset,offset+str.length)==str);
    };

    //string.contains polyfill
    String.prototype.contains = String.prototype.contains || function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };

        /**
         * Function to count the leading whitespace of a template line
         * @private
         *
         * @param {string} str template line
         * @returns {Number} count of leading whitespaces
         */
    var countLeadingSpace = function(str) {
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
                if(typeof obj[path[i]] !== "undefined")
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
                last = 0,
                tmp,
                insideText = false;

            for(; i < str.length; ++i) {
                if(str[i]=="\"") {
                    insideText = !insideText;
                }
                if(str[i]=="," && !insideText) {
                    list.push(str.slice(last,i).trim());
                    last = i+1;
                }
            }

            list.push(str.slice(last));

            for(i=0; i < list.length; ++i) {
                if(list[i].length!==0) {
                    last = list[i].split("=");
                    tmp = last[1].trim(); 
                    ret[last[0].trim()] = tmp.slice(1,tmp.length-1);
                }
            }
            return ret;
        },

        /**
         * List of slash node elements
         * @static
         * @private
         */
        _isSlashNode = ["br", "hr", "input", "img", "meta", "link", "wbr", "area"],

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
        },

        /**
         * Test if string starts with one of the search strings
         * @private
         *
         * @param {string} str string to test
         * @param {Array} search list of strings to search for
         * @param {Number} offset search offset
         * @returns {string|Boolean} returns the (first) matches string, otherwise false
         */
        startsWithOne = function(str, search, offset) {
            offset = offset || 0;
            for(var i = 0; i < search.length; ++i)
                if(str.slice(offset,offset+search[i].length)==search[i])
                    return search[i];
            return false;
        },

        /**
         * Test is object ist an array
         * @private
         *
         * @param {Object} obj object to test
         * @returns {Boolean}
         */
        isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },

        /**
         * Function to concat objects, params can be an infinite list of objects
         * @private
         *
         * @returns {Object} to concat object
         */
        concatObject = function() {
            var ret = {},
                i = 0,
                len = arguments.length;

            for(; i<len; i++) {
                for(var p in arguments[i]) {
                    if(arguments[i].hasOwnProperty(p) && !ret.hasOwnProperty(p)) {
                        ret[p] = arguments[i][p];
                    }
                }
            }
            return ret;            
        },

        /**
         * Function to (throw and) trace an error
         * @private
         *
         * @param {string} str error text 
         */
        err = function(str) {
            if(console && console.error)
                console.error(str);
            else
                throw new Error(str);
        };

    var $doc = document,
        $createElement = $doc.createElement.bind($doc),
        $createFragment = $doc.createDocumentFragment.bind($doc),
        $createText = $doc.createTextNode.bind($doc),

        $contentPre = "\u0091",
        $contentClose = "\u0092",
        $varPre = "[[$",
        $varClose  = "]]";

        /**
         * Function to build a new parent fragment
         * @private
         *
         * @param {Array} ret return array
         * @param {string} old parent line
         * @param {Number} oldO parent line offset
         * @param {TemplateProcessor|Template} parent parent fragment
         * @param {Template} root root template
         * @param {Array} predefined predefined logic variables
         * @param {Object} data template data for child elements
         * @param {Object} tmp a temporary placeholder
         * @param {Number} isIf for if-else identification
         * @returns {Array} array of child elements
         */
    var buildFragment = function(ret, old, oldO, parent, root, predefined, data, tmp, isIf) {
            if(old.startsWith("each")) {
                //ret.push(new EachProcessor(old.slice(4), data, parent, root, predefined));
            } else if(old.startsWith("if")) {

            } else if(old.startsWith("else")) {

            } else {
                ret.push(new TemplateProcessor(old, data, parent, root, predefined));
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
         * @param {Array} predefined predefined logic variables
         * @returns {Array} array of child elements
         */
        buildStructure = function(parent, root, data, predefined) {
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
                        buildFragment(ret, data.l[old], data.o[old], parent, root, predefined, {l: tmpL, o: tmpO}, tmp, isIf);
                        tmpL = [];
                        tmpO = [];
                        old = i;
                    }
                } else {
                    tmpL.push(data.l[i]);
                    tmpO.push(data.o[i]);
                }
            }
            return buildFragment(ret, data.l[old], data.o[old], parent, root, predefined, {l: tmpL, o: tmpO}, tmp, isIf);
        };

    /**
     * Template processor constructor
     * @constructor
     * @private
     *
     * @param {string} line template line
     * @param {Object} data template data of child elements
     * @param {TemplateProcessor|Template} parent parent fragment
     * @param {Template} root root template
     * @param {Array} predefined predefined logic variables
     */
    var TemplateProcessor = function(line, data, parent, root, predefined) {
        this.line = line;
        this.predefined = predefined || {};
        this.defined = [];

        this.root = root;
        this.parent = parent;
        this.vars = {};
        this.derived = [];

        var elm, next, list, i, name, tmp, node;

        //Logic Fragment
        if(this.line.startsWith("logic")) {
            this.node = "logic";
            // build structure
            if(data.l.length>0)
                this.childs = buildStructure(this,root,data);
        // TextNode
        } else if(this.line.startsWith("|")) {
            this.node = "|";
            next = this.line.slice(1);
        // Node
        } else {
            // build structure
            if(data.l.length>0)
                this.childs = buildStructure(this,root,data);

            //build element
            if(this.line.startsWith("#")||this.line.startsWith(".")) {
                //default is div
                next = this.line;
                this.node = "DIV";
            } else {
                elm = splitByIdentifiers(this.line);
                next = this.line.slice(elm[0].length);
                this.node = elm[0].toUpperCase();
            }
            //classes & ids
            this.classes = "";
            this.id = "";
            while(next.length>0) {
                if(next.startsWith("#")) {
                    elm = splitByIdentifiers(next.slice(1));
                    next = next.slice(elm[0].length+1).trim();

                    this.id = elm[0];
                } else if(next[0].startsWith(".")) {
                    elm = splitByIdentifiers(next.slice(1));
                    next = next.slice(elm[0].length+1).trim();

                    this.classes += " " + elm[0];
                } else {
                    break;
                }
            }

            // attributes
            this.attrs = {};
            if(next.startsWith("(")) {
                for(i = 1; i < next.length;++i) {
                    if(next.startsWith(")",i))
                        break;
                }
                elm = next.slice(1,i).trim();
                next = next.slice(i+1);

                list = splitArgs(elm);

                for(name in list) {
                    if(list[name].contains($varPre)) {
                        tmp = list[name].split($varPre)[1].split($varClose)[0];

                        (this.vars[tmp] = this.vars[tmp] || []).push({
                            type: TemplateProcessor.VType.ATTRIBUTE,
                            link: name,
                            inside: list[name]
                        });

                        if(this.predefined.hasOwnProperty(tmp)) { //TODO
                            (function(ref) {
                                var t1 = tmp,
                                    t2 = name,
                                    t3 = list[name];

                                ref.predefined.watch(t1, function(id, oldVal, value) {
                                    //ref.domElement.setAttribute(t2, t3.replace($varPre + t1 + $varClose, value));
                                });
                            })(this);
                        }
                    } else {
                       this.attrs[name] = list[name];
                    }
                }
            }

            // styles
            this.styles = {};
            if(next.startsWith("{")) {
                for(i=1; i < next.length;++i) {
                    if(next.startsWith("}",i))
                        break;
                }
                elm = next.slice(1,i+1).replace("}","").trim();
                next = next.slice(i+2);

                list = splitArgs(elm);

                for(var n in list) {
                    if(list[n].contains($varPre)) {
                        tmp = list[n].split($varPre)[1].split($varClose)[0];

                        (this.vars[tmp] = this.vars[tmp] || []).push({
                            type: TemplateProcessor.VType.STYLE,
                            link: n,
                            inside: list[n]
                        });

                        if(this.predefined.hasOwnProperty(tmp)) { //TODO
                            (function(ref) {
                                var t1 = tmp,
                                    t2 = n,
                                    t3 = list[n];

                                ref.predefined.watch(t1, function(id, oldVal, value) {
                                    //setStyle(ref.domElement, t2, t3.replace($varPre + t1 + $varClose, value));
                                });
                            })(this);
                        }
                    } else {
                        this.styles[n] = list[n];
                    }
                }               
            }
        }

        // content
        if(next.startsWith(" "))
            next = next.slice(1);
        if(next.length>0  && !isSlashNode(node)) {
            var index = 0;

            this.contents = "";
    
            while((elm = splitFirst(next, $varPre))) {
                this.contents += elm[0];
                elm = splitFirst(elm[1], $varClose);

                (this.vars[elm[0]] = this.vars[elm[0]] || []).push({
                    type: TemplateProcessor.VType.CONTENT,
                    inside: index++
                });

                if(this.predefined.hasOwnProperty(elm[0])) { // TODO
                    this.contents += $contentPre + this.predefined[elm[0]] + $contentClose;

                    (function(ref) {
                        var t2 = elm[0];

                        ref.predefined.watch(t2, function(id, oldVal, value) {
                            ref.render(t2, value);
                            return value;
                        }.bind(ref));
                    })(this);
                } else {
                    this.contents += $contentPre + $varPre + elm[0] + $varClose + $contentClose;
                }

                next = elm[1];
            }
            this.contents += next;
        }

        //listen on root
        for(var v in this.vars) {
            root.on(v, this.render.bind(this));
        }
    };

    TemplateProcessor.prototype = {
        /**
         * Function to rerender a placeholder
         * @private
         *
         * @param {string} name placeholder name
         * @param {Object} value new value
         */
        render: function(name, value) {
            if(typeof name === "undefined") {
                //todo : render with predefined values
            } else {
                if(this.vars.hasOwnProperty(name)) {
                    var tmp = this.vars[name];

                    for(var i = 0, j; i < tmp.length; ++i) {
                        
                        if(tmp[i].type == TemplateProcessor.VType.ATTRIBUTE) {
                            this.attrs[tmp[i].link] = tmp[i].inside.replace($varPre + name + $varClose, value);

                            for(j = 0; j < this.derived.length; ++j) 
                                this.derived[j].setAttribute(tmp[i].link, this.attrs[tmp[i].link]);


                        } else if(tmp[i].type == TemplateProcessor.VType.STYLE) {
                            this.styles[tmp[i].link] = tmp[i].inside.replace($varPre + name + $varClose, value);

                            for(j = 0; j < this.derived.length; ++j) 
                                this.derived[j].setStyle(tmp[i].link, this.styles[tmp[i].link]);

                        } else if(tmp[i].type == TemplateProcessor.VType.CONTENT) {

                            var t = this.contents,
                                rep = $contentPre + t.split($contentPre)[tmp[i].inside+1]
                                                    .split($contentClose)[0] + $contentClose;

                            this.contents = t.replace(rep, $contentPre + value + $contentClose);

                            for(j = 0; j < this.derived.length; ++j) 
                                this.derived[j].setContent(t.replace(rep, $contentPre + value + $contentClose));
                        }
                    }
                }
            }
        },

        /**
         * Function to build a derived element
         * @private
         *
         * @returns {TemplateElement} derived element
         */
        build: function() {
            var tmp = new TemplateElement(this);
            this.derived.push(tmp);
            return tmp;
        }
    };

    /**
     * List of variable types
     * @private
     * @static
     *
     * @property {Number} ATTRIBUTE 1
     * @property {Number} STYLE 2
     * @property {Number} CONTENT 3
     */
    TemplateProcessor.VType = {
        ATTRIBUTE: 1,
        STYLE: 2,
        CONTENT: 3
    };

    /**
     * Template constructor
     * @constructor
     * @private
     *
     * @param {string} str template string
     */
    var Template = function(str) {
        var arr = [],
            off = [],
            lines = str.split("\n"), 
            i = 0,
            len = lines.length,
            count = 0,
            comment = -1;
            
        for(;i<len;++i) {
            count = countLeadingSpace(lines[i]);
            if(lines[i].startsWith("//", count)) {
                comment = count;
            } else if(count !== lines[i].length && ( comment==-1 ? true : comment >= count )) {
                arr.push(lines[i].trim());
                off.push(count);
                comment = -1;
            }
        }
        this.lines = {l: arr, o: off};

        this.listeners = {};

        this.subscription = false;

        // build structure
        if(arr.length!==0)
            this.childs = buildStructure(this, this, this.lines);
        else
            this.childs = [];
    };

    Template.prototype = {
        /**
         * Function to append the template to an element
         *
         * @param {Element} elm element
         * @returns {Template} this
         */
        append: function(elm) {
            if(typeof this.frag === "undefined") {
                this.frag = $createFragment();

                for(var i = 0, len = this.childs.length; i < len; ++i)
                    this.frag.appendChild(this.childs[i].build().get());
            }

            if(this.childs.length>0)
                elm.appendChild(this.frag);
            return this;
        },

        /**
         * Function to remove the template from an element
         *
         * @param {Element} elm element
         * @returns {Template} this
         */
        remove: function(elm) {
            if(typeof this.frag !== "undefined")
                elm.removeChild(this.frag);
            return this;
        },

        /**
         * Function to add a change listener
         * @private
         *
         * @param {string} path path identifier
         * @param {Function} listener listener function
         * @returns {Template} this
         */
        on: function(path, listener) {
            if(!this.listeners.hasOwnProperty(path))
                this.listeners[path] = [];
            this.listeners[path].push(listener);
            return this;
        },

        /**
         * Function to remove a change listener
         * @private
         *
         * @param {string} path path identifier
         * @param {Function} listener listener function
         * @returns {Template} this
         */
        off: function(path, listener) {
            if(this.listeners.hasOwnProperty(path)) {
                var i = this.listeners[path].indexOf(listener);
                if(i!=-1)
                    delete this.listeners[path][i];
            }
            return this;
        },

        /**
         * Function to trigger a change listener
         * @private
         *
         * @param {string} path path identifier
         * @param {Object} value change value
         * @returns {Template} this
         */
        trigger: function(path, value) {
            if(this.listeners.hasOwnProperty(path)) {
                for(var i = 0; i < this.listeners[path].length; ++i) {
                    this.listeners[path][i](path, value);
                }
            }
            return this;
        },

        /**
         * Function to render the template with a static object
         *
         * @param {Object} data data object
         * @returns {Template} this
         */
        render: function(data) {
            for(var path in this.listeners) {
                if(objHasVar(data, path))
                    this.trigger(path, objGetVar(data, path));
            }
            return this;
        },

        /**
         * Function to subscribe the template to a living object
         *
         * @param {Object} data living data object
         * @returns {Template} this
         */
        subscribe: function(data) {
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

                        el.trigger.apply(el, [t2, parent[t1]]);
                    })(this);
                }
            }
            return this;
        },

        /**
         * Function to unsubscribe the template
         *
         * @returns {Template} this
         */
        unsubscribe: function() {
            return this.subscribe(false);
        }
    };

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

    return Maelstrom;
});
