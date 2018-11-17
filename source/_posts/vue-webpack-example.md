---
title: A Simple Vue Project Build With Webpack
date: 2018-11-17 15:12:25
tags:
  - vue
  - webpack
  - npm
  - javascript
---

<!-- toc -->

## Create Project

```bash
mkdir vue-webpack-example
cd vue-webpack-example/
```

## Initialize Project

```bash
npm init
```

```plain
package name: (vue-webpack-example)
version: (1.0.0)
description: A Simple Vue Project Build With Webpack
entry point: (index.js) src/index.js
test command:
git repository: https://github.com/ganlvtech/vue-webpack-example
keywords: vue webpack example demo
author: Ganlv
license: (ISC) MIT
```

## Requirements

```bash
npm install vue --save
npm install webpack vue-template-compiler vue-loader --save-dev
```

## Files

* /
    * index.html
    * webpack.config.js
    * src/
        * index.js
        * App.vue
        * components/
            * MyComponent.vue

{% include_code index.html vue-webpack-example/index.html %}

{% include_code src/index.js vue-webpack-example/src/index.js %}

{% include_code src/App.vue vue-webpack-example/src/App.vue %}

{% include_code src/components/MyComponent.vue vue-webpack-example/src/components/MyComponent.vue %}

{% include_code webpack.config.js vue-webpack-example/webpack.config.js %}

## Webpack build

```bash
webpack
```

## Visit the website

```bash
npm install http-server -g
http-server
```

Visit <http://127.0.0.1:8080/>
