// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: {
    site: './source/javascripts/site.js'
  },

  plugins: [
        new webpack.ProvidePlugin({ PIXI: 'pixi.js' }),
        // new webpack.ProvidePlugin({ pixiCustom: 'pixi-custom' })
  ],

  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['*','.js','.jsx']
    // root: __dirname + '/source/javascripts',
  },

  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/[name].js',
  },

  module: {
    loaders: [
      {
        test: /source\/assets\/javascripts\/.*\.js$/,
        exclude: /node_modules|\.tmp|vendor/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
      // ...
    ]
  }
};