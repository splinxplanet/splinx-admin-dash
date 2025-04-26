const { override, addWebpackAlias, addWebpackResolve } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    process: 'process/browser',
  }),
  addWebpackResolve({
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      "url": require.resolve("url/")
    }
  })
);