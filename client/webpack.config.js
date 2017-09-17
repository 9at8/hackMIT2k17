const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let webpack = require("webpack");

let config = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index_bundle.js",
    publicPath: "/"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx$/, loader: "babel-loader", exclude: /node_modules/ },
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8192
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:3000",
      "/static": "http://localhost:3000"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};

if (process.env.NODE_ENV === "production") {
  config.output.publicPath = "/static/";
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = config;
