const path = require('path');
const LiveReloadPlugin = require('@kooneko/livereload-webpack-plugin');

module.exports = {
    context: path.join(__dirname, ''),
    entry: './app/script.js',
    output: {
        filename: 'script.min.js',
        path: path.resolve(__dirname, 'app/public/js')
    },
    devServer: {
        contentBase: path.join(__dirname, 'app'),
        compress: true,
        port: 9000
    },
    mode: "none",
    module: {
        rules: [
            {
                test: /\.m?js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/react'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']

                    }
                }
            },
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                exclude: /node_modules/,
                use: [
                    'file-loader',
                ],
            },
        ],
    },
    plugins: [
        new LiveReloadPlugin()
    ]
};