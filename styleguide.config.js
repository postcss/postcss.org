const path = require("path")
module.exports = {
  title: "PostCSS.org Style Guide",
  components: "./web_modules/**/*.js",
  serverPort: 3001,
  skipComponentsWithoutExample: true,
  updateWebpackConfig: function(webpackConfig) {
    const dir = path.join(__dirname, "web_modules")
    webpackConfig.module.loaders.push(
      {
        test: /\.js$/,
        include: dir,
        loader: "babel",
      },
      {
        test: /\.css$/,
        include: dir,
        loader: "style!css?modules&importLoaders=1!postcss-loader",
      }
    )
    webpackConfig.postcss = [
      require("postcss-cssnext")(),
    ]
    return webpackConfig
  },
}
