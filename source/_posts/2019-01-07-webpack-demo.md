---
title: webpack-demo
date: 2019-01-07 03:24:39
tags:
  - webpack
  - html
  - js
---

1. 建立 JavaScript 项目
2. 引入 Webpack
    * 引入 Babel 编译 ES2015
    * 引入 Copy 插件直接复制静态文件
    * 引入 style-loader 处理样式文件，或用 sass-loader 编译样式

```bash
npm init
npm install webpack webpack-cli webpack-dev-server --save-dev
npm install @babel/core @babel/preset-env babel-loader --save-dev
npm install copy-webpack-plugin --save-dev
npm install style-loader --save-dev
npm install sass-loader node-sass --save-dev
```

注意 `package.json` 中的 `scripts.dev` 这一项，配置好之后可以用 `npm run dev` 运行测试服务器

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Ganlv",
  "license": "MIT",
  "dependencies": {
    "vue": "^2.5.21"
  },
  "devDependencies": {
    "@babel/core": "^7.2.2",
    "@babel/preset-env": "^7.2.3",
    "babel-loader": "^8.0.5",
    "copy-webpack-plugin": "^4.6.0",
    "css-loader": "^2.1.0",
    "node-sass": "^4.11.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "vue-loader": "^15.4.2",
    "vue-template-compiler": "^2.5.21",
    "webpack": "^4.28.3",
    "webpack-cli": "^3.2.0",
    "webpack-dev-server": "^3.1.14"
  }
}
```

`webpack.config.js`

```js
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'public'
      }
    ])
  ]
};
```
