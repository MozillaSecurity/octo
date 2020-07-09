const path = require('path')

module.exports = {
  entry: './lib/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'octo.js',
    globalObject: 'this',
    library: 'octo',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
}
