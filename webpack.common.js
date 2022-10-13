/*eslint-disable*/
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    module: {
        rules: [            
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }]
            },
            {
                test: /\.(svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|woff|woff2|eot|ttf|mp3|ogg)(\?[a-z0-9=.]+)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 100000
                    }
                }]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
           
        ],
    },
    entry: './src/index.js',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'BFresh',
            meta: {
                viewport: 'width=device-width, initial-scale=1.0',
            },
            template: './src/html/index.html'
        }),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery",
            "moment": "moment"
        }),
        new FaviconsWebpackPlugin({
            logo: './src/assets/favicons_b.png',
            inject: false,
            favicons:{
                appName: 'BFRESH',
                icons:{
                    android: true,
                    appleIcon: true,
                    appleStartup: false,
                    coast: false,
                    favicons: true,
                    firefox: false,
                    windows: false,
                    yandex: false		
                }
            }
        })
        
    ],
    // output: {
    //     filename: '[name].[contenthash].js',
    //     path: path.resolve(__dirname, 'dist')
    // },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    node: {
        fs: 'empty'
    }
    
  
};