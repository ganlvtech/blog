---
title: Jekyll v.s. Hexo
date: 2018-09-10 21:51:47
tags:
  - jekyll
  - hexo
  - comparison
  - ruby
  - gem
  - node.js
  - npm
  - travis
  - ci
  - github
  - pages
---

最近我想用 [GitHub Pages][github-pages] 搭建一个静态博客。最先想到的肯定是 [Jekyll][jekyll] 了，因为这个东西是 GitHub 官方支持的。

通常来说，被 GitHub 所看中的项目，应该是非常不错的，不过用了之后才会发现一些问题。

这篇文章既包括正常的安装步骤，也包括一些吐槽，从中能发现对两者的一些看法。最后，我选择了使用 [Hexo][hexo]。

<!-- toc -->

## Jekyll

那么我们按照官网的指示来一步一步操作。

### 快速开始 Quickstart

1. 安装一个完全的 [Ruby 开发环境][ruby-installation]

2. 安装 `Jekyll` 和 `bundler` 的 gem 包

    ```bash
    gem install jekyll bundler
    ```

3. 在 `./myblog` 创建一个新的 Jekyll 网站

    ```bash
    jekyll new myblog
    ```

4. 进入新的文件夹中

    ```bash
    cd myblog
    ```

5. 构建网站，使他可以在本地服务器访问

    ```bash
    bundle exec jekyll serve
    ```

6. 现在可以访问 <http://localhost:4000> 了

### 实际上我的安装过程

我是有 Web 开发基础的，安装软件和通过命令行执行命令都是小事，看上去安装过程很方便，那么我们开始吧。

我在安装软件的时候不喜欢选择经典（Typical）或者完全（Full）通常我会选择自定义（Custom），这样我可以看到他到底做了什么，所以我没有安装快速开始的过程直接安装，而是继续往下看开始章节（GETTING STARTED）中的其他介绍。

Ruby 入门（Ruby 101）这个我就不看了，毕竟我以不打算学 Ruby，我只需要知道怎么操作就行了。

我来看看安装（Installation）的内容。

> Jekyll 是一个可以安装在绝大多数系统的 Ruby Gem 包。

要求：Ruby、RubyGems、GCC 和 Make。

* Ruby 和 RubyGems 这两个肯定没有问题，这个肯定是官方支持的。
* GCC 是用来干什么的？不过没什么问题，大学里学过 C 语言，电脑里还留着呢（Dev-C++ 的 TDM-GCC 用着还不错）。
* **为什么还要用到 Make 这种东西？在 Windows 下装 Make 感觉很麻烦啊！**

暂时先不管，先继续往下看。下面我要看 Windows 下的安装说明。

> 虽然 Windows 不是官方支持的平台，但可以通过适当的调整来运行Jekyll。此页面旨在收集 Windows 用户已发现的一些常识和经验教训。

看到 **不是官方支持** 就感觉有些不想用这个，某些服务器软件官方不支持 Windows，这个我不会评论什么，但是给客户用的，为的是帮助用户解决日常写博客问题的软件，不官方支持 Windows 就有点令人反感了。

自己开的坑，至少研究明白再弃坑，我弄成功之后肯定要换个解决方案。

> 运行 Jekyll 最简单的方法就是使用 [RubyInstaller][ruby-installer] for Windows

**用 Installer 来安装其实挺方便的** ，就不用自己配置 PATH 之类的，安装过程基本不会出现什么问题。

不过看到 `Ruby+Devkit` 版本，我就有点不高兴了。 **我要运行一个 Ruby 的软件，为什么还要安装 Devkit** 。难道不是像 Java 一样分为 JRE 和 JDK，如果只是运行 jar 只用 JRE 就够了？

那就先下载吧 [rubyinstaller-devkit-2.4.4-2-x64.exe][rubyinstaller-devkit-download]。竟然要 115 MB，这什么鬼东西啊！Node.js 才 20MB，php 30MB，Chrome 也就 50MB， **我为什么要为了写个博客装一个 115 MB 的东西** 。

然后就安装吧，一路默认选项，反正我已经准备好卸载了。

然后运行

```bash
gem install jekyll bundler
```

然后经过漫长的等待，终于安装好了，国内网还是有点慢的。

```bash
jekyll new myblog
```

然后

```bash
cd myblog
jekyll serve
```

访问 <http://localhost:4000>，终于成功访问了。

### GitHub Pages

