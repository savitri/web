var webpack = require("webpack");
var dotenv = require("dotenv");
var path = require('path');

var WebpackHashPlugin = require("./webpack-hash-plugin");

var envConfig = dotenv.config();

module.exports = {
    entry: './src/client/index.tsx',

    output: {
        filename: 'bundle.[chunkhash].js',
        path: './public',
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ],
        alias: {
            "joi": "joi-browser"
        }
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.EnvironmentPlugin(Object.keys(envConfig)),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            },
            output: {
                comments: false
            },
            sourceMap: false
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new WebpackHashPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.[jt]?sx?$/,
                use: 'awesome-typescript',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                use: 'json'
            }
        ]
    }
};
