---
title: 安装 Hexo
date: 2018-10-21 19:40:15
categories:
  - installation
tags:
  - hexo
  - node.js
  - npm
  - git
---

## 安装 Node.js

访问 [Node.js 官方网站][node-js]，下载最新版 Node.js 安装包。安装。

## 安装 Hexo

按照 [Hexo 官方网站][hexo] 首页的安装指示。

```bash
npm install hexo-cli -g
hexo init blog
cd blog
npm install
hexo server
```

上面的 5 行命令

1. 全局安装 `hexo-cli` 工具包
2. 创建一个文件夹 `blog`，里面包括 Hexo 的配置文件、博客的 Markdown 文件、主题的模板文件，以及 Hexo 用到的 node_modules
3. 进入这个文件夹
4. 安装 `package.json` 中的 node_modules
5. 运行本地服务器，查看一下结果，进入 <http://localhost:4000/> 即可查看博客的模样了。

## 写一篇文章

在 `blog` 文件夹下打开命令行，

> [Tips]
>
> Windows 中，在文件浏览器中，按住 Shift 点鼠标右键可以显示高级的功能菜单，里面有“在此处打开命令窗口”或“在此处打开 Powershell 窗口

执行

```bash
hexo new post this-is-a-blog-s-title
```

这样会新建一个 `source/_posts/this-is-a-blog.md`。

里面会有一些自带的元数据信息，格式如下。

```yaml
title: 这是一篇博客
date: 2018-10-21 19:40:15
tags:
  - hexo
  - node.js
  - npm
  - git
```

## 安装 Git

访问 [Git 网站][git-scm]，下载最新版 Git for Windows 安装包。安装。

## 发布到 GitHub Pages

在 GitHub 新建一个仓库，命名为你的 GitHub 用户名加上 `.github.io`（例如：`ganlvtech.github.io`）

然后在 `_config.yml` 中修改 `deploy` 的参数。

```yaml
deploy:
  type: git
  repo: git@github.com:ganlvtech/ganlvtech.github.io.git
  branch: master
```

[node-js]: https://nodejs.org/
[git-scm]: https://git-scm.com/
[hexo]: https://hexo.io/
