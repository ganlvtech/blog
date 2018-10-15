---
title: Chrome Local Override 本地文件替换
date: 2018-10-16 04:46:09
tags:
  - chrome
  - devtools
  - frontend
  - production
  - resource-override
  - gooreplacer
  - gfw
  - test
  - js
  - css
  - html
---

我们修改前端的时候，经常遇到一种情况。本地的测试服务器的数据并不是很充足，很多情况是线上的数据引发的问题，如果把线上的数据离线下来会很麻烦。

具体一点，比如我帮别人改他的网站的 js、css，我并不能访问他的数据库。如果我想模拟线上环境，我要么爬取数据，要么自己伪造数据。

还有，如果我想改别人网站的 js 代码，想简单调试一下，最后再做一个插件。我并不想把他整个网站都离线下来，然后本地测试。我想做的只是改某一个文件。

另外，比如 ajax.googleapis.com 被墙了，我想使用 ajax.proxy.ustclug.org 的镜像代替对应的文件。

[stackoverflow-answer]: https://stackoverflow.com/questions/35580017/override-javascript-file-in-chrome/35580407#35580407
[gooreplacer]: https://liujiacai.net/gooreplacer/
[gooreplacer-github]: https://github.com/jiacai2050/gooreplacer
[resource-override-github]: https://github.com/kylepaulsen/ResourceOverride
