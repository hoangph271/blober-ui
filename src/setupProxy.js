const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://192.168.0.102:3000',
      changeOrigin: true,
    })
  )
}
