const path = require('path')

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    extensions: [ '.ts' ],
    alias: {
      other: path.resolve(__dirname, 'src/other'),
      interfaces: path.resolve(__dirname, 'src/interfaces'),
      core: path.resolve(__dirname, 'src/core'),
      utils: path.resolve(__dirname, 'src/utils'),
      tests: path.resolve(__dirname, 'tests'),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};