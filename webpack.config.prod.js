const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const API_URL = '/api'

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new webpack.DefinePlugin({
      API_URL: `"${API_URL}"`
    })
  ]
})
