var config = {
   entry: './main.js',

   output: {
      path: __dirname,
      publicPath: '/',
      filename: 'index.js',
   },

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
