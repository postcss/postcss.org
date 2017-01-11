import path from "path"
import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import { phenomicLoader } from "phenomic"

export default ({ config, pkg }) => ({
  module: {
    loaders: [
      { // phenomic requirement
        test: /\.md$/,
        loader: phenomicLoader,
        query: {
          context: path.join(config.cwd, config.source),
          feedsOptions: {
            title: pkg.name,
            site_url: pkg.homepage,
          },

          feeds: {
            "feed.xml": {
              collectionOptions: {
                filter: { layout: "Post" },
                sort: "date",
                reverse: true,
                limit: 20,
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          "css-loader" +
            "?modules"+
            "&localIdentName=[path][name]--[local]--[hash:base64:5]" +
          "!" +
          "postcss-loader",
        ),
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          "css-loader" +
          "!" +
          "postcss-loader",
        ),
      },
      {
        test: /\.(html|ico|jpe?g|png|gif|svg)$/,
        loader: "file-loader" +
          "?name=[path][name].[ext]&context=" +
          path.join(config.cwd, config.destination),
      },
      // client side specific loaders are located in webpack.config.client.js
    ],
  },

  postcss: () => [
    require("postcss-cssnext")(),
  ],

  plugins: [
    new webpack.ProvidePlugin({
      "fetch": "imports?this=>global!exports?global.fetch!whatwg-fetch",
    }),
    new ExtractTextPlugin("[name].[hash].css", { disable: config.dev }),
    new webpack.DefinePlugin({ "process.env": {
      NODE_ENV: JSON.stringify(
        config.production ? "production" : process.env.NODE_ENV
      ), 
      PHENOMIC_PATHNAME: JSON.stringify(process.env.PHENOMIC_PATHNAME),
    } }),

    ...config.production && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  ],

  output: {
    path: path.join(config.cwd, config.destination),
    publicPath: config.baseUrl.pathname,
    filename: "[name].[hash].js",
  },
  resolve: {
    extensions: [ ".js", ".json", "" ],
    root: [ path.join(config.cwd, "node_modules") ],
  },
  resolveLoader: { root: [ path.join(config.cwd, "node_modules") ] },
})
