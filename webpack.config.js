const path = require("path");
const PugPlugin = require('pug-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.pug", // => dist/index.html
    },
    
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },
    optimization: {
        minimize: true,
        minimizer: [
            "...",
            new CssMinimizerPlugin(),
        ]
    },
    plugins: [
            new MiniCssExtractPlugin(),
            new PugPlugin(),
    ],
    module: {
        rules: [
            { 
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.pug$/,
                loader: PugPlugin.loader,
              },
        ]
    },
    mode: "production"
};