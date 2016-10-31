 path = require('path');
const webpack = require('webpack');

var config = {
   entry: './main.js',
   devtool: 'cheap-module-source-map',
   output: {
      path: __dirname,
      publicPath: '/',
      filename: 'index.js',
   },

   plugins: [
      new webpack.DefinePlugin({
          'process.env': {
              'NODE_ENV': JSON.stringify('production')
         }
      })
   ],
   
   module: {
      loaders: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',

            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   }
}

module.exports = config;
