const path = require('path')
const webpack = require("webpack")

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