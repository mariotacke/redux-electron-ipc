const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './app/app.js',
    output: {
        path: 'dist',
        filename: 'bundle.js'
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
                    ]
                }
            }
        ]
    },
    target: 'electron',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Redux Electron IPC Middleware Example'
        })
    ]
};
