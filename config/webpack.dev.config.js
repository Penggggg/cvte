var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: {
        app: "./src/index.tsx"
    },
    output: {
        filename: "[name].js",
        path:"./dist"
    },

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.less$/,loader: "style-loader!css-loader!less-loader" },
            { test: /\.(svg)$/, loader: 'url-loader?limit=8192'}
        ]
    },

    plugins: [

 
        new HtmlWebpackPlugin({
          template: './test/index.html'
        }), 
 
        new OpenBrowserPlugin({
          url: 'http://localhost:3000'
        }), 
 
        new webpack.DefinePlugin({
            _ENV_: 'production'
        })
    ],

};