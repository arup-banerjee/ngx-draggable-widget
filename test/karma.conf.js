module.exports = function(config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        files: [
            { pattern: "../base.spec.ts" },
            { pattern: "**/*.+(ts|html)" }
        ],

        exclude: [
            "node_modules/**/*.+(ts|js)",
            "dragabble-dashboard/src/app/**/*.+(ts|js)"
        ],
        preprocessors: {
            "../src/**/*.+(ts|html)": ["karma-typescript"],
            "**/*.+(ts|html)": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            bundlerOptions: {
                entrypoints: /\.spec\.ts$/,
                transforms: [
                    require("karma-typescript-angular2-transform")
                ]
            },
            compilerOptions: {
                lib: ["ES2015", "DOM", "commonjs"]
            }
        },

        reporters: ["dots", "karma-typescript"],

        browsers: ["Chrome"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
    });
};