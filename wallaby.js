var wallabyWebpack = require('wallaby-webpack');
var path = require('path');


module.exports = function(wallaby) {

    var webpackPostprocessor = wallabyWebpack({
        entryPatterns: [
            'base.spec.js',
            'test/**/*spec.js'
        ],

        module: {
            loaders: [
                { test: /\.css$/, loader: 'raw-loader' },
                { test: /\.html$/, loader: 'raw-loader' },
                { test: /\.ts$/, loader: '@ngtools/webpack', include: /node_modules/, query: { tsConfigPath: 'tsconfig.json' } },
                { test: /\.js$/, loader: 'angular2-template-loader', exclude: /node_modules/ },
                { test: /\.json$/, loader: 'json-loader' },
                { test: /\.styl$/, loaders: ['raw-loader', 'stylus-loader'] },
                { test: /\.less$/, loaders: ['raw-loader', 'less-loader'] },
                { test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'sass-loader'] },
                { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000' }
            ]
        },

        resolve: {
            extensions: ['.js', '.ts'],
            modules: [
                path.join(wallaby.projectCacheDir, 'src/app'),
                path.join(wallaby.projectCacheDir, 'src')
            ]
        }
    });

    return {
        files: [
            { pattern: 'base.spec.ts', load: false },
            { pattern: 'src/**/*.ts', load: false },
            { pattern: 'src/**/*.d.ts', ignore: true },
            { pattern: 'src/**/*.css', load: false },
            { pattern: 'src/**/*.less', load: false },
            { pattern: 'src/**/*.scss', load: false },
            { pattern: 'src/**/*.sass', load: false },
            { pattern: 'src/**/*.styl', load: false },
            { pattern: 'src/**/*.html', load: false },
            { pattern: 'src/**/*.json', load: false },
            { pattern: 'src/**/*spec.ts', ignore: true }
        ],

        tests: [
            { pattern: 'test/**/*spec.ts', load: true }
        ],

        testFramework: 'jasmine',

        preprocessors: {
            '**/*.js': file => file.content
              .replace('../dist/main', '../src/main')
              .replace('export function main() {', 'export function main() {} {'),
        },

        middleware: function(app, express) {
            var path = require('path');
            app.use('/favicon.ico', express.static(path.join(__dirname, 'src/favicon.ico')));
            app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
        },

        env: {
            kind: 'electron'
        },

        postprocessor: webpackPostprocessor,

        setup: function() {
            window.__moduleBundler.loadTests();
        },

        debug: true
    };
};
