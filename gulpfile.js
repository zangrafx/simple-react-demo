"use strict";

var gulp = require("gulp"),
    path = require("path"),
    pckg = require(path.join(__dirname, "package.json")),
    querystring = require("querystring"),
    webpack = require("webpack");

function webpackTask(isDebugMode, done) {
    var env,
        plugins;

    if (isDebugMode) {
        env = "development";
    } else {
        env = "production";
    }

    plugins = [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(env)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin(pckg.name + ".common.min.js")
    ];

    if (!isDebugMode) {
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    webpack({
        "bail": true,
        "context": path.join(__dirname, "web_modules", pckg.name),
        "debug": isDebugMode,
        "devtool": "source-map",
        "entry": {
            "index": "./index"
        },
        "module": {
            "loaders": [
                {
                    // bower components usually expect to run in browser
                    // environment and sometimes assume that global 'this'
                    // is always the Window object which is a mistake
                    "test": /bower_components/,
                    "loader": "imports?this=>window"
                },
                {
                    "test": /\.jsx$/,
                    "exclude": /(bower_components|node_modules)/,
                    "loader": "babel-loader?" + querystring.stringify({
                        "loose": [
                            "es6.modules",
                            "es6.properties.computed",
                            "es6.templateLiterals"
                        ],
                        "optional": [
                            "runtime",
                            "utility.deadCodeElimination",
                            "utility.inlineExpressions",
                            "validation.undeclaredVariableCheck",
                            "validation.react"
                        ]
                    })
                }
            ]
        },
        "output": {
            "filename": pckg.name + ".[name].min.js",
            "path": __dirname + "/dist"
        },
        "plugins": plugins,
        "resolve": {
            "extensions": [
                "",
                ".coffee",
                ".js",
                ".jsx"
            ]
        }
    }, done);
}

gulp.task("watch", function () {
    gulp.watch(path.join(__dirname, "web_modules", "**", "*.jsx"), [
        "webpack"
    ]);
});

gulp.task("webpack", function (done) {
    webpackTask(true, done);
});

gulp.task("webpack:deploy", function (done) {
    webpackTask(false, done);
});

gulp.task("build", ["webpack"]);
gulp.task("default", ["build"]);
gulp.task("deploy", ["webpack:deploy"]);
