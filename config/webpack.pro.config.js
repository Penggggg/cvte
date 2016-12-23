var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
    entry: {
        app: "./src/index.tsx"
    },
    output: {
        filename: "[name].[chunkhash:8].js",
        path:"./dist"
    },

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {  test: /\.less$/,loader: "style-loader!css-loader!less-loader" },
            { test: /\.(svg)$/, loader: 'url-loader?limit=8192'}
        ]
    },

    plugins: [
        // 压缩
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]


};