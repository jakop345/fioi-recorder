const path = require('path');
const webpack = require('webpack');
const SRC = path.resolve(__dirname, "frontend");

const config = module.exports = {
  entry: {
    player: './frontend/player/index.js',
    sandbox: './frontend/sandbox/index.js',
    recorder: './frontend/recorder/index.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: SRC,
        loader: 'babel-loader',
        query: {
          babelrc: true
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(ico|gif|png|jpg|jpeg|svg)$/,
        loader: 'file-loader?context=public&name=images/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
		alias: {
			'lamejs': 'lamejs/src/js/'
		}
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.js",
      minChunks: function (module) { return /node_modules/.test(module.resource); }
    })
  ]
};

if (process.env.NODE_ENV !== 'production') {
  config.devtool = 'eval'; // inline-source-map
} else {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}
