const DefinePlugin = require("webpack").DefinePlugin;

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        API_BASE_URL: JSON.stringify(process.env.API_BASE_URL)
      })
    ]
  },
  chainWebpack: config => {
    // github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/config/base.js#L59-L68
    // github.com/vuejs/vue-cli/issues/1055
    config.module.rules.delete("svg");

    config.module
      .rule("svg")
      .test(/\.(svg)(\?.*)?$/)
      .use()
      .loader("vue-svg-loader")
      .options({
        svgo: {
          plugins: [{ removeViewBox: false }]
        }
      });
  }
};
