const path = require('path')

let config = {
  entry: './lib/index.js',
  output: {
    filename: 'octo.js',
    library: 'octo',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var'
  }
}

module.exports = config
