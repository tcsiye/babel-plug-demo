const MyPlugin = require('./plugs')

module.exports = function (api) {
  api.cache(true)

  const plugins = [MyPlugin]

  return { plugins }
}
