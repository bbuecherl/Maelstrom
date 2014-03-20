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
