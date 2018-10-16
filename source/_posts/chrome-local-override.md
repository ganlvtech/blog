---
title: Chrome Local Override 本地文件替换
date: 2018-10-16 04:46:09
tags:
  - chrome
  - extension
  - devtools
  - frontend
  - production
  - redirect
  - gooreplacer
  - gfw
  - test
  - js
  - css
  - html
---

## 问题

1. 我们修改前端的时候，经常遇到一种情况。本地的测试服务器的数据并不是很充足，很多情况是线上的数据引发的问题，如果把线上的数据离线下来会很麻烦。

1. 比如，我帮别人改他的网站的 js、css，我并不能访问他的数据库。如果我想模拟线上环境，要么爬取数据，要么自己生成假数据。

1. 还有，如果我想改别人网站的 js 代码，想简单调试一下，最后再做一个插件。我并不想把他整个网站都离线下来，然后本地测试。我想做的只是改某一个文件。

1. 另外，比如 `ajax.googleapis.com` 被墙了，我想使用 `ajax.proxy.ustclug.org` 的镜像代替对应的文件。

## 解决方案

我大约两年前发现的 [gooreplacer][gooreplacer-homepage]。这个 Chrome 插件，这个插件自动把被墙的 GoogleApis 文件，通过 Chrome 提供的 `307 Internal Redirect`，在发送请求前直接重定向到新地址。然后访问 Stack Overflow 的时候就可以正常加载脚本了。

[gooreplacer GitHub repo][gooreplacer-github]

[gooreplacer Chrome Web Store][gooreplacer-chrome-store]

## Chrome Local Override

我大约从 Chrome 59 以来，就不止一次在 Bing、Google 搜索这个问题。直到几天前我找到了一篇 Stack Overflow 文章，[Override Javascript file in chrome][stackoverflow-answer]。

从 Chrome 65 以来 Chrome's DevTools 的 Source 页面多了一个 [Local Overrides][chrome-local-override] 选项卡。

## 其他 Chrome 插件

除了 gooreplacer，上面的 Stack Overflow 回答中还给出了 [Requestly][requestly-homepage]、[Resource Override][resource-override-github] 等诸多插件。我简单的看了一下他们。

[Requestly][requestly-chrome-store] 这个插件功能很全，能做的事情非常多，还可以改 User Agent 之类的。

[Resource Override][resource-override-chrome-store] 这个就很简洁，只能替换 URL，功能其实和 gooreplacer 差不多，只不过替换规则需要自己输入。

另外，安装这些插件之后，Chrome 有同类插件推荐。我才知道，应用商店中这种 URL Redirector 类型的插件这么多。

我没有详细对比过这些插件。因为功能差不多，我倾向于选择开源并且代码简洁，占用资源少的。

## 插件 v.s. DevTools

虽然插件是“即插即用”的，这样很方便，但是也有这些插件做不了的事情。那就是跨域。js、css 文件当然不会被 Same-origin policy 所拦截。但是 Ajax 可就不一样了，Ajax GET 的内容会被拦截。通过 Chrome DevTools 提供的 Local Override 功能简单方便快捷，对开发人员友好。

[gooreplacer-homepage]: https://liujiacai.net/gooreplacer/
[gooreplacer-github]: https://github.com/jiacai2050/gooreplacer
[gooreplacer-chrome-store]: https://chrome.google.com/webstore/detail/gooreplacer/jnlkjeecojckkigmchmfoigphmgkgbip
[stackoverflow-answer]: https://stackoverflow.com/questions/35580017/override-javascript-file-in-chrome/35580407#35580407
[chrome-local-override]: https://developers.google.com/web/updates/2018/01/devtools#overrides
[requestly-homepage]: https://www.requestly.in/
[requestly-chrome-store]: https://chrome.google.com/webstore/detail/requestly-redirect-url-mo/mdnleldcmiljblolnjhpnblkcekpdkpa
[resource-override-github]: https://github.com/kylepaulsen/ResourceOverride
[resource-override-chrome-store]: https://chrome.google.com/webstore/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii
