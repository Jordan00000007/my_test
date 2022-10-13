/*eslint-disable*/
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const path = require('path');

//const targetIP = '182.234.47.145';
//const targetIP = '172.16.36.55';
//const targetIP = '172.21.20.201';
const targetIP = '172.21.20.54';
//const targetIP = '172.21.70.18';
//const targetIP = 'iov.antzer-tech.com';


module.exports = merge(common, {
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.NamedModulesPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         //   'NODE_ENV': JSON.stringify('development'),
        //         'API_URL': JSON.stringify('http://localhost:9000/')
        //     }
        // }),
       
    ],
    module: {
        rules: [
            {
                // test: /\.(sa|sc|c)ss$/,
                test: /\.css$/,
                // include: path.resolve(__dirname, 'src'),
                use: [
                    'style-loader',
                    'thread-loader',
                    'css-loader',
                    'postcss-loader',
                    // 'sass-loader',
                ],
            },
           
          
           
        ]
    },
    mode: 'development',
    // devtool: 'inline-source-map',
    // output: {
    //     filename: 'bundle.js',
    //     path: path.join(__dirname, 'public', 'scripts'),
    // },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
        // publicPath: 'http://localhost:9000/'
    },
    devServer: {
        // after: function (app, server) {
        //     app.get('./*', function (req, res) {
        //         res.sendfile('./dist');
        //     });
        // },
        // index: 'index.html',
        contentBase: path.join(__dirname, "dist"),
        // public: 'http://localhost:9000',
        publicPath: '/',
        // contentBase: path.join(__dirname, './dist'),
        historyApiFallback: true,
        compress: true,
        port: 9000,
        host: '0.0.0.0', //服务器的ip地址
        https: false,
        // compress: true,
        // port: 9999, //端口
        // open: true, //自动打开页面
        // hot: true, //开启热更新
        proxy: {
            "/DashboardAPI": {
                target: "http://172.16.36.108",
                secure: false,
                changeOrigin: true,
            },
            "ws://111.185.18.57/ws/WebServiceAPI": {
                target: `ws://${targetIP}:8164`,
                ws: true,
                secure: false,
                changeOrigin: true
            },
            "/UserAPI": {
                target: `http://${targetIP}:8161`,
                secure: false,
                changeOrigin: true
            },
            "/AuthenticationAPI": {
                target: `http://${targetIP}:8161`,
                secure: false,
                changeOrigin: true
            },
            "/StoreAPI": {
                target: `http://${targetIP}:8162`,
                secure: false,
                changeOrigin: true
            },
            "/DeviceAPI": {
                target: `http://${targetIP}:8162`,
                secure: false,
                changeOrigin: true
            },
            "/EventAPI": {
                target: `http://${targetIP}:8163`,
                secure: false,
                changeOrigin: true
            },
            "/TraceAPI": {
                target: `http://${targetIP}:8165`,
                secure: false,
                changeOrigin: true
            },
            "/api": {
                target: `http://${targetIP}:9080`,
                secure: false,
                changeOrigin: true
            },
            "/StatusAPI": {
                target: "http://172.16.36.108",
                secure: false,
                changeOrigin: true
            },
            "/EmployeeAPI": {
                target: "http://172.16.36.108",
                secure: false,
                changeOrigin: true
            },
            "/WidgetAPI": {
                target: "http://172.16.36.108",
                secure: false,
                changeOrigin: true
            },
            "/Screenshot": {
                target: "http://172.16.36.108",
                secure: false,
                changeOrigin: true
            }
        }
    }
});