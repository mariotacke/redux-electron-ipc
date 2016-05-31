'use strict';

const webpack        = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const env            = process.env.WEBPACK_ENV;
const library        = 'electron-redux-ipc';
const plugins        = [];

let filename;

if (env === 'production') {
    plugins.push(new UglifyJsPlugin({ minimize: true }));
    filename = `${library}.min.js`;
} else {
    filename = `${library}.js`;
}

const config = {
    entry: `${__dirname}/src/index.js`,
    output: {
        path: `${__dirname}/dist`,
        filename,
        library,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: [
                        'es2015'
                    ],
                    plugins: [
                        'babel-plugin-add-module-exports'
                    ]
                }
            }
        ]
    },
    target: 'electron',
    plugins
};

module.exports = config;
