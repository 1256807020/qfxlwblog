const path = require('path')
// 对象式
module.exports = (options, context) => ({
  define() {
    return {
      selector: options.selector || 'div[class*="language-"] pre',
      copyText: options.copyText || "复制",
      change: options.change
    };
  },
  clientRootMixin: path.resolve(__dirname, "clientRootMixin.js")
});
