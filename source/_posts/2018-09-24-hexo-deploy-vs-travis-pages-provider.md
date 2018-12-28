---
title: hexo deploy v.s. Travis Pages provider
date: 2018-09-24 21:54:53
tags:
  - hexo
  - node.js
  - npm
  - travis
  - ci
  - github
  - pages
---

之前用的是 Hexo 自带的 `hexo deploy` 来部署 GitHub Pages，这个配置文件显得很不美观。

```yaml
before_script:
  - npm install -g hexo-cli
  - git config --global user.name "Ganlv"
  - git config --global user.email "nospam@example.com"
  - sed -i "s/git@github.com:/https:\/\/${__GITHUB_TOKEN__}@github.com\//" _config.yml
  - git clone -b master https://github.com/ganlvtech/ganlvtech.github.io.git .deploy_git

script:
  - hexo deploy
```

通过 `sed` 来修改 `_config.yml` 的内容，把环境变量 `__GITHUB_TOKEN__` 嵌入到 git 仓库的地址当中，然后手动把仓库克隆下来保留提交历史。

而且也不知道是不是因为使用了 `nospam` 的邮箱，GitHub 无法识别我这个提交的来源用户，就将提交者的视为陌生人了。

![hexo deploy travis pages provider different committers](/images/2018-09-24-hexo-deploy-vs-travis-pages-provider/different-committers.jpg)

于是，我就想，hexo 只负责生成静态页面，部署到 GitHub Pages 使用 Travis CI 的 Pages Provider，这样提交者会显示成 `travisbot`，一目了然，知道这个是自动提交的。而且配置文件似乎更简洁。

```yaml
before_script:
  - npm install -g hexo-cli

script:
  - hexo generate

deploy:
  provider: pages
  skip-cleanup: true
  keep-history: true
  github-token: $GITHUB_TOKEN
  local-dir: public
  target-branch: master
  on:
    branch: dev
```

在执行生成脚本之前只是全局安装 `hexo-cli`，然后执行 `hexo generate` 生成静态页面，然后利用 Travis CI 自动部署就完事儿啦，轻而易举，多么简洁。

后来我又发现好像并不用 `npm install -g hexo-cli`，原来这样写有点多余。

```yaml
before_script:
  - npm install -g hexo-cli

script:
  - hexo generate
```

因为 `npm install` 的时候，安装的 `hexo` 包自带了 `hexo-cli`。

把 `before_script` 删掉，`script` 改成下面这样。

```yaml
script:
  - ./node_modules/hexo/bin/hexo generate
```
