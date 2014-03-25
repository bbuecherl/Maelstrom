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
