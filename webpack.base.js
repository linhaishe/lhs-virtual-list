const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(tsx|ts|js|)$/i,
        exclude: /node_modules/,
        // use: {
        //   loader: 'babel-loader',
        //   options: {
        //     presets: ['@babel/preset-env'],
        //   },
        // },
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    targets: {
                      browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead', 'not IE 11'],
                    },
                  },
                ],
              ],
              plugins: ['lodash'],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: false,
              appendTsSuffixTo: [],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  // add ts and tsx suffix to resolve entry，使编译能自动匹配后缀
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};

if (process.env.npm_config_report) {
  module.exports.plugins = (module.exports.plugins || []).concat([new BundleAnalyzerPlugin()]);
}
