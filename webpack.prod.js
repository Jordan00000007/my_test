/*eslint-disable*/
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[hash:8].css',
            chunkFilename: '[id].[hash:8].css',
        }),
        new webpack.HashedModuleIdsPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         //   'NODE_ENV': JSON.stringify('development'),
        //         'API_URL': JSON.stringify(`http://${window.location.host}`)
        //     }
      
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                // include: path.resolve(__dirname, 'src'),
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader', // conflict with MiniCssExtractPlugin
                    'thread-loader',
                    'css-loader',
                    'postcss-loader'
                ],

            },
           
        ],
    },
    mode: 'production',
    devtool: 'source-map'
});