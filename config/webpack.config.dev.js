var webpack = require('webpack');
var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');
var dotenv = require("dotenv");

var envConfig = dotenv.config();

module.exports = {
    devtool: 'cheap-eval-source-map',
    entry: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        'client/index.tsx'
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve('public'),
        publicPath: '/static/'
    },
    resolve: {
        modules: [path.resolve('src'), 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            "joi": "joi-browser"
        }
    },
    module: {
        rules: [
            {
                test: /\.[jt]?sx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot-loader/webpack', 'awesome-typescript']
            },
            {
                test: /\.json$/,
                loaders: ['json']
            }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin(Object.keys(envConfig)),
        new webpack.HotModuleReplacementPlugin(),
        new WebpackNotifierPlugin({ alwaysNotify: false }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("development")
            }
        })
    ]
};
