    /**
     * Each-logic processor constructor
     * @constructor
     * @private
     *///currently under construction
    var EachProcessor = function(line, data, parent, root, predefined) {
        var arr = line.split("in"),
            tmp,
            obj;

        this.root = root;
        this.data = data;
        this.childs = [];

        this.valueIterator = null;
        this.indexIterator = null;

        this.predefined = predefined || {};
        this.defined = {};
        this.domElement = $createFragment();
        this.childs = [];

        if(arr[0].contains(",")) {
            tmp = arr[0].split(",");
            this.valueIterator = tmp[0].trim();
            this.indexIterator = tmp[1].trim();
            this.defined[this.indexIterator] = null;
        } else {
            this.valueIterator = arr[0].trim();
        }
        this.defined[this.valueIterator] = null;


        // live logic!
        if(arr[1].contains($varPre)) {
            this.logic = arr[1].split($varPre)[1].split($varClose)[0];

            root.on(this.logic, function(name, value) {
                if(typeof value === "string")
                    this.obj = JSON.parse(value);
                else
                    this.obj = value;

                this.process();
            }.bind(this));
        // simple static logic calculation
        } else {
            this.obj = JSON.parse(arr[1].trim());

            this.process();
        }
    };

    EachProcessor.prototype.process = function() {
        if(isArray(this.obj)) {
            for(var i = 0; i < this.obj.length; ++i) {
                if(this.indexIterator !== null) {
                    this.defined[this.indexIterator] = i;
                }
                this.defined[this.valueIterator] = this.obj[i];
                this.childs = this.childs.concat(buildStructure(this, this.root, this.data, concatObject(this.defined, this.predefined)));
            }
        } else if(typeof this.obj === "object" && this.obj !== null) {
            for(var p in this.obj) {
                if(this.indexIterator !== null) {
                    this.defined[this.indexIterator] = p;
                }
                this.defined[this.valueIterator] = this.obj[p];                
                this.childs = this.childs.concat(buildStructure(this, this.root, this.data, concatObject(this.defined, this.predefined)));
            }
        } else if(typeof this.obj === "number" && !isNaN(this.obj) && isFinite(this.obj)) {
            var tmp = parseInt(this.obj,10);
        } else {
            if(console && console.error)
                console.error( "processing error" );
            return;
        }

        for(var j = 0; j < this.childs.length; ++j)
            this.domElement.appendChild(this.childs[j].domElement);
    };
