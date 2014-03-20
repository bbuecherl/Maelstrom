module.exports = function(grunt) {
    var srcFiles = [                    
            "src/amdSupport.js",
            "src/polyfill.js",
            "src/dom.js",
            "src/helper.js",
            "src/buildStructure.js",
            "src/Maelstrom.js",
            "src/Template.js",
            "src/TemplateElement.js",
            "src/TemplateFragment.js"
        ],
        devFile = "dist/Maelstrom.dev.js",
        minFile = "dist/Maelstrom.min.js";

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: "/**\n"
                    + " * Maelstrom v<%= pkg.version %>-<%= grunt.template.today('yymmddHHMM') %>\n"
                    + " * https://github.com/bbuecherl/Maelstrom/\n"
                    + " * by Bernhard Buecherl http://bbuecherl.de/\n"
                    + " * License: MIT http://bbuecherl.mit-license.org/"
                    + " */\n",
                seperator: "\n",
                footer: "\n    return Maelstrom;\n});\n"
            },
            dist: {
                src: srcFiles,
                dest: devFile
            }
        },
        
        uglify: {
            options: {
                banner: "/**\n"
                    + " * Maelstrom v<%= pkg.version %>-<%= grunt.template.today('yymmddHHMM') %>\n"
                    + " * https://github.com/bbuecherl/Maelstrom/\n"
                    + " * by Bernhard Buecherl http://bbuecherl.de/\n"
                    + " * License: MIT http://bbuecherl.mit-license.org/"
                    + " */\n"
            },
            dist: {
                src: [devFile],
                dest: minFile
            }
        },

        jshint: {
            dev: [devFile],
            src: srcFiles.slice(1), //exclude amdSupport.js
            options: {
                force: true,
                reporter: require("jshint-stylish"),
                "-W083": true //function inside loops
            }            
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");

    //Tasks
    grunt.registerTask("build", ["jshint:src", "concat", "jshint:dev", "uglify"]);
};
