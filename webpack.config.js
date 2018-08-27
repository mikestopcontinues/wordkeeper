// import

const _ = require('lodash');
const path = require('path');

const webpack = require('webpack');
const loaderUtils = require('loader-utils');
const HtmlPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');
const styleVars = require('./common/styleVars');

// vars

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const include = path.resolve(__dirname, 'keeper');

const hotPath = 'webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr&reload=true&noInfo=true&quiet=true&overlay=false';

// export

module.exports = {
  mode: isDev ? 'development' : 'production',
  target: 'electron-renderer',
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'common'),
    },
    modules: [
      path.resolve(__dirname, 'keeper'),
      'node_modules',
    ],
  },

  entry: [
    hotPath,
    './keeper/index.js',
  ],
  output: {
    path: path.resolve('build'),
    publicPath: '/',
    filename: 'index.js',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlPlugin({
      title: pkg.productName || pkg.name,
      template: './keeper/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV,
    }),
  ],

  module: {
    rules: [{
      test: /\.json$/,
      include,
      use: [{
        loader: 'json-loader',
      }],
    }, {
      test: /\.(jpe?g|png|gif)$/,
      include,
      use: [{
        loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]',
      }],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      include,
      use: [{
        loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]',
      }],
    }, {
      test: /\.jsx?$/,
      include,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
          plugins: [
            // Stage 0
            ['@babel/plugin-proposal-function-bind'],

            // Stage 1
            ['@babel/plugin-proposal-export-default-from'],
            ['@babel/plugin-proposal-logical-assignment-operators'],
            ['@babel/plugin-proposal-optional-chaining', {'loose': false}],
            ['@babel/plugin-proposal-pipeline-operator', {'proposal': 'minimal'}],
            ['@babel/plugin-proposal-nullish-coalescing-operator', {'loose': false}],
            ['@babel/plugin-proposal-do-expressions'],

            // Stage 2
            ['@babel/plugin-proposal-decorators', {'legacy': true}],
            ['@babel/plugin-proposal-function-sent'],
            ['@babel/plugin-proposal-export-namespace-from'],
            ['@babel/plugin-proposal-numeric-separator'],
            ['@babel/plugin-proposal-throw-expressions'],

            // Stage 3
            ['@babel/plugin-syntax-dynamic-import'],
            ['@babel/plugin-syntax-import-meta'],
            ['@babel/plugin-proposal-class-properties', {'loose': false}],
            ['@babel/plugin-proposal-json-strings'],

            // Other
            ['react-hot-loader/babel'],
          ],
        },
      }],
    }, {
      test: /\.css/,
      use: [{
        loader: 'style-loader',
        options: {
          hmr: isDev,
          sourceMap: isDev,
        },
      }, {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: isDev,
          importLoaders: 1,
          localIdentName: '[name]_[local]',
          getLocalIdent(ctx, localIdent, name, options) {
            const globalRx = /\.global\.css/i;
            const dashRx = /[^a-zA-Z0-9\\-_\u00A0-\uFFFF]/g;
            const lodashRx = /^((-?[0-9])|--)/;

            if(!options.context) {
              if (ctx.rootContext) {
                options.context = ctx.rootContext;
              } else if (ctx.options && _.isString(ctx.options.context)) {
                options.context = ctx.options.context;
              } else {
                options.context = ctx.context;
              }
            }

            const file = path.relative(options.context, ctx.resourcePath);
            options.content = options.hashPrefix + file + '+' + name;

            if (file.includes('node_modules') || globalRx.test(file)) {
              return name;
            }

            localIdent = localIdent.replace(/\[local\]/gi, name);
            localIdent = loaderUtils.interpolateName(ctx, localIdent, options);
            localIdent = localIdent.replace(dashRx, '-');
            localIdent = localIdent.replace(lodashRx, '_$1');

            return localIdent;
          },
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: isDev,
          plugins: _.compact([
            require('postcss-easy-import')(), // needed?
            // isDev && require('stylelint')(),
            require('postcss-assets')({
              cachebuster: !isDev,
            }),
            require('postcss-inline-svg')(),
            require('postcss-font-awesome')(),
            require('postcss-brand-colors')(),
            require('postcss-color-hcl')(),
            require('postcss-cssnext')({
              features: {
                autoprefixer: false,
                customProperties: {
                  preserve: false,
                  variables: styleVars,
                },
              },
            }),
            require('autoprefixer')({
              browsers: [
                '> 1%',
                'last 2 versions',
                'Firefox ESR',
                'not ie < 9',
              ],
              flexbox: 'no-2009',
            }),
            require('cssnano')({
              preset: 'default',
              autoprefixer: false,
            }),
            isDev && require('postcss-reporter')({
              clearReportedMessages: true,
              plugins: [],
            }),
          ]),
        },
      }],
    }],
  },
};
