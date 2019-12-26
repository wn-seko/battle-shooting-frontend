const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const Copy = require('copy-webpack-plugin')
const IncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssNested = require('postcss-nested')
const autoprefixer = require('autoprefixer')
const ForkTsChecker = require('fork-ts-checker-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const localIdentName = isProd ? '' : '[path][name]---[local]---[hash:base64:5]'

module.exports = {
  mode: 'development',
  entry: ['react-hot-loader/patch', 'react', 'react-dom', 'semantic-ui-react', '@babel/polyfill', './src/index.tsx'],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/build',
    publicPath: '/'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.css']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/cache-loader')
            }
          },
          {
            loader: 'thread-loader',
            options: {
              workerParallelJobs: 50,
              poolTimeout: 2000,
              poolParallelJobs: 50,
              name: 'ts-pool'
            }
          },
          {
            loader: 'babel-loader?cacheDirectory',
            options: {
              babelrc: false,
              presets: [['@babel/preset-env', { targets: 'last 2 versions, ie 11', modules: false }]]
            }
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              transpileOnly: true
            }
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.tsx?$/, use: 'source-map-loader' },
      // CSS
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          { loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader' },
          { loader: 'css-loader', options: { modules: true, localIdentName, minimize: isProd } },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [postcssNested, autoprefixer()]
              }
            }
          }
        ]
      },
      // Images
      {
        test: /\.(ico|jpe?g|png|gif)$/,
        use: 'file-loader?name=[path][name].[ext]'
      },
      // Fonts and SVGs
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.html',
      favicon: 'src/assets/images/favicon.ico'
    }),
    new Copy([
      { from: 'node_modules/normalize.css/normalize.css', to: 'assets/' },
      { from: 'node_modules/semantic-ui-css/semantic.min.css', to: 'assets/' },
      { from: 'node_modules/semantic-ui-css/themes/default/assets/', to: 'assets/themes/default/assets/' }
    ]),
    new IncludeAssetsPlugin({
      assets: ['assets/normalize.css'],
      append: true
    }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new webpack.NormalModuleReplacementPlugin(
      /moment-timezone\/data\/packed\/latest\.json/,
      require.resolve('./src/assets/js/moment-timezone/timezone-definitions.json')
    ),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ForkTsChecker()
  ],
  performance: {
    maxEntrypointSize: 1000 * 1000,
    maxAssetSize: 800 * 1000
  }
}