GitHub 本身支持 Jekyll，可以自动编译 Jekyll 静态博客，直接按默认的 `.gitignore` Commit、Push 就行，部署起来应该不麻烦。

我新建了一个名为 `ganlvtech.github.io` 的仓库，然后

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:ganlvtech/ganlvtech.github.io.git
git push origin master
```

就行了。

其实我用的是 Git GUI

```bash
git init
git gui
```

然后就可以到 [仓库设置][repo-settings] 中启用 GitHub Pages，

然后问题就来了，静态页面的 CSS 文件加载不出来，不知道为什么。

我怀疑可能是 GitHub 不支持 minima 这个主题，我尝试修改设置里的“主题”选项，改了之后也没用。

经过一番 Bing 搜索，我找到了 [About GitHub Pages and Jekyll][about-github-pages-and-jekyll]

> We recommend using Jekyll if you want the built-in support it offers, including the [GitHub Pages gem][github-pages-gem] to manage dependencies, specific build failure messages, and more specific help with troubleshooting.

我就打开 [GitHub Pages gem][github-pages-gem] 这个链接看了一下，也没太看明白

我在 `Gemfile` 最后添加了一行

```Gemfile
gem 'github-pages', group: :jekyll_plugins
```

然后 Commit、Push，果然可以正常访问 <https://ganlvtech.github.io/> 了。

### 主题

GitHub 官方支持的主题实在不符合我的审美要求，我在 GitHub 全仓库搜索 `jekyll` 按 Star 排序挨个看，终于找到一个我感觉很舒服的主题，[H2O][jekyll-theme-H2O]。

浏览过程中我发现，Jekyll 主题的下载方法竟然不是通过包管理器下载，而是手动克隆仓库，相当于把模板和 CSS 文件下载下来。

感觉这种方法有些过时，不过也没有问题，因为自己的博客要有个性化，改 CSS 应该是很常见的问题。

我下载了这个主题，感觉还不错，准备先写篇博客，然后再把主题部署上去吧，要不这个主题可能会显得光秃秃的。

### 新建文章

```bash
jekyll help
```

哇！ **Jekyll 竟然没有自动新建文章的功能** 。

Bing 一下 `jekyll new post`，结果真的没有，这个根本就不人性化，难道每次我新建文章都得自己输入日期，自己把文件前面的描述复制过来。

> 自己选的 Jekyll，死也要把这个东西弄完。

### Gem 包版本冲突

本来以为问题都解决了，我也没怎么多想，我就用 [vscode][vscode] 写了一篇博客，vscode 自带的感觉还不错。想在 Push 之前看看效果，运行

```bash
jekyll serve --watch
```

然后就提示问题了

```plain
Bundler could not find compatible versions for gem "jekyll": (Bundler::VersionConflict)
  In Gemfile:
    jekyll (~> 3.8.3) x64-mingw32

    github-pages x64-mingw32 was resolved to 191, which depends on
      jekyll (= 3.7.3) x64-mingw32
```

`github-pages` 这个 Gem 包竟然是要求版本完全相等，都不能向以后版本兼容。我都想骂人了，那种“有最新版，然而我不能用”的感觉感觉很不爽，而且还是因为一个对我本地运行无作用的包。

### 最终

我想想就到这里吧，我要去寻找替代品了。

## 同类产品

搜索一下 `Jekyll Alternatives`，WordPress 肯定是最多的啦，当然我们要的是静态博客，还有 [Hugo][hugo] 和 [Hexo][hexo]，对比一下：

* GitHub 上 Star 数差不多
* Hexo 有中文文档，很多贡献者都是中国人
* Hexo 之前我听说过
* Hugo 有已编译版本，不需要下载 Go 的环境
* 我对 Node.js npm 比较熟悉

由于我对 javascript 还是比较了解的，我想了解一下 Hexo 代码的结构，学习一下其他人代码的写法，所以我选择了 Hexo。

## Hexo

### 安装

安装 Hexo 相当简单。然而在安装前，您必须检查电脑中是否已安装下列应用程序：

* [Node.js][node-js]
* [Git][git]

如果您的电脑中已经安装上述必备程序，那么恭喜您！接下来只需要使用 npm 即可完成 Hexo 的安装。

``` bash
$ npm install -g hexo-cli
```

### 实际安装过程

完全没有任何问题。

访问 [Node.js 官方网站][node-js]，直接点击下载最新版的按钮就行。然后安装时一路确定就行了。

（既然都用 GitHub Pages 了，不可能没装 Git 吧。访问 [Git 官方网站][git]，下载最新版，安装时同样一路确定。）

执行

``` bash
npm install -g hexo-cli
```

在中国，如果直接用 npm 的话，下载速度可能有点慢，在执行 `npm install` 之前改一下 npm 设置就行了。

```bash
npm config set registry https://registry.npm.taobao.org -g
```

然后再

```bash
hexo init myblog
cd myblog
hexo server
```

访问 <http://localhost:4000>，我已经看到了成果。

### 写文章

```bash
hexo new post "New Blog"
```

多么舒服的操作啊。

在 `_config.yml` 中可以设置默认的文件名格式，可以手动设置成像 Jekyll 那种带日期的文件名。

### GitHub Pages

这个可能是最麻烦的了，因为 GitHub Pages 默认只支持 Jekyll，所以我们必须本地编译成静态网站，然后再用 git 上传到 GitHub。

但是，Hexo 自带 deploy 功能。

先安装 git deployer

```bash
npm install hexo-deployer-git --save
```

然后设置一下 `_config.yml`

```yaml
deploy:
  type: git
  repo: git@github.com:ganlvtech/ganlvtech.github.io.git
  branch: master
