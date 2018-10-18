---
layout: post
date: 2018-09-06 02:10:43 +0800
title: 从零开始写一个 PHP 网站
subtitle: Build A PHP Site From Scratch
tags:
  - installation
  - tutorial
  - chrome
  - php
  - PATH
  - mariadb
  - composer
  - laravel
---

《年薪百万程序员教你两个小时写出淘宝网站》，你的首页推荐似乎已经不堪入目了。

我不是年薪百万的程序员，我也不能两个小时写出淘宝网站，我就是一个热爱互联网技术的热爱学习的业余程序员。虽然如此，但是这篇文章将带你从零开始写一个 PHP 网站。

这篇文章有点类似 `Hello, world!`，就是那种你只要照着我说的去做就行了，至于为什么这么做，做完之后你自己去慢慢理解。

<!-- toc -->

## 首先你需要有一台电脑

虽然说电脑现在已经很普遍了，但是如果你是用手机看这篇文章并且只有一部手机，那么我推荐你，为了您更好的编程体验，买一台电脑。

PHP 编程并不需要多么强大的电脑，3000 元人民币的笔记本电脑都可以完美胜任。

> 我推荐您选用自带 Windows 10 操作系统的电脑，这可能为您避免许多麻烦。

## 安装 Chrome

现在你用的是一台全新的电脑。

我推荐，开机之后你要装的第一个软件是 [Chrome 浏览器][chrome]，我使用 [Chrome 64-bit][chrome-64bit] 这个非官方网站下载离线安装包。

Chrome 是全自动安装，下载完安装包之后，双击运行即可。

> 安装位置是 `C:\Users\用户名\AppData\Local\Google\Chrome\Application`，这个目前并不重要。

## 安装 PHP

到 [PHP 官方网站][php] 下载最新版 PHP，因为我们使用的是 Windows，所以去 [PHP For Windows][php-windows] 下载，推荐使用最新版的 `VC15 x64 Non Thread Safe` 版本。

> 下载页面旁边的 "Which version do I choose?" 介绍了如何选择版本，如果您有兴趣可以看一看。

PHP 是免安装的，下载之后解压到某个文件夹即可使用。我是将 PHP 解压到了 `C:\Program1\php`。

> 如果你想知道原因的话，解释如下：
>
> 对于需要安装的程序，安装程序默认会安装到 `C:\Program Files`，那么对于免安装程序，我也统一放在一个位置，因为 `C:\Program Files` 这个文件夹是需要管理员权限访问的，所以我们使用这个文件夹将带来诸多不便，所以就另外建一个文件夹，最开始我使用的是 `C:\Program`，但是重启之后系统提示这样命名可能会存在问题，将其改成了 `C:\Program1`，我也就这样沿用下来了。

## 环境变量 PATH

之后可能经常要跟命令行打交道，设置 `PATH` 可以让你从任何位置轻松地访问 `php.exe`。

按 `Win + S` 打开 Cortana，输入 `环境变量`，即可找到 `编辑系统环境变量` 的选项。

> 这里的 `S` 表示 `Search`

选择 `环境变量`，在下方的 `系统变量`中找到`PATH`，双击这一行，弹出修改框，然后点击添加，在最后一行输入 `C:\Program1\php` 即可。

这时使用 `Win + R` 打开运行窗口，输入 `cmd` 回车。在弹出的命令行窗口中输入

```bash
php -v
```

成功显示版本号了，证明你可以从任何位置访问 `php` 了。

## To Be Continued

Images will comming soon.

## 安装 MariaDB 数据库

存数据总不能像大学计算机 C 语言课程上，都是操作文本文件吧，我们要用一个更牛逼的东西——数据库。

我用的是 [MariaDB][mariadb]，到 [下载页面][mariadb-download] 去下载一个最新版就行了。

## 安装 Composer

代码不能全是自己写，有现成的就用现成的，[Composer][composer] 可以自动帮我们下载 [Packagist][packagist] 上面现成的包。

到 [Composer 下载页面][composer-download] 中下载 `Composer-Setup.exe` 正常安装即可。

## 新建 Laravel 项目

php 网站可以全部由自己从头写起，不过开发效率太低，我使用 [Laravel][laravel] 这个框架。

使用框架，我们不用考虑如何操作数据库等等细节内容，我们只需要完成每个页面的逻辑过程就行了。

### 安装 Laravel Installer

```bash
composer global require "laravel/installer"
```

### 新建 Laravel 应用

```bash
laravel new myapp
```

然后进入这个文件夹。

## 写代码

要学习这个框架，可以参考 [Laravel 5.4 from scratch][laravel-tutorial-video] 视频教程。如果有任何问题，应该首先查找 [Laravel 说明文档][laravel-docs]。

### 配置文件

`.env` 文件

`config` 文件夹

### 启动开发服务器

我们需要一边写代码，一边看效果。Laravel 给我们提供了一个开发服务器，直接运行下面这条命令即可。

```bash
php artisan serve
```

### 后端代码

10 倍速快进（此处省略 3000 行代码）

### 前端代码

10 倍速快进（此处省略 3000 行代码）

## GitHub

写完的项目我们可以放到 GitHub 开放给其他人。

[chrome]: https://www.google.cn/chrome/
[chrome-64bit]: https://www.chrome64bit.com/
[php]: http://php.net/
[php-windows]: https://windows.php.net/download/
[mariadb]: https://mariadb.org/
[mariadb-download]: https://downloads.mariadb.org/
[composer]: https://getcomposer.org/
[packagist]: https://packagist.org/
[composer-download]: https://getcomposer.org/download/
[laravel]: https://laravel.com/
[laravel-tutorial-video]: https://laracasts.com/series/laravel-from-scratch-2017
[laravel-docs]: https://laravel.com/docs/
