// const path = require('path');
// // const HtmlWebpackPlugin = require('html-webpack-plugin')
// // const BundleAnalyzerPlugin =
// //   require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// module.exports = {
//   mode: 'development',
//   entry: {
//     bundle: path.resolve(__dirname, './src/index'),
//   },
//   output: {
//     path: path.resolve(__dirname, './dist'),
//     filename: 'index.js',
//     clean: true,
//     assetModuleFilename: '[name][ext]',
//     library: 'LHSVirtualList',
//     libraryTarget: 'commonjs2',
//   },
//   devtool: 'source-map',
//   devServer: {
//     static: {
//       directory: path.resolve(__dirname, './dist'),
//     },
//     port: 3000,
//     open: true,
//     hot: true,
//     compress: true,
//     historyApiFallback: true,
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(scss|css)$/i,
//         use: ['style-loader', 'css-loader', 'sass-loader'],
//       },
//       {
//         test: /\.(tsx|ts|js|)$/i,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env'],
//           },
//         },
//       },
//       {
//         test: /\.(png|svg|jpg|jpeg|gif)$/i,
//         type: 'asset/resource',
//       },
//     ],
//   },
//   plugins: [
//     // new HtmlWebpackPlugin({
//     //   title: 'Webpack App',
//     //   filename: 'index.html',
//     //   template: 'src/template.html',
//     // }),
//     // new BundleAnalyzerPlugin(),
//   ],
//   // add ts and tsx suffix to resolve entry，使编译能自动匹配后缀
//   resolve: {
//     extensions: ['.js', '.jsx', '.ts', '.tsx'],
//   },
// };
