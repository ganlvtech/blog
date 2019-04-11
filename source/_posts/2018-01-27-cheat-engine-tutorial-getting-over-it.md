---
title: CE 实例教程 Getting Over It
date: 2018-01-27 11:40:13
categories:
  - cheat-engine-tutorial
tags:
  - cheatengine
  - tutorial
  - disassemble
  - game
  - hack
---

<!-- toc -->

## 注意事项

### 学习基础

本篇默认您有 CE 基础，可以将 CE 自带的 Tutorial 轻松破解，文中有很多东西都是用破解 Tutorial 的操作来说明的。

### CE 版本问题

我用的是目前的最新版 `Cheat Engine 6.7`

### CE 语言问题

我使用的是英文版，表示某按钮或某菜单的时候我会用英文，说明其用途的时候我会用中文。

> [Comment]
>
> 我个人不反感汉化版，但也不反感英文原版。有的地方英文原文的语法含义是很微妙的，中文不一定能翻译出原文的意义。我学习老外的软件都是直接读英文文档的，英文文档虽然看起来有些费劲，但是某些软件英文文档比中文的要多得多，这对于软件理解（以及对于英语的学习），等等都是有很大帮助的。

## 涉及内容

### 涉及 CE 技巧

* 查找数值、查找未知数值，以及相关技巧
* 指针查找的技巧
* 代码注入
* 调试技巧
* 游戏变速
* Cheat Table 的一些功能
* Lua 脚本的使用
* 使用 Trainer 生成 exe 文件

教程中会夹杂大量的 CE 使用技巧以及一些破解的常识，这些技巧和常识的作用可能比使用 CE 的熟练度更大（就像电子竞技中的意识与操作一样）。

### 使用什么游戏？

《和班尼特福迪一起攻克难关》（掘地求升）

最近很火的游戏，Unity引擎，游戏引擎大了之后，会搜索到很多没有用的数值，这些数值都是中间量，直接改是没有用的，必须找到他们最初始的计算来源，这样才能达到破解的目的。

关于游戏版本的问题，这里讲的是通用的搜索方法，即使游戏版本不一样，搜索过程也应该是相似的，修改方法也应该是相似的，不一样的应该只有基址。

> [Comment]
>
> 你们看到的，教程里写的，都是我真实经历过的，但这不代表我仅仅经历了这些，实际付出的心血至少是描述出来的好几倍。教程里只写了尝试成功了的部分，尝试失败了的话只有继续尝试。

### 我们要做什么形式的外挂？

1. 游戏的目的是一直往上爬嘛，要是能把 Y 坐标改到足够高就可以了嘛。
2. 能不能把游戏的重力改小一点，就像最后通关时可以飘着。
3. 爬雪山的时候太滑了，能不能把雪山的摩擦改大一点。
4. 我想随意飞行！
5. 能不能加个存档功能？虽然我不太想开挂，但是总掉下去很烦啊！

我目前只研究出来了第一个，而且还不是很完善。

> 外挂是 1% 的灵感加上 99% 的汗水。

我能想到的辅助方法有这些，你们有什么想法可以自己尝试。

## 研究过程

### 搜索坐标

首先，我们猜测，储存坐标数值的是 Float 类型，且 X 轴正方向向右，Y 轴正方向向上。

