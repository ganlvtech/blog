---
title: 捉住小猫游戏
date: 2019-01-30 22:55:14
tags:
  - phaser
  - game
  - js
  - html
---

<div id="phaser-catch-the-cat"></div>
<button id="phaser-catch-the-cat-load-button">点击加载游戏</button>
<script>
  document.getElementById('phaser-catch-the-cat-load-button').addEventListener('click', function () {
    document.getElementById('phaser-catch-the-cat').innerHTML = '<iframe width="100%" height="600" src="/assets/2019-01-30-phaser-catch-the-cat/index.html"></iframe>';
    this.remove();
  });
</script>

> [Tips]
>
> 游戏引擎 813 KiB (219 KiB gziped)，游戏 76 KiB (15 KiB gziped)

游戏的思路和小猫的图片来源于 [www.gamedesign.jp](https://www.gamedesign.jp/flash/chatnoir/chatnoir.html)，原来的游戏名叫 Chat Noir。

我尝试使用 [Phaser 3](https://phaser.io/) 游戏引擎，用 JavaScript 仿了一遍，体验一下 HTML 5 小游戏的开发流程。

## 游戏玩法

* 点击小圆点，围住小猫。
* 你点击一次，小猫走一次。
* 直到你把小猫围住（赢），或者小猫走到边界并逃跑（输）。

注意：并不一定每一局你都有可能获胜，能否获胜与开始生成的地形有关，有的地形可能根本没有赢的可能性。

## 其他玩法

你还可以自己编写小猫的算法，来让小猫的判断能力变得更强。

自带的算法是挑选距离边缘最近的路。玩几把你就会发现小猫的规律，然后骗自带算法小猫掉入你的陷阱。

## 技术特色

Phaser 3 本身不支持在代码中内联 SVG 图片代码，所有的图片资源必须通过 XHR 在线获取，所以我使用 [FakeXMLHttpRequest](https://github.com/pretenderjs/FakeXMLHttpRequest)，自己实现了一个 SVG 的 Loader，这样就可以把 SVG 图片通过 [webpack](https://webpack.js.org/) 的 [raw-loader](https://webpack.js.org/loaders/raw-loader/) 直接内联到 JavaScript 中，相当于把图片打包在 js 中了，便于分发。

## 附录

[在线游戏链接](/assets/2019-01-30-phaser-catch-the-cat/index.html)
