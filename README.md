## 技术分享-代码转换babel

分享内容主要有以下几个内容：

1.babel介绍

2.代码转换过程

3.插件系统

4.如何编写一个插件



#### 一、介绍

**解决了什么问题？**

Babel能让开发者在开发过程中，可以直接使用各类前端脚本类语言（如：TS、Flow、JSX）或新的语法特性，同时不需要考虑实现语法标准和运行环境（浏览器内核、V8内核）。如早期各浏览器实现ES6标准不一，为了在开发中使用最新ES标准语法糖，Babel解决按需转换为低版本支持的代码，把ES6+标准转换为ES2015标准兼容浏览器内核版本；

**做了什么事情？**

Babel 通过构建工具，将 JS 代码转换为 **AST**，同时对转换的 AST 应用各种插件进行处理，最终输出编译后的 JS 代码；



#### 二、转换过程

示意图：

![image.png](https://s2.loli.net/2022/08/14/zgyQiSWIwZrfVjH.png)

1.解析（Code to [AST](https://astexplorer.net/)）

- 词法分析：对输入字符做标记操作
- 语法分析：处理标记之间的关系，最终形成完整的AST结构
- 使用@babel/parser解析代码中的关键字变量语句，并转换为AST树最后生成为AST
- ![2022-08-14.132250.png](https://s2.loli.net/2022/08/14/oVgU3svKmfDCB1E.png)

2.转换（AST to AST）

- 使用插件/预设对原始AST进行增删改操作
- Babel 使用 @babel/traverse 提供的方法对 AST 进行深度优先遍历
- 借助访问者模式（Visitor Pattern）对关注的节点定义处理函数（[源码](https://github.com/babel/babel/blob/a647b9ea6bdd510f0d80b58dbea66828016ffe00/packages/babel-core/src/transformation/index.ts#L76)）
  - 1.执行所有插件的 pre 方法。
  - 2.按需执行 visitor 中的方法。
  - 3.执行所有插件的 post 方法

3.生成（AST to Code）

- 默认使用 @babel/generator 将上一阶段处理后的 AST 转换为代码字符串



#### 三、插件系统

- 核心库: @babel/core，@babel/parser，@babel/traverse ， @babel/generator

- 常用插件: 

  @babel/preset-env：包含了一组最新浏览器已支持的 ES 语法特性，并且可以通过配置目标运行环境范围，自动按需引入插件。
  vue

  @vue/cli-plugin-babel：vuecli内部使用的代码转换插件，如还有vuejsx的插件transform-vue-jsx

  

#### 四、如何编写一个插件

Babel 插件的写法是借助访问者模式（Visitor Pattern）对关注的节点定义处理函数。

```javascript
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
```

配置babel使用自己的插件（具体可以[查看官网](https://www.babeljs.cn/docs/configuration)）：

```javascript
// babel.config.js
const MyPlugin = require('./plugs')
module.exports = function (api) {
  api.cache(true)

  const plugins = [MyPlugin]

  return { plugins }
}

```

运行结果：

![image.png](https://s2.loli.net/2022/08/14/iBXxjP6aheTFAYD.png)



使用到的链接：

ast解释：https://astexplorer.net/

babel官网：https://www.babeljs.cn/docs/

babel源码：https://github.com/babel/babel/blob/a647b9ea6bdd510f0d80b58dbea66828016ffe00/packages/babel-core/src/transformation/index.ts