> [Tips]
>
> 为什么这么猜测？
>
> 没有为什么，因为我是试出来的←_←（开玩笑的，即使是试出来的，也得知道从哪个开始试嘛）
>
> 为什么是 Float 类型？
>
> 首先，大家要对浮点数有一些基本的了解，计算机中的浮点数使用 IEEE754 标准，Float 大约有 7 位有效数字，Double 大约有 15 位有效数字。
>
> 然后，想象自己是开发这个游戏的程序员，我这个游戏是否需要 15 位的精度，7 位精度的 Float 类型够不够用。
> 如果我使用了 Double 类型，那么这个游戏将比使用 Float 类型要慢，要更耗费资源。
> 综上所述，我选择把 Float 和 Double 都试一下，先试 Float，然后就发现蒙对了。
>
> 然后是坐标轴方向。
>
> 数学中坐标系分为左手系和右手系两种，数学中常用的右手系，而计算机屏幕则通常使用左手系。计算机屏幕的原点（`(0, 0)` 点）在左上角，往右是 X 轴正方向，往下是 Y 轴正方向。
>
> 计算机中涉及跟图像有关的，一般都用左手系，而涉及跟物理有关的通常都用右手系。比如安卓编程，绘图的 API 都是以左上角为原点，往右是 X 轴正方向，往下是 Y 轴正方向，而和传感器有关的，都是手机屏幕以正常方向朝向自己时，往右是 X 轴正方向，往上是 Y 轴正方向。
>
> [![两种坐标系](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/two-coordinate-systems.png)](https://msdn.microsoft.com/dynimg/IC412518.png)
>
> [图片引用页](https://msdn.microsoft.com/en-us/library/windows/desktop/bb204853.aspx)
>
> [![Windows 窗口坐标系](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/graphics-window-coordinates.png)](http://i.msdn.microsoft.com/hh144802.CH05_Img01.png)
>
> [图片引用页](https://social.technet.microsoft.com/wiki/contents/articles/16391.the-developers-reference-guide-to-small-basic-chapter-5-graphicswindow-object.aspx)
>
> [![安卓传感器坐标系](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/android-sensor-axis-device.png)](http://developer.android.google.cn/images/axis_device.png)
>
> [图片引用页](http://developer.android.google.cn/guide/topics/sensors/sensors_overview.html)
>
> 综上所述，我在装逼。
>
> 其实，我没有去纠结 Y 轴正方向的问题，反正 X 轴都是向右为正方向，我就先找出 X 轴的位置，然后 Y 坐标一般都是 X 坐标偏移 4 字节嘛。
>
> 好的，装逼结束。
>
> 那我们为什么要知道坐标轴的正方向？
>
> 因为，我们不知道任何与坐标有关的信息，包括我现在在哪，移动多远是 1 单位长度。如果不确定正方向的话，我们只能使用 `Changed value` 和 `Unchanged value` 两种搜索类型。如果确定了坐标轴正向之后，就可以使用 `Increased value` 和 `Decreased value` 了，更方便找到准确的数值以及派出错误的数值。

好的开始搜索。

使用 `Scan Type: Unknown initial value`、`Value Type: Float` 方式进行 `First scan`。

然后回到游戏，往右挪几锤子，尽量挪远一点，避免因为变化太小，导致 CE 忽略了变化量。再用 CE 搜索 `Increased value`。

然后就重复上述过程。秘计——“反复横挑”。往左挪，搜索 `Decreased value`，往右挪，搜索 `Increased value`。

> [Tips]
>
> 这里有个技巧，可以给“搜索 `Increased value`”、“搜索 `Decreased value`”设置快捷键，避免总在游戏和 CE 之间来回切换。
>
> ![设置搜索快捷键](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/search-hotkey.jpg)
>
> 另外，Getting Over It 支持窗口化模式，可以方便在玩游戏的同时，监视 CE 的数值。
>
> ![Getting Over It 窗口化设置](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/window-mode-configuration.jpg)
>

经过了数十轮的查询，我这里还剩下 96 个数值。这就是当今的游戏引擎，实在烦人，弄出这一堆没用的中间变量，改了也没用，还得自己手动筛选。

![经过了数十轮查询的搜索结果](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/01.jpg)

> [Comment]
>
> 如果你研究《侠盗猎车手：罪恶都市》的时候才不会出现这么多数值呢。越现代的引擎，约有这个问题，随便打开一个游戏都占几百 MB 的内存，一大堆中间数值。还有建模越来越精细，顶点越来越多了，一个物体的每个顶点都坐标都要存在内存中，坐标数值都相近。结果就是，一搜索一大堆数值，剩下的都是同一个物品，靠筛选是去除不掉的。

还剩下 96 个，不算特别多，本来以为会剩下好几千个呢。96 个的话可以直接全部添加到下方的列表中，然后全部锁定，看看有没有效果。

![全部添加到下方的列表中，然后全部锁定](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/02.jpg)

好的，有效果，不过不是我们想要的效果。我的搜索结果似乎出了一些问题。锁定之后，我的鼠标动了之后会回弹，相机位置会回弹，但是罐子和人并不会回弹。

这时，我们有两条路可以走，一是先把这些研究完，二是重新来过（不过可能得到的是相同的结果）。

我选择第一条路，先把鼠标位置的内存和相机位置的内存找到，然后在研究人和罐子的事。

### 从少量搜索结果中筛选

96 个内存地址，一般来说只有一个是相机的 X 坐标，只有一个是鼠标的 X 坐标。我们怎么找到这两个坐标呢？

方法一：穷举法，96个每个都锁定一下，然后就知道是哪个了（算法时间复杂度 `O(1)`，平均时间 `N / 2` ）。

方法二：

* 小时候的智力题，9个球有1个比较重，用天平称两次把它找出来。
* 高中数学学过什么？二分法求零点。
* 大学计算机基础学过什么？快速排序法。基数排序法。二叉树。

所以你想到了什么？这是一种思想，叫做“分治”。

只锁定前一半，如果鼠标位置被锁定了，则证明控制鼠标位置的在前一半里，然后再锁定前四分之一，如果鼠标可以移动了，那么证明在 `1/4 ~ 2/4` 的位置之中，依次类推，最后找到鼠标位置的地址。（算法时间复杂度 `O(nlogn)`，平均时间 `log2(N)` ）。

![找到结果，复制粘贴，往后调整 4，得到 Y 坐标地址](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/03.jpg)

然后使用 `Ctrl + C` 和 `Ctrl + V` 复制一个地址，并把地址偏移设置为 `4`，因为 `Float` 类型占 4 字节，所以下一个浮点型就在 `4` 字节以后。

同理找相机坐标。

![游戏崩溃](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/04.jpg)

游戏崩溃了，你们可以想象一下我的表情，就像那个暴漫 WTF 的脸 -_-! 没办法，我们下次小心点吧。正好我们想重新搜索一下呢。

### 从大量搜索结果中筛选

![搜索剩余大量相近结果](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/05.jpg)

经过我们的“反复横跳”，还剩大约五千个数值（我就说不能只有 96 个嘛，不符合现代引擎的风格），如果继续“反复横跳”，筛选得就非常慢了。这是我们开始我们的“分治”方法。不过，将近五千个数值，如果添加到下方的列表中说不定会卡死，就算添加到列表没卡死，同时锁定的话也说不定会卡死，我们就又白干一场了。

那怎么办呢？

注意我们找到的地址是一组一组的，有单个的，有几个一组的，也有几百个一组的。如果你是编写这个程序员的，你会把人物坐标这种东西和几百个同类的东西连在一起作为一个结构体吗？那个几百个的应该是一个数组。凭我的感觉，应该是某某图形的顶点坐标构成的数组。

所以我们怎么办？先从少的开始试。我觉得从后往前不错，然后就大约 10 个 ~ 20 个一组开始尝试。

我找到了四个能在游戏中体现出具体意义的数值：鼠标坐标，锤子头坐标，罐子坐标，摄像机坐标。

![反复尝试得到的结果](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/06.jpg)

鼠标坐标就是，显示鼠标位置那个圆圈。
锤子头坐标，罐子坐标，就是字面意思，这个游戏的锤子头与罐子是两个独立的单元。
摄像机坐标就是画面的位置。

可以直接改一改锤子头和罐子的 Y 坐标，把 Y 坐标改成 `100` ，你会发现，飞上去然后又掉下来了。再改成 `200`、`300`，效果自己尝试，改的恰到好处的话就直接飞上去了，改的不好的话就卡在石头上或者被石头挤飞了。

没玩好的话，就会像下面这样，并且不断地发出“嗯”“啊”“额”，闭上眼睛想象一下“FA♂Q”的场景。

![改数值时没玩好，卡在墙里了](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/stuck-in-wall.jpg)

> [Tips]
>
> 其实摄像机还有 Z 轴，不信你改一改 `+8` 处的值。你再改一改 `+C` `+10` ... 的值，发现摄像机还有观察的角度，专业点叫 pitch, yaw, roll 翻译为俯仰角、偏航角、翻滚角。
>
> ![调整摄像机参数](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/change-camera-properties.jpg)
>
> 然后既然摄像机有 Z 轴，有旋转角。难道人就没有吗？

> [Comment]
>
> 筛选的过程中，我隐约感觉到，除了锤子头和罐子的坐标外，锁定某些数值的话，可能与会影响棍子的坐标和角度，不过暂时先不考虑。

### 确定地址的位置

玩笑开完了，我们下一步应该做什么呢？你有两条路可以走：1. 找基址，2. 使用 `Advanced Option`

找基址的方式可能比较简单，我们之后会简单的提一下，这里先说如何利用这个 `Advanced Option` ，以及他的作用。

首先选中一个地址（我使用了罐子的 X 坐标），右键然后“找出是什么改写了这个地址”，也可以使用快捷键 `F6`。

然后动一动罐子，找到那个看上去相关的代码，然后把他添加到代码列表中去。

![查找写入地址的代码](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/07.jpg)

> [Tips]
>
> 什么叫“看上去相关”？
>
> 并不是找出的所有指令都是有用的，有些指令可能与游戏并没有什么关联。比如图中那几个命中次数非常少的指令。
>
> 什么样的代码可能相关？
>
> 一种就是，你的坐标移动，那条指令的计数器就增加，不动则不增加。
>
> 另一种就是排除法，你的坐标在移动，但是指令计数器不增加，那就不相关。为什么使用排除法？
>
> 有些情况，无论你动不动，有些指令的计数器都在增加。这时，如果是单机游戏可以暂停的话，暂停之后那条指令如果还在增加，则通常是不相关的。

看完上面这一步，知道为什么要将游戏窗口化了吗？因为我们要一边在游戏中改变数值，一边看 CE 中的计数器变化。

> [Comment]
>
> 忽然想到一个名词，生物学中很常用的实验方法——“控制变量法”。

那么我们找到这条指令有什么用吗？

想做修改器，肯定不能用动态的地址，所以必须要找基址。有些情况找基址并不是那么容易，况且，就算找到这个地址，你如果直接修改这个数值，游戏中也依然会出现跳动的情况。我们的应对方案就是代码注入，因为代码在内存中的地址是固定的。

> [Info]
>
> 为什么 CE 的锁定不是那么管用呢？
>
> ![锁定间隔](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/lock-value-interval.jpg)
>
> 所谓的锁定，其实就是不断写入。不过这里的写入是在进程外写入，与游戏肯定不会同步。这里就要扯一点游戏引擎了（不同引擎可能有所区别）。
>
> 现代的游戏引擎大致是什么原理呢？
>
> 游戏的物理引擎和绘图引擎并不是运行在同一线程上的，不同线程都不是一起运行的，他们的栈肯定也不是共用的，所以他们之间只能通过堆内存来沟通。这带给我们一个好处就是，堆内存是可以通过 CE 很方便地进行搜索的。但也带给我们一个问题就是，你修改数值的时机必须恰到好处，恰好在一个线程写入，另一个线程读取之前修改 **（这里可能存在一些问题，）** ，这通常在线程外是很难做到的。总之多线程技术给我们带了很多麻烦，导致我们不得不去使用代码注入。
>
> 什么是线程？
>
> 一个进程中可以有多个线程，不同线程是“同时”运行的，按照各自的指令执行，线程之间共享内存，都可以访问进程的内存。）
>
> 什么是栈？
>
> 栈也是一块内存区域，通常用于储存函数调用的层次、函数的参数、函数内的局部变量，栈是快速变化的，函数被调用的时候栈会增长，函数调用结束之后栈又会复原，同一个内存地址并不是永远归一个函数或结构所拥有。栈本身的内存是可以跨线程访问的，但是由于线程之间不同步，栈又是快速变化的，跨线程访问只会得到不确定的结果。）
>
> 什么是堆？
>
> 堆内存是通过申请的方式要来的，C语言的函数 `malloc` 就是申请堆内存的，使用的过程中，这块内存保证不会被分配给其他人，只要不使用 `free` 释放掉，这块内存就一直会被保留（直到程序运行结束），如果 `malloc` 与 `free` 没有平衡，则会造成内存泄漏。
>
> ![线程列表](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/thread-list.jpg)

刚才是不是跑题了。我们找到这条指令有什么用吗？

找基址的套路比较固定，但有时候，还真的不能通过套路的方法找到基址，要么需要尝试半天才能找到，要么就是几百个地址等待你去一个一个地尝试。但是如果我们找到了访问或写入该地址的代码，然后在这里下断点，读取寄存器的值就可以找到我们想要的地址了，`Advanced Option` 正好可以完成这项任务。（我这个教程写了好几天，我总不能每次打开游戏都重新搜索一遍吧，使用“高级选项”的代码列表功能可以在不找出基址的情况下，方便我们下一次打开游戏直接找到内存地址）

![找出代码改写的地址](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/08.jpg)

双击找到的地址可以将其添加到地址列表中。

### 尝试修改坐标

又扯了一大堆废话，我们在破解的过程中一定要“不忘初心，牢记使命”。

我们想做什么样的外挂来着？改 Y 坐标。

尝试把罐子的 Y 坐标改的足够大，比如说 `300`，好的，人上去了，锤子还留在下面，然后又被拉回下面了。那我们把锤子的 Y 坐标改的足够大，这回似乎可以，人被锤子拉上去了。不过这样的 **用挂体验极差**。

* 单纯改 Y 坐标，会导致人物位置出现不确定性。
* 如果我们锁定住了 Y 坐标，但是重力依然会令其不断的下落。
* 这么改的话，一点游戏乐趣都没有了。我们的想法是做一个辅助程序，而不是直接通关程序。辅助程序可以根据自己的需要启动和关闭，是受使用者操控的。（就比如网易的《荒野行动》，客户端判断子弹命中，连全屏秒杀都能做出来，体验一下是挺爽，但是没有开挂游戏乐趣了。）

外挂应该怎么做呢？我的想法是，把原本的只能用锤子操控，改成加上一个WASD方向键来辅助。所以先来尝试一下把。

Tutorial 的第五关做了什么？我们先找出谁改写了罐子的 Y 坐标，然后 `Replace with code that does nothing`，把那条代码替换成无用代码。

![替换为无用代码](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/09.jpg)

> [Tips]
>
> 另外几条指令是怎么回事呢？通过观察发现，每次撞击障碍物的时候，次数会加一，应该是和碰撞有关。

现在我们真的悬空了。不过，与此同时我们的锤子也不能动了。不过问题不大，只要能飞，锤子朝哪里不都一样嘛。

![悬空](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/10.jpg)

现在，没有游戏线程写入的干扰了，我们可以在 CE 中随意修改罐子的 Y 坐标，看看是不是可以上下运动。罐子上去了，但是锤子还没有飞上去。

![罐子飞上去了，但锤子没飞上去](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/11.jpg)

这个方案看样子不是很好，我突发灵感想到了另一个方案，所以先把这个搁置一会。当我们锁定罐子的 Y 坐标的时候（不要将代码替换成 NOP），我们看到闪烁的画面，人是越落越快的。如果我们固定垂直速度为 `0`，不就可以悬空了吗。

### 研究速度

如何搜索呢？先在空中锁定 Y 坐标，让其在空中不断下落。这是虽然人会回归原位，但是 Y 速度是一直增大的。注意，向下落的速度应该是负数，越落越快应该是速度的 Y 轴负方向越来越大，所以搜索的时候应该是搜索减小的数值，如果因为速度过大，撞到了地面上，那就再搜索增大的数值。

使用“未知初始值”搜索 Float 数据，然后配合“减小的数值”和“增大的数值”。最终剩下了几千个数值，不过不要紧，我们知道角色属性应该是一个结构体，应该存储在相邻的位置，好的，仅保留罐子坐标附近的值，然后通过锁定尝试一下。然后锁定成正数试试，锁定成负数试试。最后我们确定了，Y 速度在 Y 坐标 `+14` 偏移的位置，同理 X 速度也在 X 坐标 `+14` 偏移的位置。

![确定速度地址](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/12.jpg)

> [Comment]
>
> What's the fuck! 为什么又改回英文版了？前几张图片用的还是汉化版呢！
>
> 因为我发现中文版翻译水平不是很好，我用中文版的时候，有的地方突然找不到我想找的选项了。

使用上述对待 Y 坐标的方法来对待 Y 速度——首先替换成无用代码，这时 Y 速度就不变了，甚至也没法通过锤子来使自己改变 Y 速度了。只能眼睁睁地看着他 Y 方向作匀速直线运动。其实这时我们可以在 CE 中修改速度数值，因为游戏部分的代码已经不会再影响速度了，我们直接在进程外写入就可以影响游戏了。

锁定的时候我们发现了一点问题，如果锁定的时候速度大于某个数之后，人就可以慢慢往上飘了。（我自己试的时候大约是 `3.5`）

这意味着什么？想一想高中物理，`v = v_0 - g * Δt` （负号表示重力方向向下），这个程序会不断地读取这个 Y 速度，然后减去一个速度差，最后再写回去，同时还用这个速度计算 `x = x_0 + v * Δt`。这样，我们锁定这个数值（每 `0.1` 秒写入一次），就可以保证我们一直处于一个 0.1 秒落回原处，并且再次紧接竖直上抛。

其实现在，第一个外挂的雏形已经做出来了。只要不断地向 Y 速度写入一个较大的数，我们可以像玩 `Flappy Bird` 一样玩 `Getting Over It` 了。

![设置修改数值热键](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/13.jpg)

这里我给 X 速度和 Y 速度设置了 WASD 的快捷键，使用 WASD 即可操作速度了。现在 `Getting Over It` 可以改名为 `Flappy Bird` 了。

> 好好地一个竞速类游戏 `Getting Over It`，竟然让你们玩成了休闲游戏 `Flappy Bird`。

![Flappy Bird](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/flappy-bird.jpg)

### 修改窗口标题

创建一个自动汇编脚本，写入以下内容

```asm
[ENABLE]

{$LUA}
hwnd = findWindow(null, "Getting Over It")
return "define(hwnd,#" .. hwnd .. ")"
{$ASM}

alloc(caption,20)
alloc(newmem,1000)

caption:
  db 'Flappy Bird',0

newmem:
  push eax
  push caption
  push hwnd
  call user32.SetWindowTextA
  pop eax
  ret

createthread(newmem)

[DISABLE]

dealloc(caption)
dealloc(newmem)
```

启用这个脚本。

CE 是不是很牛逼？

### 查找重力

我们想到了最前面提出的第 2 种外挂的想法，减小重力。能不能只减小重力，而不影响其他的东西。而且，与重力加速度有关的代码，一定就在写入 Y 速度的指令附近。重力加速度这个东西，我们什么都不知道，根本没法搜索（可以在末尾）

我们之前分析了引擎中可能的写法，读取 Y 速度，加上 `g * Δt`，然后再写回去。那么怎么办呢？首先先找到访问 Y 速度的代码 `Find out what access this address`。注意，是访问的代码，因为我们要找的“加上 `g * Δt`”的代码一定是在写入 Y 速度之前，如果只查找写入的代码的话，我们单步调试的时候想做到往前走还是很麻烦的，所以要用“访问的代码”，这样读取和写入的指令都会被记录，我们从读取的开始分析就可以了。

![访问 Y 速度的指令](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/14.jpg)

这里注意，必须在操作游戏的同时注意指令计数器，找到对我们有用的代码。最后我们分析得出，这两条指令的中间对 Y 速度进行了某种操作。

```asm
GettingOverIt.exe+2A419 - 8B 58 44              - mov ebx,[eax+44]
GettingOverIt.exe+2A9FA - 89 57 44              - mov [edi+44],edx
```

### 简单讲讲汇编语言

![反汇编指令](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/15.jpg)

参考 `mov ebx, [eax+44]` 的详细信息。

`mov` 指令，后面有两个操作数，这句话的含义就是把内存中地址为 `eax+44` 的4字节内容读出来，然后写入 `ebx` 寄存器中。

在上面的情况中就是把 `2CE9BC80 + 44` 也就是 `2CE9BCC4` 的地址的值读取出来写入 `ebx`，这个 `2CE9BCC4` 正好就是我们监视的内存地址，也就是 Y 速度的内存地址。执行完这条指令之后，`ebx` 就是我们的 Y 速度了，由于断点断在指令执行之后，所以这里的 `ebx` 值 `4094625F` 代表的就是 Y 速度，我们可以根据 IEEE754 标准解码一下，数值为 `4.637008`，这个应该是第一次触发这条指令时候的 Y 速度。

![IEEE754 转换器](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/ieee754-converter.jpg)

寄存器，可以理解为一个临时变量，每个寄存器有他们惯例的用途，不过这仅仅是惯例，你想用他们做其他事也可以（除了 `esp` 栈顶指针以外）。

通常我们使 `eax`, `ebx`, `ecx`, `edx` 做普通的操作，虽然这些寄存器也有一些特殊的用途，但是用途较少所以一般的操作用这些寄存器就可以。

`esi` 和 `edi`：看他们的名字，叫做“源索引寄存器”和“目标索引寄存器” （`source index`、`destination index`），因为在很多字符串操作指令用的，在其他的寄存器的时候不用这几个，当然如果你能掌控得好的话 `esi` 和 `edi` 其实也可以随便使用。

`esp`：`esp` 是不可以乱动的，`esp` 指向堆栈顶部，`push` 和 `pop` 指令会影响 `esp`，由于寄存器的数量太少了，我们编写程序时需要的变量有很多，所以使用内存来辅助我们，函数的局部变量就会保存在栈中，调用函数的参数也会保存在栈中。
比如说，现在我们的寄存器都用完了，我需要腾出一个寄存器来做其他事情。那么就把寄存器的变量放到内存（栈）中（`push`），然后就可以对这个寄存器为所欲为了，然后用完之后，再把栈中的值提取出来，放回寄存器。

```asm
push eax
; 做一堆有关eax的事
; 比如：
; mov eax, [ebp+04]
; add eax, [edx]
; mov [ebp+04], eax
pop eax
```

上面的代码做了什么？`push eax` 相当于 `sub esp, 04` 加上 `mov [esp], eax`，栈的最顶上多出来一个数值，同时栈指针减少 `4`。（入栈，栈指针会减小；出栈，栈指针会增大。栈的那一块内存是从地址最大的地方开始往地址较小的方向使用的。）

最后要说说 `ebp` 了，`ebp` 通常用于进入一个函数时，记录当前的栈指针位置

常见的函数开头

```asm
push ebp ; 保存上一个 ebp
mov ebp, esp ; 把 esp 给 ebp
sub esp, 08 ; 分配8字节栈空间用于局部变量
; 函数主体内容...
; 在这里可以使用 ebp 来定位与函数有关的变量
; [ebp-08] 代表第 2 个局部变量
; [ebp-04] 代表第 1 个局部变量
; [ebp] 刚才 push 进来那个 ebp
; [ebp+04] 函数返回之后的要执行的指令所在位置
; [ebp+08] 代表函数的第 1 一个输入参数
; [ebp+0C] 代表函数的第 2 个输入参数
add esp, 08
pop ebp ; 复原 ebp
ret 08 ; 返回函数调用位置，并且把栈指针 +8，把调用的参数从栈中移除
```

![Stack View](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/stack-view.jpg)

如果能驾驭得了的话 `ebp` 也是可以随意使用的。

最后的 `eip` （`Instruction pointer`）始终指向下一条要执行的命令，这个寄存器通常我们不要去动他。

然后就是单步调试了，单步调试时必须的，但是却不一定能得到想要的结果。

先使用 `Show disassembler` 切换到反汇编窗口，然后按 `F5` 下断点，然后这条指令会变成绿色。

![反汇编调试](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/16.jpg)

然后回到游戏中，应该立刻就触发断点了。

![触发断点](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/17.jpg)

我们的Y速度是 `2CE9BCC4` 而 `eax+44` 是 `2CE9BD64`。这说明了什么？想起 Tutorial Step 9: Shared code 了吗？这段代码是很多东西共用的，不过这个游戏不存在敌我区别，可能问题并不算特别大。

我们可以先取消断点，然后右键 `Find out what addresses this instruction accesses` 然后会看到很多地址，证明这部分代码的确是共用代码。

![找出这条指令访问了哪些地址](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/18.jpg)

那么怎么调试呢？

用条件断点。先 `F5` 设置断点然后，右键 `Set/Change break condition`

![设置条件断点](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/19.jpg)

填入正确的 `EAX` 表达式。注意：区分大小写，并且必须带 `0x` 前缀。这里的 `EAX` 就从前面找出访问 Y 速度的指令那个窗口中复制过来就行了，实在不行可以自己手动算一算 Y 速度的地址 `-44` 等于多少，其实你也可以填写 `EAX + 0x44 == 2CE9BCC4` 这样的表达式，这是一个 Lua 表达式。

![填写条件断点条件](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/20.jpg)

这时再返回游戏，这是就会只断在 Y 速度上。继续我们的单步调试。

我们先从断点处往下浏览一下，凡是与 `[ebp-04]` 有关的代码都很可疑。

```asm
GettingOverIt.exe+2A419 - 8B 58 44              - mov ebx,[eax+44]
GettingOverIt.exe+2A41C - 89 5D FC              - mov [ebp-04],ebx
......
GettingOverIt.exe+2A4F5 - F3 0F10 6D FC         - movss xmm5,[ebp-04]
GettingOverIt.exe+2A4FA - 0F57 F6               - xorps xmm6,xmm6
GettingOverIt.exe+2A4FD - 0F5A ED               - cvtps2pd xmm5,xmm5
GettingOverIt.exe+2A500 - F2 0F58 EA            - addsd xmm5,xmm2
......
GettingOverIt.exe+2A553 - F2 0F59 E2            - mulsd xmm4,xmm2
GettingOverIt.exe+2A557 - 0F57 D2               - xorps xmm2,xmm2
GettingOverIt.exe+2A55A - 66 0F5A D4            - cvtpd2ps xmm2,xmm4
GettingOverIt.exe+2A55E - F3 0F11 55 FC         - movss [ebp-04],xmm2
```

这些可以直接进行浮点运算的指令、可以直接操作XMM寄存器的指令，都属于 SSE 指令集。简单地讲讲这几条指令的含义。

* `movss` 表示 `Move Scalar Single`，移动标量单精度浮点值。
* `xorps` 表示 `XOR Packed Single`，压缩单精度浮点值逻辑位异或。
* `cvtps2pd` 表示 `Convert Packed Single to Packed Double`，压缩单精度浮点值转换成压缩双精度浮点值。
* `addsd` 表示 `Add Scalar Double`，标量单精度浮点值加法。
* `mulsd` 表示 `Multiply Scalar Double`，标量单精度浮点值乘法。
以此类推。

每条汇编指令的名字起得都是有意义的，好好学习英语可以帮助我们更好地理解他们哟。

看到一条 SSE 指令，要把他拆成两部分，“操作”和“数据类型”，

第一部分：操作。`mov`、`xor`、`add`、`mul` 这些指令，x86 最基础的指令集中也有。

第二部分：数据类型。`ss`、`sd`、`ps`、`pd` 这一部分又要拆分成两部分来看。第二位是 `s` 表示是 `single` 单精度浮点型，一个数据占 `32` 位，第二位是 `d` 表示 `double` 双精度浮点型，一个数据占 `64` 位。第一位是 `s` 表示只操作 XMM 寄存器的第一个数据（`ss` 就是 `32` 位，`sd` 就是 `64` 位），第一位是 `p` 表示同时操作全部 `128` 位数据（`ps` 就是 `4` 个 `32` 位，`pd` 就是 `2` 个 `64` 位）。

`xor` 后面的两个操作数相同的话就是用来清零的，比如 `xor eax,eax` 就是令 `eax` 为 `0`，这是最简单最快捷的寄存器清零方法。对于 XMM 寄存器同样也是清零。

`cvt` 指令就是浮点数精度的转换，主要看 `s` 和 `d` 的位置，`s2d` 就是 `single to double` 单精度浮点数到双精度浮点数，从只占 `32` 位变成占 `64` 位，反之 `d2s`就是双精度到单精度的转换。

调试的时候可以通过右侧的小箭头来打开 FPU 窗口监视 XMM 寄存器的值。

![FPU](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/fpu-view.jpg)

可以尝试把 `GettingOverIt.exe+2A500 - addsd xmm5,xmm2` 这句看上去极其像 `v = v_0 + Δv` 的代码 NOP 掉。然后你会惊讶地发现，哇塞，真巧，重力消失了。的确，真的很巧，我们只单步调试了几十行就找到了关键代码，所以现在我们可以任意飞行了，只要把这句代码 NOP 掉即可。

### 查找重力加速度

我还不满足于这小小的成就，`v = v_0 + Δv` 找到了，那么 `Δv = g * Δt` 在哪里？找到了重力加速度我才会罢休。

> 接下来要表演的是——如何分析代码。

我说明一下我的分析思路，下面这一堆指令后面注释请从最后一行往前看，直到找到读取重力加速度的指令。

```asm
GettingOverIt.exe+2A3C0 - push ebp
GettingOverIt.exe+2A3C1 - mov ebp,esp
GettingOverIt.exe+2A3C3 - sub esp,000000A8 { 168 }
GettingOverIt.exe+2A3C9 - push ebx
GettingOverIt.exe+2A3CA - push esi
GettingOverIt.exe+2A3CB - mov esi,ecx
GettingOverIt.exe+2A3CD - push edi
GettingOverIt.exe+2A3CE - lea ecx,[ebp-1C]
GettingOverIt.exe+2A3D1 - call GettingOverIt.exe+111C0
GettingOverIt.exe+2A3D6 - mov ebx,[ebp+0C]          ; ebx = [ebp + 0C] = 第二个调用参数
GettingOverIt.exe+2A3D9 - movss xmm0,[ebx]          ; xmm0 = [ebx]
GettingOverIt.exe+2A3DD - xor edx,edx
GettingOverIt.exe+2A3DF - movss [ebp-20],xmm0
GettingOverIt.exe+2A3E4 - cmp [esi+1C],edx
GettingOverIt.exe+2A3E7 - jng GettingOverIt.exe+2A605
GettingOverIt.exe+2A3ED - movsd xmm1,[GettingOverIt.exe+E887E8] { [1.00] }
GettingOverIt.exe+2A3F5 - xor ecx,ecx
GettingOverIt.exe+2A3F7 - mov eax,[esi+08]
GettingOverIt.exe+2A3FA - mov eax,[eax+edx*4]
GettingOverIt.exe+2A3FD - cmp dword ptr [eax],02 { 2 }
GettingOverIt.exe+2A400 - mov ebx,[eax+30]
GettingOverIt.exe+2A403 - mov edi,[eax+2C]
GettingOverIt.exe+2A406 - movss xmm2,[eax+38]
GettingOverIt.exe+2A40B - movss xmm3,[eax+48]
GettingOverIt.exe+2A410 - mov [ebp-24],ebx
GettingOverIt.exe+2A413 - mov ebx,[eax+40]
GettingOverIt.exe+2A416 - mov [ebp-08],ebx
GettingOverIt.exe+2A419 - mov ebx,[eax+44]          ; 已知 [eax+44] 为 "Y 速度"
GettingOverIt.exe+2A41C - mov [ebp-04],ebx          ; 令局部变量 [ebp-04] 等于 "Y 速度"
GettingOverIt.exe+2A41F - mov ebx,edi
GettingOverIt.exe+2A421 - mov [eax+24],ebx
GettingOverIt.exe+2A424 - mov ebx,[eax+30]
GettingOverIt.exe+2A427 - movss [ebp-0C],xmm2
GettingOverIt.exe+2A42C - mov [eax+28],ebx
GettingOverIt.exe+2A42F - movss [eax+34],xmm2
GettingOverIt.exe+2A434 - jne GettingOverIt.exe+2A5C1
GettingOverIt.exe+2A43A - movss xmm2,[eax+78]
GettingOverIt.exe+2A43F - cvtps2pd xmm5,xmm2
GettingOverIt.exe+2A442 - movss xmm4,[eax+4C]
GettingOverIt.exe+2A447 - mov ebx,[ebp+10]          ; ebx = [ebp+10] 第三个输入参数
GettingOverIt.exe+2A44A - movss xmm6,[ebx]
GettingOverIt.exe+2A44E - cvtps2pd xmm2,xmm2
GettingOverIt.exe+2A451 - cvtps2pd xmm4,xmm4
GettingOverIt.exe+2A454 - mulsd xmm4,xmm5
GettingOverIt.exe+2A458 - movss xmm5,[eax+50]
GettingOverIt.exe+2A45D - cvtps2pd xmm5,xmm5
GettingOverIt.exe+2A460 - mulsd xmm5,xmm2
GettingOverIt.exe+2A464 - movss xmm2,[eax+0000008C] ; xmm2 = [eax+8C] 与重力加速度有关
; [eax+8C] 的值为 1，由于这个地址基于 eax，所以他是罐子的结构体中的一个属性，这可能是重力加速度的缩放因子
GettingOverIt.exe+2A46C - cvtps2pd xmm7,xmm2
GettingOverIt.exe+2A46F - cvtps2pd xmm2,xmm2        ; xmm2 = (double)xmm2
GettingOverIt.exe+2A472 - cvtpd2ps xmm4,xmm4
GettingOverIt.exe+2A476 - cvtps2pd xmm6,xmm6
GettingOverIt.exe+2A479 - mulsd xmm6,xmm7
GettingOverIt.exe+2A47D - movss xmm7,[ebx+04]       ; xmm7 = [ebx+04]
; [ebx+04] 的值为 -30.0，看来这个 [ebx+04] 就是我们要找的重力加速度
GettingOverIt.exe+2A482 - cvtss2sd xmm4,xmm4
GettingOverIt.exe+2A486 - cvtpd2ps xmm5,xmm5
GettingOverIt.exe+2A48A - cvtss2sd xmm5,xmm5
GettingOverIt.exe+2A48E - cvtpd2ps xmm6,xmm6
GettingOverIt.exe+2A492 - cvtss2sd xmm6,xmm6
GettingOverIt.exe+2A496 - addsd xmm6,xmm4
GettingOverIt.exe+2A49A - xorps xmm4,xmm4
GettingOverIt.exe+2A49D - cvtpd2ps xmm4,xmm6
GettingOverIt.exe+2A4A1 - cvtps2pd xmm4,xmm4
GettingOverIt.exe+2A4A4 - cvtps2pd xmm7,xmm7        ; xmm7 = (double)xmm7
GettingOverIt.exe+2A4A7 - mulsd xmm7,xmm2           ; xmm7 = xmm7 * xmm2
GettingOverIt.exe+2A4AB - xorps xmm2,xmm2
GettingOverIt.exe+2A4AE - cvtpd2ps xmm2,xmm7        ; xmm2 = (float)xmm7
GettingOverIt.exe+2A4B2 - cvtps2pd xmm2,xmm2        ; xmm2 = (double)xmm2
GettingOverIt.exe+2A4B5 - addsd xmm5,xmm2           ; xmm5 = xmm5 + xmm2
GettingOverIt.exe+2A4B9 - xorps xmm2,xmm2
GettingOverIt.exe+2A4BC - cvtpd2ps xmm2,xmm5        ; xmm2 = (float)xmm5
GettingOverIt.exe+2A4C0 - cvtps2pd xmm2,xmm2        ; xmm2 = (double)xmm2
GettingOverIt.exe+2A4C3 - xorps xmm5,xmm5
GettingOverIt.exe+2A4C6 - cvtss2sd xmm5,xmm0
GettingOverIt.exe+2A4CA - mulsd xmm4,xmm5
GettingOverIt.exe+2A4CE - cvtpd2ps xmm4,xmm4
GettingOverIt.exe+2A4D2 - xorps xmm5,xmm5
GettingOverIt.exe+2A4D5 - cvtss2sd xmm5,xmm0        ; xmm5 = (double)xmm0
GettingOverIt.exe+2A4D9 - mulsd xmm2,xmm5           ; xmm2 = xmm2 * xmm5
; 我猜测这里的 xmm2 和 xmm5 一个是重力加速度一个是时间差。
; 下断点查看一下 XMM 寄存器中的值的： xmm2 = -30.00，xmm5 = 0.01，
; 看上去 xmm2 重力加速度，xmm5 是时间差。
; 这个 xmm5 应该是个近似值，如果想知道准确值，就需要自己手动转换了。
GettingOverIt.exe+2A4DD - movss xmm5,[ebp-08]
GettingOverIt.exe+2A4E2 - cvtpd2ps xmm2,xmm2        ; xmm2 = (float)xmm2
GettingOverIt.exe+2A4E6 - cvtss2sd xmm4,xmm4
GettingOverIt.exe+2A4EA - cvtss2sd xmm2,xmm2        ; xmm2 = (double)xmm2
GettingOverIt.exe+2A4EE - cvtps2pd xmm5,xmm5
GettingOverIt.exe+2A4F1 - addsd xmm4,xmm5
GettingOverIt.exe+2A4F5 - movss xmm5,[ebp-04]       ; xmm5 = "Y 速度"
GettingOverIt.exe+2A4FA - xorps xmm6,xmm6
GettingOverIt.exe+2A4FD - cvtps2pd xmm5,xmm5        ; xmm5 = (double)xmm5
GettingOverIt.exe+2A500 - addsd xmm5,xmm2           ; xmm5 = xmm5 + xmm2 <== 从这一行开始往上看
GettingOverIt.exe+2A504 - movss xmm2,[eax+00000084]
GettingOverIt.exe+2A50C - cvtps2pd xmm2,xmm2
GettingOverIt.exe+2A50F - cvtss2sd xmm6,xmm0
GettingOverIt.exe+2A513 - mulsd xmm2,xmm6
GettingOverIt.exe+2A517 - addsd xmm2,xmm1
GettingOverIt.exe+2A51B - cvtpd2ps xmm4,xmm4
GettingOverIt.exe+2A51F - movapd xmm6,xmm1
GettingOverIt.exe+2A523 - divsd xmm6,xmm2
GettingOverIt.exe+2A527 - xorps xmm2,xmm2
GettingOverIt.exe+2A52A - cvtpd2ps xmm2,xmm6
GettingOverIt.exe+2A52E - cvtss2sd xmm4,xmm4
GettingOverIt.exe+2A532 - xorps xmm6,xmm6
GettingOverIt.exe+2A535 - cvtps2pd xmm6,xmm2
GettingOverIt.exe+2A538 - mulsd xmm4,xmm6
GettingOverIt.exe+2A53C - cvtpd2ps xmm4,xmm4
GettingOverIt.exe+2A540 - movss [ebp-08],xmm4
GettingOverIt.exe+2A545 - xorps xmm4,xmm4
GettingOverIt.exe+2A548 - cvtps2pd xmm2,xmm2
GettingOverIt.exe+2A54B - cvtpd2ps xmm5,xmm5        ; xmm5 = (float)xmm5
GettingOverIt.exe+2A54F - cvtss2sd xmm4,xmm5        ; xmm4 = (double)xmm5
GettingOverIt.exe+2A553 - mulsd xmm4,xmm2           ; xmm4 = xmm4 * xmm2
GettingOverIt.exe+2A557 - xorps xmm2,xmm2
GettingOverIt.exe+2A55A - cvtpd2ps xmm2,xmm4        ; xmm2 = (float)xmm4
GettingOverIt.exe+2A55E - movss [ebp-04],xmm2       ; 令 "Y 速度" 的临时变量等于 xmm2
......
GettingOverIt.exe+2A5E5 - mov edi,[ebp-04]
GettingOverIt.exe+2A5E8 - mov [ecx+eax+04],edi
......
GettingOverIt.exe+2A9F6 - mov edx,[ebx+eax+04]
GettingOverIt.exe+2A9FA - mov [edi+44],edx          ; 重新写回 "Y 速度"
```

![XMM 寄存器](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/21.jpg)

![IEEE754 XMM 寄存器](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/ieee754-xmm-register.jpg)

经过上述一系列的分析，我们发现了，重力加速度 `[ebx+04]` 和重力缩放因子 `[eax+8C]` 这两个数值。

通过断点把 `ebx+04` 的值，然后手动添加到 Cheat Table 中（当然，也可以用“找出这条指令访问的地址”），将其 `-30.00` 改成其他数值试试，看看改成 `0` 是不是失重，改成正数是不是反重力。

![反重力](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/22.jpg)

把重力加速度 `[ebx+04]` 改成正数之后，似乎所有物品都会向上飘，不只是自己的罐子（`Shared Code` 体现出来了），但是把重力缩放因子 `[eax+8C]` 这个与人相关的数值改成 `-1` 的话，就只有自己会向上飘，其他物品则不会，这也验证了我们的猜想。

好的，我们又完成了一个外挂的功能。

> [Tips]
>
> 看到 `[ebx+04]` 是重力加速度，有没有什么想法？ebx肯定也是一个结构体的指针啊，为什么一个重力加速度要放在 `+04` 的位置呢？
>
> `+04` 表示的是 Y 方向的加速度，而 `[ebx]` 则是 X 方向的加速度，根据我们的猜测应该是 `0`，然后这两个数值组成，重力加速度的向量 `(0, -30)`，我们把 `[ebx]` 添加到 Cheat Table 中，看一看数值，确实是 `0`，然后再改一改 `[ebx]` 就可以发现，我们的猜测没有错，这里正是 X 方向加速度。

### 找基址

这一步所说的“找基址”并不只是找基址，只是为了达到目标——在每次程序重启时都能直接定位到目标地址。

以下提供几种方法，实际破解的时候需要将每种方法都试一试，最后一种是备用方法，也是比较高级的方法，实现起来比较麻烦。

1. 手动查找基址
2. Pointer scan
3. 代码注入

前两种方法请参考《CE 教程：基础篇》。

对于 Getting Over It 这种使用引擎并且物理计算较多的程序而言，手动查找地址可能并不是非常容易，可以尝试扫描自动扫描指针。不过自动扫描指针也有一些缺点，就是太占硬盘了。我尝试扫描指针的时候发现，刚扫描了 1 分钟就生成了 20G 的指针列表文件，而且用默认的 4 级指针还真的不一定能找到基址。

所以这里我们要讲代码注入法。

这里我就以上面刚刚找到的 Y 方向的加速度为例。

首先还是“查找什么访问了该地址”。这里我们找到了刚才分析过的那一条指令。

```asm
GettingOverIt.exe+2A47D - movss xmm7,[ebx+04]
```

然后就是代码注入了，选择 `Auto Assemble` 或者使用快捷键 `Ctrl + A`，然后使用 `Full Injection` 模板

![代码注入](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/23.jpg)

自动生成了如下代码。大括号内部的文字都是注释，前面是文件的相关描述，最后是代码注入点附近的指令。如果觉得没用的话可以删掉，只保留中间的主要内容即可。

```asm
{ Game   : GettingOverIt.exe
  Version: 
  Date   : 2018-02-01
  Author : Ganlv

  This script does blah blah blah
}

define(address,"GettingOverIt.exe"+2A47D)
define(bytes,F3 0F 10 7B 04)

[ENABLE]

assert(address,bytes)
alloc(newmem,$1000)

label(code)
label(return)

newmem:

code:
  movss xmm7,[ebx+04]
  jmp return

address:
  jmp newmem
return:

[DISABLE]

address:
  db bytes
  // movss xmm7,[ebx+04]

dealloc(newmem)

{
// ORIGINAL CODE - INJECTION POINT: "GettingOverIt.exe"+2A47D

"GettingOverIt.exe"+2A454: F2 0F 59 E5              -  mulsd xmm4,xmm5
"GettingOverIt.exe"+2A458: F3 0F 10 68 50           -  movss xmm5,[eax+50]
"GettingOverIt.exe"+2A45D: 0F 5A ED                 -  cvtps2pd xmm5,xmm5
"GettingOverIt.exe"+2A460: F2 0F 59 EA              -  mulsd xmm5,xmm2
"GettingOverIt.exe"+2A464: F3 0F 10 90 8C 00 00 00  -  movss xmm2,[eax+0000008C]
"GettingOverIt.exe"+2A46C: 0F 5A FA                 -  cvtps2pd xmm7,xmm2
"GettingOverIt.exe"+2A46F: 0F 5A D2                 -  cvtps2pd xmm2,xmm2
"GettingOverIt.exe"+2A472: 66 0F 5A E4              -  cvtpd2ps xmm4,xmm4
"GettingOverIt.exe"+2A476: 0F 5A F6                 -  cvtps2pd xmm6,xmm6
"GettingOverIt.exe"+2A479: F2 0F 59 F7              -  mulsd xmm6,xmm7
// ---------- INJECTING HERE ----------
"GettingOverIt.exe"+2A47D: F3 0F 10 7B 04           -  movss xmm7,[ebx+04]
// ---------- DONE INJECTING  ----------
"GettingOverIt.exe"+2A482: F3 0F 5A E4              -  cvtss2sd xmm4,xmm4
"GettingOverIt.exe"+2A486: 66 0F 5A ED              -  cvtpd2ps xmm5,xmm5
"GettingOverIt.exe"+2A48A: F3 0F 5A ED              -  cvtss2sd xmm5,xmm5
"GettingOverIt.exe"+2A48E: 66 0F 5A F6              -  cvtpd2ps xmm6,xmm6
"GettingOverIt.exe"+2A492: F3 0F 5A F6              -  cvtss2sd xmm6,xmm6
"GettingOverIt.exe"+2A496: F2 0F 58 F4              -  addsd xmm6,xmm4
"GettingOverIt.exe"+2A49A: 0F 57 E4                 -  xorps xmm4,xmm4
"GettingOverIt.exe"+2A49D: 66 0F 5A E6              -  cvtpd2ps xmm4,xmm6
"GettingOverIt.exe"+2A4A1: 0F 5A E4                 -  cvtps2pd xmm4,xmm4
"GettingOverIt.exe"+2A4A4: 0F 5A FF                 -  cvtps2pd xmm7,xmm7
}
```

我这里先把写好的代码贴出来，然后再解释为什么。

```asm
define(address,"GettingOverIt.exe"+2A47D)
define(bytes,F3 0F 10 7B 04)

[ENABLE]

assert(address,bytes)
alloc(newmem,$1000)
alloc(acceleration_base,4)
registersymbol(acceleration_base)

label(code)
label(return)

newmem:
  mov [acceleration_base],ebx

code:
  movss xmm7,[ebx+04]
  jmp return

address:
  jmp newmem
return:

[DISABLE]

address:
  db bytes
  // movss xmm7,[ebx+04]

dealloc(newmem)
dealloc(acceleration_base)
```

对比一下自动生成的代码和最后的完整代码，我们发现只多了这几行。

```asm
alloc(acceleration_base,4)
registersymbol(acceleration_base)
mov [acceleration_base],ebx

dealloc(acceleration_base)
```

`alloc` 是分配内存，分配一个 `4` 字节大的内存区域，然后把分配得到的地址保存到 `acceleration_base` 中。

`registersymbol` 命令是我们主要讲解的东西，代码注入法找地址全靠这个命令，这个一会再讲。

最后 `mov` 指令是写入到 `newmem` 的，把 `ebx` 的值保存到了 `acceleration_base` 也就是刚刚分配的那 4 字节的空间中了。

`dealloc` 是释放已分配的内存

把上述代码保存到当前 Cheat Table 中

![保存到当前 Cheat Table 中](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/24.jpg)

然后可以在最后面看到一个 `Auto Assemble script`，可以给他起一个名字，比如“Hook Y 加速度获取地址”，我们可以点击前面的方框或者按空格键启用它。

![自动汇编脚本](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/25.jpg)

一旦启用了这个脚本，我们的 `registersymbol` 的作用就来了。

我们刚才定义的 `acceleration_base` 里面的值应该是等于 `ebx` 的吧，或者说 `[acceleration_base]` 等于 `ebx`，并且 Y 加速度的内存地址是 `ebx+04`，所以我们只要在 Cheat Table 中添加一个 `[acceleration_base]+4` 的地址即可。没错，手动新建一个地址，地址就填 `[acceleration_base]+4` 就行。当然也可以使用指针的方法，基址填 `acceleration_base`，一级偏移填 `4`，就可以了。

![使用 registersymbol 构造地址偏移](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/26.jpg)

现在你可能懂了 `registersymbol` 是做什么的，用了这个命令之后，我们申请的变量地址就可以被 Cheat Table 引用了，我们就可以根据这个地址来找到目标地址。

你可能发现了，为什么显示地址为 `00000004` 而不是真实的地址呢？

首先，我们的代码注入必须先启用，点击“Hook Y 加速度获取地址”前面的方框启用，这时代码已经注入到了游戏中。然后，由于切出游戏时，游戏会自动暂停，这段代码并没有被执行，所以我们的 `acceleration_base` 还一直没有被赋值，暂时还是 `0`。所以呢，我们想让其显示正常的值的方法就是返回游戏中，动一下（只要能让这个代码执行一次就行，什么方法都可以）。

现在应该已经成功了。

### 共用代码找基址

课堂练习：使用代码注入法找到“罐子 Y 速度”的地址。

其实我是故意的，之前的分析提到，罐子 Y 速度的访问和写入都是 `Shared code` 共用代码，我们如果还是简单地使用上面的方法，可能会得到几个不同的结果，我们必须在赋值之前对结构体进行检查（参考 Tutorial Step 9: Shared code，如何检查人名或者队伍）。

我依然选择上面分析得到的那句代码作为注入点

```asm
GettingOverIt.exe+2A419 - mov ebx,[eax+44]
```

我们需要的只是这里的 `eax`，申请一个地址，并 `registersymbol`，把 `eax` 存进去即可。不过这次我们要判断是否是我们想要的元素的 `eax`。

在反汇编器中，右键该条指令，`Find out what addresses this instruction accesses` 找出这条指令访问的地址。

![被这条指令修改的地址](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/27.jpg)

我们找到一堆指令，第一条与最后两条条显然与我们的速度不符，倒数第二条，看前面的地址就是我们的“罐子 Y 速度”地址。我们要做的就是找不同。

找什么的不同呢？找寄存器的不同、找堆栈的不同、找 `eax` 附近结构体内容的不同。

右键目标地址，可以显示寄存器状态 `Ctrl + R`，在寄存器窗口可以看栈的情况。

![显示寄存器状态](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/28.jpg)

显示那几个内存地址寄存器状态，然后再对比一下，可以发现 `edx` 是从 `0` 到 `5` 一次递增的，`edx == 5` 的时候恰好是我们的想要的地址。

然后就可以这么写注入脚本

```asm
define(address,"GettingOverIt.exe"+2A419)
define(bytes,8B 58 44 89 5D FC)

[ENABLE]

assert(address,bytes)
alloc(newmem,$1000)
alloc(body_base,4)
registersymbol(body_base)

label(code)
label(return)

newmem:
  pushf               // 把标志位寄存器入栈，一会要恢复
  cmp edx,05          // 比较 edx 和 5
  jne @f              // 如果不相等则跳转到下一个最近的标签
  // @f 表示下一个标签，@b 表示上一个标签
  mov [body_base],eax // 把 eax 存到变量中
  @@:                 // 这就是下一标签
  popf                // 恢复标志位

code:
  mov ebx,[eax+44]
  mov [ebp-04],ebx
  jmp return

address:
  jmp newmem
  nop
return:

[DISABLE]

address:
  db bytes
  // mov ebx,[eax+44]
  // mov [ebp-04],ebx

dealloc(newmem)
dealloc(body_base)
```

上边的代码并不是对的，因为如果人物掉进水里，重新生成的话，`edx` 的顺序会改变，下次就不是 `05` 了，我们还是得对比结构体啊。

使用 `Open dissect data with selected addresses` 在指定地址处打开分块数据。

![在指定地址处打开分块数据](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/29.jpg)

然后就选择 `<New window>`，然后填上一个数据结构的名称，我就叫做“物体单元”了。

![分块数据](/images/2018-01-27-cheat-engine-tutorial-getting-over-it/30.jpg)

这个结构是 CE 自动分析的，有些不一定对，还需要手动调整，我们需要做的其实就是找不同。这里的第 6 列是“罐子 Y 速度”的 eax，我们就找第 6 列中明显的区别吧。

然后我就发现 `eax+68` 处只有我们需要的这个地址是 `6` 其他是 `0` 或者 `4`，所以我们就比较这个地址吧。

关键代码如下，把上面的那个 `cmp` 指令修改一下就可以了。

```asm
cmp [eax+68],06
```

之后手动添加内存地址的过程大家应该都已经会了。

## 附录

### 相关链接

* CE 官方网站：<https://cheatengine.org/>
* GitHub 下载地址：<https://github.com/cheat-engine/cheat-engine/releases>
* CE 官方中文翻译：<https://cheatengine.org/download/zh_CN.rar>
* CE 官方教程：<https://wiki.cheatengine.org/index.php?title=Tutorials>
* CE 脚本引擎函数列表：<https://wiki.cheatengine.org/index.php?title=Help_File:Script_engine>
* 反汇编的一些基本知识：<https://www.52pojie.cn/thread-434732-1-1.html>
* IEEE754 在线解码器：<https://www.h-schmidt.net/FloatConverter/IEEE754.html>
* IEEE754 Double 类型在线解码器：<http://www.binaryconvert.com/convert_double.html>
