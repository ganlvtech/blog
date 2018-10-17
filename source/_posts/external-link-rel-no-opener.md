---
title: 使用 rel=noopener 打开外部链接
date: 2018-10-18 01:33:35
tags:
  - phishing
  - href
  - anchor
  - link
  - html
  - chrome
  - devtools
  - audit
  - noopener
---

## 问题引出

```html
<a href="/assets/external-link-rel-no-opener/malicious.html" target="_blank">在线演示</a>
```

这种链接的写法看似没有什么问题。

但是如果这个链接的目标地址并不是自己可控的呢？比如下面这个链接

<a href="/assets/external-link-rel-no-opener/malicious.html" target="_blank">在线演示</a>

我们预期的结果是，打开一个新的页面。但是实际的结果是，的确打开新的页面了，但是原来的页面被更改到另一个网址上了。

## 代码

模拟这个问题需要 3 个网页。

### index.html

在原来的论坛、贴吧、空间之类的，发一篇帖子，留下这样一个外部链接。

```html
<h1>正常页面</h1>
<a href="/malicious.html" target="_blank">恶意外部链接</h1>
```

需要这里面的链接地址改成自己的页面的绝对地址。

### malicious.html

这个页面利用 `opener` 指向原来网页的 `window` 问题，将原来的网页变成了钓鱼页面，用户不注意的话就上钩了。

```html
<h1>一个看似没有威胁的页面</h1>
<script>
    if (window.opener) {
        opener.location = '/index.html';
    }
</script>
```

### phishing.html

这个就是一个钓鱼页面，或者是点击劫持页面。没有什么特殊之处。

```html
<h1>钓鱼页面</h1>
<form>
    <p><label for="username">用户名：</label><input type="text" id="username" name="username"></p>
    <p><label for="password">密码：</label><input type="password" id="password" name="password"></p>
    <p><input type="submit" id="submit" name="提交"></p>
</form>
```

## 说明

虽然 `opener.document` 会受跨域限制，`opener.location` 也同样因为跨域不可以读取，不存在数据泄露的问题，但是 `opener.location` 是可写的，也就存在钓鱼的可能。

## 解决

```html
<a href="/assets/external-link-rel-no-opener/malicious.html" target="_blank" rel="noopener noreferrer">rel noopener noreferrer 的链接</a>
```

<a href="/assets/external-link-rel-no-opener/malicious.html" target="_blank" rel="noopener noreferrer">rel noopener noreferrer 的链接</a>

就是在 a 标签增加了一个 `rel="noopener noreferrer"` 属性，`noreferrer` 是为了兼容旧版浏览器，新版浏览器两种应该都支持。

## 参考链接

* [About rel=noopener What problems does it solve?][rel-noopener-problem-mathiasbynens]
* [网站应该使用 rel="noopener" 打开外部锚][chrome-devtools-audit-noopener]
* [DiscuzX 测试，吾爱破解钓鱼页面][52pojie-phishing]

[rel-noopener-problem-mathiasbynens]: https://mathiasbynens.github.io/rel-noopener/
[chrome-devtools-audit-noopener]: https://developers.google.com/web/tools/lighthouse/audits/noopener
[52pojie-phishing]: https://github.com/ganlvtech/52pojie-phishing/
