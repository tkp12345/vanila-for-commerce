const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = () => {
  return {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          use: {
            loader: 'babel-loader',
          },
          exclude: ['/node_modules'],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true },
            },
          ],
        },
        {
          test: /\.(css|scss)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    optimization: { minimize: true },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.js', '.json', 'css'],
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
    output: { path: path.join(__dirname, './dist/src'), filename: '[name].js' },
    devtool: 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, './dist/src'),
      },
      devMiddleware: {
        publicPath: '/',
      },
      host: 'localhost',
      port: 8080,
      hot: true,
      open: true,
      historyApiFallback: true,
    },
  }
}
