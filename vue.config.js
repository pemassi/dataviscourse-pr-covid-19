module.exports = {
  chainWebpack: config => {
    config.module
      .rule('html')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader')
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/dataviscourse-pr-covid-19-public/'
    : '/'
};
