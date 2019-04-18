---
title: 决斗之城 Android Auto.js 自动挂机
date: 2019-04-18 23:10:47
tags:
  - auto-js
  - game
  - hack
---

* 游戏名：《决斗之城》（国内仿照《游戏王》做的一款游戏）
* 包名： `com.leocool.yugioh.ay`

## 实现原理

看见下面这几个图片则自动点击。

![进入决斗](/images/2019-04-18-auto-js-yugioh/vs.png)
![开始匹配](/images/2019-04-18-auto-js-yugioh/start.png)
![自动出牌](/images/2019-04-18-auto-js-yugioh/auto.png)
![胜利计数](/images/2019-04-18-auto-js-yugioh/win.png)
![失败计数](/images/2019-04-18-auto-js-yugioh/lose.png)
![升级返回](/images/2019-04-18-auto-js-yugioh/back2.png)
![对局结束返回](/images/2019-04-18-auto-js-yugioh/back.png)
![掉线确定](/images/2019-04-18-auto-js-yugioh/ok.png)

## 脚本内容

{% include_code yugioh.js 2019-04-18-auto-js-yugioh/yugioh.js %}

## 功能

* 自动开始对局
* 切换成自动出牌模式
* 胜利与失败计数

## 注意事项

* 只能在 1080p （1920x1080） 的屏幕上运行。
* 只能在 Android 7.0 以上免 root 使用（较低版本的 Android 必须使用 root 权限打开）
* 自己使用时需要下载上述几个图片，并且修改脚本中的文件路径。

## 相关链接

* [Auto.js](https://github.com/hyb1996/Auto.js)
