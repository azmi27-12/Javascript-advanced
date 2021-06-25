const path = require('path');
const webpack = require ('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    entry: './assets/JavaScript/main.js',

    output:{
        filename: 'bundle.js'
    },

    module:{
        rules:[
            {
                test: /\.js$/, loader: 'babel-loader', exclude: (/node_modules/)
            },

            {
                test: /\.(sa|sc|c)ss$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    }

                ]
            },

            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use:[
                    {
                        loader: "file-loader",
                        options:{
                            outputPath: "images"
                        }
                    }
                ]
            }


        ]
    },


    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template:'index.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: "bundle.css"
          }),

        new Dotenv()   
    ],
    mode: 'development'

}