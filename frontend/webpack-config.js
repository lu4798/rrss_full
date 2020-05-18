var BundleTracker = require("webpack-bundle-tracker");

module.exports = {
    context: __dirname,
    entry: "./src/",
    mode: "development",

    output: {
        path: require("path").resolve("../static/bundles/"),
        filename: "bundle.js",
    },



    plugins: [
        new BundleTracker({
            path: __dirname,
            filename: "../static/stats/webpack-stats.json"
        })
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
            {

                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options :{
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-react",
                    ],
                    plugins:[
                        "@babel/plugin-proposal-class-properties"
                    ]
                }
            },

            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                  'url-loader'
                ]
          }
        ]
    }
};