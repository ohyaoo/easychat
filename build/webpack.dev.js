'use strict'
process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const base = require('./webpack.base')
const _ = require('./utils')

// base.devtool = 'eval-source-map'

base.devtool = 'source-map'
base.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
)

//push loader for .css file
base.module.loaders.push({
    test: /\.css$/,
    loaders: ['style-loader', _.cssLoader, 'postcss-loader']
})

module.exports = base