const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Todo List',
      template: './src/index.html',
      inject: 'head',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    watchFiles: ["src/*.html", "src/style.css"],
    hot: true,
  },
};