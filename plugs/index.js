module.exports = function () {
  return {
    pre() {},
    // 在 visitor 下挂载各种感兴趣的节点类型的监听方法
    visitor: {
      /**
       * 对 Identify 类型的节点进行处理
       * @param {NodePath} path
       */
      Identifier(path) {
        // 转换方法名为大写
        path.node.name = path.node.name.toUpperCase();
      },
    },
    post() {},
  };
};