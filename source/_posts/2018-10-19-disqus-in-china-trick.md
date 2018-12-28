---
title: 在国内使用 Disqus 的小技巧
date: 2018-10-19 03:30:34
tags:
  - disqus
  - gfw
  - comment
  - hexo
  - js
  - hosts
comments: true
---

[Disqus][disqus] 是一个的评论社区。它可以通过 iframe 提供嵌入式的评论区。可以用于静态网页。

**但是在中国会被墙。**

## 问题引出

`disqus.com` 似乎并没有被墙，只有 `*.disqus.com` 被墙了。

恰巧 Disqus 的评论数据是从 `disqus.com` 获取的。

也就是说，通过一点小技巧就可以不翻墙用 Disqus。

## 解决方法

Disqus 默认使用一个 `script` 标签来获取数据

```html
<script src="//ganlvtech.disqus.com/embed.js">
```

其实如果阅读代码后可以发现，这个 `embed.js` 并不会变化。他只是用来搜索所有 `script` 标签的 `src` 属性，匹配出类似 `ganlvtech` 的 shortname。然后利用这个 shortname 来获取评论数据。

又恰巧，disqus有一个没有被墙的 CDN `c.disquscdn.com`。

那么我们把上面的代码改成

```html
<script>
    var disqus_shortname = "ganlvtech";
</script>
<script src="//c.disquscdn.com/embed.js">
```

此外还必须添加几条 hosts

```plain
151.101.0.134 disqus.com
104.16.80.166 c.disquscdn.com
151.101.26.49 a.disquscdn.com
```

然后就可以不翻墙使用了。

效果并不是不太好，仅仅只是能用。

## Hexo

Hexo 默认主题 `landscape` 是支持 Disqus 的，简单地配置一下。

在 `_config.yml` 第一级添加

```yaml
disqus_shortname: ganlvtech
```

在需要打开评论的文章前面的元数据中加上

```yaml
comments: true
```

在 `themes\landscape\layout\_partial\after-footer.ejs` 中把

```js
dsq.src = '//' + disqus_shortname + '.disqus.com/<% if (page.comments) { %>embed.js<% } else { %>count.js<% } %>';
```

改成

```js
dsq.src = '//c.disquscdn.com/<% if (page.comments) { %>embed.js<% } else { %>count.js<% } %>';
```

[disqus]: https://disqus.com/

## TODO

`count.js` 应该也需要改一下，否则仍然无法使用。因为它依然需要从 `ganlvtech.disqus.com` 加载脚本。
