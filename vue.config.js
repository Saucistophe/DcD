const webpack = require('webpack');

module.exports = {
  configureWebpack: function (config) {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: ['yaml-loader']
      }
    );

    config.plugins.push(
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
        DEBUG: false
      })
    );
  }
};