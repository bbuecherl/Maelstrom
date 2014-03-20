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
            if(this.line[0]=="#"||this.line[0]==".") {
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
