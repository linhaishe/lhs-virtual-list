const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { DefinePlugin } = webpack;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');

const { HashedModuleIdsPlugin } = webpack.ids;
const webpackBaseConfig = require('./webpack.base');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  entry: path.resolve(__dirname, './src/index'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'lhs.js', // 输出文件名
    library: 'lhscomponents', // 组件库名称
    libraryTarget: 'umd', // 模块化格式
    umdNamedDefine: true,
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
  plugins: [
    new DefinePlugin({
      'process.env': { NODE_ENV: '"production"', PUBLIC_URL: undefined },
    }),
    new CaseSensitivePathsPlugin(),
    new WebpackBarPlugin(),
    new HashedModuleIdsPlugin(),
  ],
});
