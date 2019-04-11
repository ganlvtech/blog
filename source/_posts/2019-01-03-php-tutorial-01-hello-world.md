---
title: 'PHP Tutorial 01 - Hello, world!'
date: 2019-01-03 16:35:34
categories:
  - php-tutorial
tags:
  - php
  - tutorial
  - chrome
  - PATH
---

## 安装 Chrome

我推荐装完新系统之后第一时间安装 [Chrome 浏览器][chrome]。

> [Comment]
>
> 使用 Chrome 浏览器进行开发，可以为您避免许多麻烦，并且有很多优点。

> [Comment]
>
> 我使用 [Chrome 64-bit][chrome-64bit] 这个非官方网站下载离线安装包。（下载到的安装包是官方的，这个网站只是跳转到官方网站的链接，使用这个网站的原因只是因为官方不直接提供离线安装包的链接）

Chrome 是全自动安装的，下载完安装包之后，直接运行即可自动安装完成。

> [Comment]
>
> Chrome 默认安装位置是 `C:\Users\用户名\AppData\Local\Google\Chrome\Application`。

打开 Chrome 之后，安装操作说明将 Chrome 设置为默认浏览器。

## 安装 PHP

到 [PHP 官方网站][php] 下载最新版 PHP，因为我们使用的是 Windows，所以去 [PHP For Windows][php-windows] 下载，本地开发通常使用最新版的 `VC15 x64 Non Thread Safe` 版本。

> [Tips]
>
> 下载页面旁边的 "Which version do I choose?" 介绍了如何选择版本，如果您有兴趣可以看一看。

PHP 是免安装的，下载之后解压到某个文件夹即可使用。我是将 PHP 解压到了 `C:\Program1\php`。

> [Comment]
>
> 如果你想知道为什么我选择这个路径，解释如下：
>
> 对于需要安装的程序，安装程序默认会安装到 `C:\Program Files` 和 `C:\Program Files (x86)`，那么对于免安装程序，我也统一放在一个位置，因为 `C:\Program Files` 这个文件夹是需要管理员权限访问的，所以我们使用这个文件夹将带来诸多不便，所以就另外建一个文件夹，最开始我使用的是 `C:\Program`，但是重启之后系统提示这样命名可能会存在问题，将其改成了 `C:\Program1`，我也就这样沿用下来了。

### 环境变量 PATH

之后可能经常要跟命令行打交道，设置 `PATH` 可以让你从任何位置打开命令行即均轻松地访问 `php.exe`。

按 <kbd>Win</kbd> + <kbd>S</kbd> 打开 Cortana，输入 `环境变量`，即可找到 `编辑系统环境变量` 的选项。

选择 `环境变量`，在下方的 `系统变量`中找到`PATH`，双击这一行，弹出修改框，然后点击添加，在最后一行输入 `C:\Program1\php` 即可。

这时使用 <kbd>Win</kbd> + <kbd>R</kbd> 打开运行窗口，输入 `cmd` 回车。在弹出的命令行窗口中输入

```bash
php --version
```

成功显示版本号了，证明你可以从任何位置访问 `php` 了。

> [Tips]
>
> <kbd>Win</kbd> + <kbd>S</kbd> 中的 `S` 表示 `Search`。
>
> <kbd>Win</kbd> + <kbd>R</kbd> 中的 `R` 表示 `Run`。

### VCRUNTIME

> 由于找不到 `VCRUNTIME140.dll` 无法继续执行代码，重新安装程序可能会解决此问题。

到 [PHP For Windows][php-windows] 可以看到左侧有说明

> The VC15 builds require to have the Visual C++ Redistributable for Visual Studio 2017 [x64][vc-redist-x64] or x86 installed
>
> VC15 构建的程序需要您已安装 `Visual C++ Redistributable for Visual Studio 2017` [x64][vc-redist-x64] 或 x86。

点击链接，下载相应的版本，直接安装即可。

安装之后应该就可以正常执行 `php --version` 了。

## 安装 Notepad++

从 [Notepad++ 官方网站][notepad-plus-plus] 下载最新版的 Notepad++。通常使用最新版的 `Notepad++ Installer 64-bit x64` 即可。

正常安装即可。如果要不想使用英文界面，勾选上 `Localization` 即可安装中文界面。

> [Comment]
>
> 使用 Notepad++ 可以避免使用 Windows 自带的记事本的很多问题，最常见的问题就是某些情况下记事本会添加 BOM 头，而通常程序代码并不希望遇到 BOM 头。

## Hello World

> [Info]
>
> 首先需要“显示文件扩展名”
>
> 打开 `我的电脑` （即文件资源管理器），点击菜单里的 `查看`，勾选 `文件扩展名`。

> [Comment]
>
> `显示文件扩展名` 对开发有很多好处，最显而易见的好处就是，不会弄混相同文件名、不同扩展名的文件。
>
> 除了开发以外，还可以避免一些简单的病毒，例如某些病毒会把图标设置成文件夹的图形，如果你显示了扩展名，看到一个文件夹的扩展名是 `.exe`，就会发现异常了。

在桌面右键，新建，文本文档，会出现一个文件 `新建文本文档.txt`，重命名为 `index.php`。

右键使用 Notepad++ 打开

### 原样输出

直接写入

```php
Hello, world!
```

保存。

然后右键 Notepad++ 的文件选项卡，选择 `打开所在文件夹(命令行)`。

输入

```bash
php index.php
```

回车。

你可以看到文本文档内容原样输出出来了。

你的第一个 php 命令行程序已经完成了。

### echo 语句

为了体现区别，把内容改成

```php
<?php
echo 'Hello, world! 2';
```

> [Tips]
>
> 注意这里用的是单引号 `'`，键盘上 <kbd>L</kbd> 右边的第 2 个键 <kbd>'</kbd>。

回到命令行窗口，按 <kbd>↑</kbd> 键，可以看到上一条 `php index.php` 命令直接自动输入好了，然后回车。

可以看到 `echo` 语句的引号内的内容。

你的第一个包含 php 代码的 php 命令行程序已经完成了。

### PHP Development Server

同样为了体现区别，把内容改成

```php
<?php
echo 'Hello, world! 3';
```

回到命令行窗口，执行

```bash
php -S 127.0.0.1:8000
```

> [Tips]
>
> 注意：`S` 是大写的，其含义是 `Server`。

打开浏览器，访问 <http://127.0.0.1:8000/>。

现在你使用 php 开发的第一个网页应用也完成了。

[chrome]: https://www.google.cn/chrome/
[chrome-64bit]: https://www.chrome64bit.com/
[php]: http://php.net/
[php-windows]: https://windows.php.net/download/
[vc-redist-x64]: https://aka.ms/vs/15/release/VC_redist.x64.exe
[notepad-plus-plus]: https://notepad-plus-plus.org/
