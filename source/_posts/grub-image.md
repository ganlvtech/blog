---
layout: blog
title: grub-image
date: 2018-09-14 01:20:05
tags:
    - ubuntu
    - linux
    - grub
---

今天尝试安装了一下 Ubuntu 18.04.1，现在安装系统越来越简单了，用 Rufus 做一个 U 盘启动盘，然后就正常下一步就行了，Ubuntu 直接提供安装 Windows 和 Ubuntu 双系统的选项。

安装之后想利用 Grub2 引导器页面的背景图片功能装个逼，把笔记本电脑厂商 logo 之后、Windows 启动之前那段黑屏加一个打着自己 logo 的背景图片。研究明白之后还是很简单的，不过查的过程还是挺麻烦的。

## Add a grub background image

First, add grub background image support.

```bash
sudo apt install grub2-splashimages
```

Then, copy a image to `/boot/grub/`.

```bash
cp bg.png /boot/grub/
```

Now, you can use

```bash
sudo update-grub
```

to apply the change.

You can have a try now. And then, you will find that the 10 seconds timeout is really annoying.

## No timeout and no menu

Edit `/etc/default/grub`. Add or edit following settings.

```bash
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=1
```

I will also set `GRUB_DEFAULT` to `2`, so the highlight selected default boot choice will be the 3rd option, which means `Windows boot manager`.

```bash
GRUB_DEFAULT=2
```

It seems everything is ready, but grub do more things. Grub checks if you have multiple systems. If more than one system was found, grub will force `timeout_style` to be `menu`. This is not what we expected.

So open `/etc/grub.d/03_os-prober`, and remove the last line

```bash
adjust_timeout
```

Now, run `update-grub` and restart.

You can see the splash image and no menu is shown. Windows boot after a brief delay.

If you want to switch back to Ubuntu, you can press `Esc` during that 1 second timeout to get back the boot options menu, and select a different system to boot.

## More details

### Related files and functions

* `/boot/grub/grub.cfg`
* `/etc/default/grub`
* `/etc/grub.d/00_header` function `make_timeout()`
* `/etc/grub.d/03_os-prober` function `adjust_timeout()`

### Related links

* [Grub2 displays docs](https://help.ubuntu.com/community/Grub2/Displays)