```

最后执行

```bash
hexo deploy
```

完美！

## 自动构建

那么，我怎么像 Jekyll 那样，上传 Markdown 自动编译成 HTML 呢？

[Travis CI][travis-ci] - Test and Deploy with Confidence

这是一个专门面向 GitHub 的持续集成的工具，可以干很多复杂的东西，部署一个博客简直太简单了。

### 操作过程

首先，登录这个网站，直接通过 GitHub 的 OAuth 登录就行了。

然后，在设置中找到这个网站，激活这个网站的持续集成。

接下来，新建一个 `.travis.yml` 然后填入以下内容

```yaml
language: node_js
node_js:
  - "node"

branches:
  only:
    - dev

before_script:
  - npm install -g hexo-cli
  - git config --global user.name "Ganlv"
  - git config --global user.email "nospam@example.com"
  - sed -i "s/git@github.com:/https:\/\/${__GITHUB_TOKEN__}@github.com\//" _config.yml
  - git clone -b master https://github.com/ganlvtech/ganlvtech.github.io.git .deploy_git

script:
  - hexo deploy
```

注意，这里需要去 GitHub / Settings / Developer / [Personal access tokens][personal-access-token] 去新建一个拥有 `public_repo` 权限的 `token`。然后在 Travis CI 中这个项目的设置中添加一条 `__GITHUB_TOKEN__` 的环境变量。

最后把原始的代码 push 到 dev 分支就可以了。

```bash
git init
git branch -m master dev
git add .
git commit -m "Use Travis-CI"
git remote add origin git@github.com:ganlvtech/ganlvtech.github.io.git
git push origin dev
```

Travis 会根据设置自动为我们构建项目，并且推送到 master 分支。

### 改进的自动部署

参考另一篇文章 [hexo deploy v.s. Travis Pages provider][hexo-deploy-vs-travis-pages-provider]

[github-pages]: https://pages.github.com/
[jekyll]: https://jekyllrb.com/
[hexo]: https://hexo.io/
[ruby-installation]: https://jekyllrb.com/docs/installation/
[ruby-installer]: https://rubyinstaller.org/
[rubyinstaller-devkit-download]: https://github.com/oneclick/rubyinstaller2/releases/download/rubyinstaller-2.4.4-2/rubyinstaller-devkit-2.4.4-2-x64.exe
[repo-settings]: https://github.com/ganlvtech/ganlvtech.github.io/settings
[about-github-pages-and-jekyll]: https://help.github.com/articles/about-github-pages-and-jekyll/#jekyll-site-examples
[github-pages-gem]: https://github.com/github/pages-gem
[jekyll-theme-H2O]: https://github.com/kaeyleo/jekyll-theme-H2O
[vscode]: https://code.visualstudio.com/
[hugo]: https://github.com/gohugoio/hugo
[node-js]: https://nodejs.org/zh-cn/
[git]: https://git-scm.com/
[travis-ci]: https://travis-ci.org/
[personal-access-token]: https://github.com/settings/tokens
[hexo-deploy-vs-travis-pages-provider]: /2018/09/24/hexo-deploy-vs-travis-pages-provider/