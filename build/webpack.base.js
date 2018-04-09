'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config')
const _ = require('./utils')


module.exports = {
    entry: {
        main: './src/view/main/main.js'
    },
    output: {
        path: _.outputPath,
        filename: 'view/[name]/[name].js',
        chunkFilename: 'view/[name]/[name].js'
    },

    performance: {
        hints: false
            // process.env.NODE_ENV === 'production' ? 'warning' : false
    },
    resolve: {
        extensions: ['.js', '.vue', '.css', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            root: path.join(__dirname, '../src'),
            components: path.join(__dirname, '../src/components')
        },
        modules: [
            _.cwd('node_modules'),
            // this meanse you can get rid of dot hell
            // for example import 'components/Foo' instead of import '../../components/Foo'
            _.cwd('src')
        ]
    },
    module: {
        loaders: [{
                test: /\.vue$/,
                loaders: ['vue-loader']
            },
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: [/node_modules/]
            },
            {
                test: /\.es6$/,
                loaders: ['babel-loader']
            },
            {
                test: '/\.json/',
                loader: 'json',
            },
            {
                test: /\.(ico|svg|jpg|png|gif|otf|webp)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(eot|ttf|svg|woff)(\?.*)?$/,
                loader: 'url-loader?name=fonts/[name].[hash:8].[ext]',
            }, {
                test: /\.(scss|sass)$/,
                loader: 'style-loader!css-loader!sass-loader'
            }
            //   ,
            //   {
            //     test: /\.svg$/,
            //     loader: 'raw-loader'
            //   }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new HtmlWebpackPlugin({
            title: "main.html",
            template: path.join(__dirname, '../src/view/main/main.html'),
            filename: path.join(__dirname, '../app/dist/main.html'),
            // inject: "head",
            chunks: ['vendor', 'main', 'styles']
        }),
        new webpack.LoaderOptionsPlugin(_.loadersOptions()),
        new CopyWebpackPlugin([{
            from: _.cwd('./static'),
            // to the roor of dist path
            to: './static'
        }])
    ],
    target: _.target,
    node: {
        __filename: true,
        __dirname: true
    }
};