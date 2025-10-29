const webpack = require('webpack');

module.exports = function override(config) {
  // Add resolve extensions
  config.resolve.extensions = [...(config.resolve.extensions || []), '.js', '.mjs'];

  // Configure resolve
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      "process": require.resolve("process/browser.js"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url"),
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util"),
      "fs": false,
      "net": false,
      "tls": false,
      "zlib": false,
    },
  };

  // Configure plugins
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: ['process/browser.js', 'process'],
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
      'process.browser': true,
    }),
  ];

  // Add module rules for .mjs files
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false
    }
  });

  return config;
}
