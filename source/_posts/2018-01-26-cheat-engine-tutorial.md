---
title: Cheat Engine 基础教程
date: 2018-01-26 06:59:57
tags:
  - cheatengine
  - tutorial
  - disassemble
  - game
  - hack
---

<!-- toc -->

## 注意事项

### CE 版本问题

我用的是目前的最新版 `Cheat Engine 6.7`（2017 年 6 月 7 日发布的。这个日子对于考生们很特别嘛）

### 关于语言问题

我使用的是英文版，表示某按钮或某菜单的时候我会用英文，说明其用途的时候我会用中文。

汉化版的 CE 与原版的按钮位置或菜单顺序一般都是不会变的，Tutorial 中的基址我不保证不会变。

> [Comment]
>
> 我推荐使用英文版，因为有些翻译并不能准确表达英文原文的意思。

## 基础知识

### 简介

Cheat Engine：作弊引擎，简称为 `CE`。

* 通常用于单机游戏的内存数据修改，可以搜索游戏中的内存数据，并进行修改、锁定等操作
* 内置调试器，可以进行反汇编调试、断点跟踪、代码注入等诸多高级功能
* 支持 `lua` 语言，可以实现自己定义的逻辑功能，而不仅仅是简单的锁定数据。也可以在代码注入的同时注入 lua 插件，使游戏进程与 CE 进程进行交互。 CE 的大部分功能都可以通过 lua 来操作
* 它还支持 `D3D Hook` 功能，可以在游戏中显示十字准星，也可以绘制功能菜单，同时也可以对 D3D 的调用栈进行跟踪调试
* 自带变速功能，通过 Hook 游戏相关函数改变游戏速度
* 自带了一个 `Trainer` 的功能，可以将自己在 CE 中实现的功能单独生成一个 exe 文件，并可以使用 lua 创建比默认样式更加复杂的窗体或功能
* 除了 CE 界面上提供的功能，可以 lua 引擎使用更多隐藏功能，具体就要看帮助文档了

### 安装 CE

（安装过程略）

Cheat Engine 6.7 在 Windows 10 下的默认安装位置为：`C:\Program Files (x86)\Cheat Engine 6.7`，可以使用其他安装目录，不过记着把程序放在哪了就行（记不住其实也无所谓...），之后可能要到这个目录去找一些东西。

### 使用中文翻译文件

官方翻译文件的下载链接在文章末尾。

首先解压到类似 `C:\Program Files (x86)\Cheat Engine 6.7\languages\zh_CN` 的文件夹。

![解压中文翻译文件](/images/2018-01-26-cheat-engine-tutorial/extract-language-files.jpg)

然后到 CE 的设置中，语言选择 `zh_CN`。

![选择简体中文语言](/images/2018-01-26-cheat-engine-tutorial/select-language.jpg)

重启 CE 即可

![中文界面](/images/2018-01-26-cheat-engine-tutorial/zh-cn-ui.jpg)

### 打开 CE

最新版的 CE 有两个主程序，一个 32 位的，一个 64 位的，基本没什么区别，不存在其他一些调试器 32 位无法调试 64 位程序的问题，通常直接通过 `开始菜单` > `Cheat Engine 6.7` > `Cheat Engine 6.7` 打开就可以了，不必区分 32 位或者 64 位。

![开始菜单](/images/2018-01-26-cheat-engine-tutorial/start-menu.jpg)

打开 CE 会触发 UAC（User Account Control，用户账户控制），就是用管理员权限打开咯，单纯的搜索内存是不用这个权限的，只有调试的时候某些特殊的功能才可能用到管理员权限，肯定点“是”啊（如果点否的话，你可以顺便关闭这个帖子了...）

### 界面简介

![主界面](/images/2018-01-26-cheat-engine-tutorial/main-ui.jpg)

上面是菜单栏，暂时用不到。

然后有个一直在闪的按钮是进程选择器，旁边两个是打开和保存 CE 的存档文件的按钮，记得随时保存哦，改内存数据很可能导致游戏崩溃的哦，如果调试的话连 CE 也会一起崩溃。

然后是当前选择的进程的名称。

下面是一个进度条，显示搜索进度用的。

右边有个设置按钮。

然后左边是搜索到的内存地址，右边是搜索的类型、内容、条件、内存区域等等，下面有个↘右下箭头，是把选中的地址添加到下方的区域里。

下方称之为 `Cheat Table`（作弊表），就是我们得到的内存地址、数据，以及自己添加的功能等等。

表格上方三个按钮：显示内存窗口、清空作弊列表、手动添加地址。下方两个按钮：高级选项和附加信息。

内存窗口用于调试，手动添加地址通常是手动添加带指针的地址，高级选项中储存了一些指令，还可以暂停当前进程，附加信息可以附带一些使用方法、作者信息等等，高级选项中的指令与附加信息会一同保存在存档中。

## 教程

### 打开 CE 自带的教学软件 Tutorial

选择菜单栏中的 `Help` > `Cheat Engine Tutorial` ，是否是64位的无所谓，也可以从 `开始菜单` > `Cheat Engine 6.7` > `Cheat Engine Tutorial` 打开CE自带的教学软件（以后简称 `Tutorial` ）。

![打开教学程序](/images/2018-01-26-cheat-engine-tutorial/open-tutorial-program.jpg)

打开之后可以看到一堆文字说明，会英文的同学慢慢看，不会英文的同学可以找CE中文版，或者找翻译器翻译一下吧，我也会简单叙述一下的。

### Step 1

> [Tips]
>
> 文中的内容是 CE 的简介，和我前面的叙述内容差不多。

你需要做的就是在 CE 中点击那个闪闪发亮的进程选择按钮，选择 `????????-Tutorial-x86_64.exe` 或者 `????????-Tutorial-i386.exe` ， `x86_64` 或者 `i386` 取决于你打开的是 32 位的教学程序还是 64 位的教学程序，前面的 8 位可能不一样，因为这个是进程 ID（PID），每次打开程序，系统会重新分配一个新的 PID。

![Step_01_01](/images/2018-01-26-cheat-engine-tutorial/Step_01_01.jpg)

通常，游戏只会有一个进程，某些游戏可能有两个进程，选哪个就要凭感觉了，你可以看看任务管理器，通常选择占用内存大的那一个，实在不行就两个都试一试（反正又玩不坏）。

Tutorial 右下角有一个输入密码的地方，之后每一关都会告诉你一个密码，在这里输入，就可以直接就跳到对应关卡了。

选择完之后可以看到主界面上面显示了当前选择的进程名。

![Step_01_02](/images/2018-01-26-cheat-engine-tutorial/Step_01_02.jpg)

现在点击 Tutorial 中的 `Next` 就可以了。

### Step 2: Exact Value scanning (PW=090453)

> [Info]
>
> 第二关：精确值搜索（密码是 090453）。
>
> 这关重现了经典的打怪现场，你有 100 滴血，点击 `Hit me` 你会被怪打一下，然后你的血量就少了。（再然后，打着打着就像白学家一样被打死了←_←，不过 Tutorial 会给你一条新的生命的。实际游戏中通常不会有这种好事，开始一次新的搜索吧）
>
> 你需要做的是：把它改成 `1000`。

很简单，在CE中输入 `100`，点击 `First scan`。

![Step_02_01](/images/2018-01-26-cheat-engine-tutorial/Step_02_01.jpg)

然后让怪打自己一下（点击 `Hit me`），输入新的数值（比如说 `96`），然后点击 `Next scan`。

现在基本就剩1个地址了，不行就再打一下，再搜一次。

![Step_02_02](/images/2018-01-26-cheat-engine-tutorial/Step_02_02.jpg)

然后双击地址列表中的值（或者选中然后点击右下箭头），添加到下方 `Cheat Table` 中。

![Step_02_03](/images/2018-01-26-cheat-engine-tutorial/Step_02_03.jpg)

然后双击 `Value` 部分，改成 `1000`。

![Step_02_04](/images/2018-01-26-cheat-engine-tutorial/Step_02_04.jpg)

可以看到原来不可以点击的 `Next` 现在已经可以点击了，点击 `Next` 进入下一关。

#### 现在想想，这个是什么原理呢？

通常，在游戏中面板显示的数值应该和内存里的数值一样。第一次，显示 100 ，搜索 100 。然后打了自己一下，地址列表中有些数值还是 100 ，有些则变成了 96 ，那么哪个地址才是真正的存储地址呢？如果这个地址是我们想要的，无论打自己几下，他就会一直与我们的血量有关。这就是个不断筛选的过程，把始终跟目标有关的数据筛选出来就可以了。

### Step 3: Unknown initial value (PW=419482)

> [Info]
>
> 第三关：未知初始值。
>
> 有些游戏的血量不会直接以数值形式显示，比如说某些小怪，之后显示一个血条，但是打他们的时候，怪的身上会显示承受伤害值，就是减少的血量。
>
> 你需要做的是：把它改成 `5000`。

首先你需要开始一次新的搜索，点击 `New scan`。

![Step_03_01](/images/2018-01-26-cheat-engine-tutorial/Step_03_01.jpg)

然后在 `Scan Type` 中选择 `Unknown initial value`（未知初始值），点击 `First scan`。

![Step_03_02](/images/2018-01-26-cheat-engine-tutorial/Step_03_02.jpg)

因为是未知初始值，所以第一次搜索之后列表中什么也不会显示，因为显示什么也没有用，毕竟未知初始值没什么意义。同时左上角的 `Found` 显示找到的数值非常多，未知初始值就是把内存中所有数值都保存下来，所以非常多，所以最好不要使用未知初始值这个东西。

然后打自己一下，在CE中选择 `Decreased value by ...`（数值减少了...），将减少的数值输进去，比如 Tutorial 中显示 `-9` 则输入 `9`，点击 `Next scan`。

![Step_03_03](/images/2018-01-26-cheat-engine-tutorial/Step_03_03.jpg)

这时列表可能不止一个数值，我们重复上述操作，再打一次，把减少的血量输入到CE中，再搜索一次。

搜索了几次还是剩这么几个地址，我果断就把其他几个忽略了，把两百左右那个添加到 `Cheat Table `中，改成 `5000`，有时候还是需要一些主观因素的。

![Step_03_04](/images/2018-01-26-cheat-engine-tutorial/Step_03_04.jpg)

好了，可以 `Next` 了。

#### Step 3 课外拓展

`4294965556` 这个数是什么意思？

计算机中的整数分为有符号和无符号两种，内存就是一堆字节构成的数据，至于如何解释这堆字节就要看是哪段代码来读取他。

比如 `4294965556`，在内存中是 `FF FF F9 34` 这4个字节组成的，如果按无符号来解释就是 `4294965556` 如果按有符号来解释就是 `-1740` 的意思。

![Step_03_05_01](/images/2018-01-26-cheat-engine-tutorial/Step_03_05_01.jpg)

![Step_03_05_02](/images/2018-01-26-cheat-engine-tutorial/Step_03_05_02.jpg)

可以通过右键该地址 `Browse this memory region` 来查看这段内存区域。（在我们常用的这种PC机中，采用 `Little Endian` 的格式存储多字节数据，即把 `FFFFF934` 存储成 `34 F9 FF FF` 的形式）

![Step_03_05_02](/images/2018-01-26-cheat-engine-tutorial/Step_03_05_03.jpg)

### Step 4: Floating points (PW=890124)

> [Info]
>
> 第四关：浮点类型。
>
> 现代的游戏中已经很少使用整数了，这一关就是搜索含小数的数值，`Health`（生命值）是 `float` 类型（单精度浮点型）， `Ammo`（弹药）是 `double` 类型（双精度浮点型）。
>
> 你需要做的是：把生命和弹药都改成 `5000`。

除了改一下 `Value Type` 其他和第二关完全一样。

把 `Value Type` 改成 `Float` 搜索并修改生命值，改成 `Double` 搜索并修改弹药。

![Step_04_01](/images/2018-01-26-cheat-engine-tutorial/Step_04_01.jpg)

![Step_04_02](/images/2018-01-26-cheat-engine-tutorial/Step_04_02.jpg)

然后点击 `Next`。

#### Step 4 说明

通常游戏中为了计算速度会选择 `Float` 类型，至于游戏开发者或游戏框架会选择什么类型谁也不清楚，靠自己瞎猜吧，一个一个试，实在不行就把 `Value Type` 改成 `All` 吧。

### Step 5: Code finder (PW=888899)

> [Info]
>
> 第五关：代码查找器
>
> 通常，储存数据的地址不是固定不变的，每一次重启游戏通常都会变动，甚至在你玩游戏的过程中地址都有可能改变。为此，我们有两个方法，这一关讲解使用代码查找的方法。
>
> 每一次点击 `Change value` 数值都会改变。
>
> 你需要做的是：让其不再改变。

首先，用第二关的方法，找到这个数值的地址，添加到 `Cheat Table` 中。

然后，右键点击这个地址，选择 `Find out what writes to this address`。

![Step_05_01](/images/2018-01-26-cheat-engine-tutorial/Step_05_01.jpg)

这时会弹出一个提示框，“这个操作会将 Cheat Engine 的调试器附加到指定进程中，是否继续？”

![Step_05_02](/images/2018-01-26-cheat-engine-tutorial/Step_05_02.jpg)

选择“是”即可。（你可以试试选“否”会怎样。随便尝试嘛，反正电脑又不是 Samsung Galaxy Note 7，又不会因为这点小事而爆炸。不过试了之后你会发现什么都没发生...因为选“否”就是不继续进行任何操作了。）

这时就会弹出一个新的窗口“下列操作指令写入了xxxxxxxx”

![Step_05_03](/images/2018-01-26-cheat-engine-tutorial/Step_05_03.jpg)

现在，点一下 `Change value` 就会发现，CE 发现了一条指令改写了当前地址。

![Step_05_04](/images/2018-01-26-cheat-engine-tutorial/Step_05_04.jpg)

选中这条指令，点击 `Replace` 按钮，想起个名字就给他起个名字，不想起就直接 `OK` 就行了。

![Step_05_05](/images/2018-01-26-cheat-engine-tutorial/Step_05_05.jpg)

当然，右键这条指令，选择 `Replace with code that does nothing (NOP)` 也可以。

![Step_05_06](/images/2018-01-26-cheat-engine-tutorial/Step_05_06.jpg)

这时再点 `Change value`，就会发现 `Next` 可以点击了。

> [Tips]
>
> 如果你能以足够快的方式锁定这个数值，也是可以的过关的。

#### Step 5 说明

这一关，我们到底做了些什么？

##### 找出改写当前地址的操作

首先，找出改写当前地址的操作，这个是调试器的一个功能，所以必须先把调试附加到指定进程（这个附加操作可能被检测到，网络游戏需要过非法）

找出改写当前地址的操作，其实是设了一个内存断点，每次有指令改写这个内存，都会使目标进程中断在改写指令之后（为什么是之后，这个是CPU所决定的，没办法），然后 CE 会自动记录这条地址，并储存寄存器信息，然后继续运行程序。

可以尝试，右键这个地址选择 `Browse this memory region` 查看这块内存区域。

![Step_05_07_01](/images/2018-01-26-cheat-engine-tutorial/Step_05_07_01.jpg)

![Step_05_07_02](/images/2018-01-26-cheat-engine-tutorial/Step_05_07_02.jpg)

可以看到当前地址用深绿色表示，证明有断点存在

这个操作的过程还是很耗资源的，虽然现在的PC已经完全不在话下了，但是还是在用完即使点 `Stop` 按钮，取消这个断点，结束这一系列操作。

点击 `Stop` 之后，绿色表示的断点就会消失。

##### 将代码替换为什么也不做

程序运行时的指令与数据都是储存在内存中的，将指令替换为什么都不做（通常称为：NOP 掉这条指令。NOP 就是 No operation 的意思，CPU遇到这条指令就是什么都不做，直接执行下一条指令。NOP对应的机器码为 0x90，16进制的90），就是将指定的内存区域全部改成 90，可以先使用 `Show diassembler` 查看指定区域的反汇编，然后再点 `Replace` 看看那条指令的变化。

![Step_05_08_01](/images/2018-01-26-cheat-engine-tutorial/Step_05_08_01.jpg)

![Step_05_08_02](/images/2018-01-26-cheat-engine-tutorial/Step_05_08_02.jpg)

替换成什么也不做之后，这个地址就不会再改变了，其他指令使用这个地址时就一直是同一个值了。

##### 代码列表

点击 `Replace` 会提示一个输入名称，这是因为这条代码会保存在地址列表中，点击主界面的 `Advanced Options` 打开地址列表。

红色表示当前地址已经被替换成无用代码了。

`Replace` 会自动将其替换成无用代码，如果想复原可以在 `Advanced Options` 中右键这条指令，选择 `Restore with original code` 恢复原始代码。

![Step_05_09_01](/images/2018-01-26-cheat-engine-tutorial/Step_05_09_01.jpg)

### Step 6: Pointers: (PW=098712)

> [Info]
>
> 第六关：指针
>
> 上一关使用了代码查找器，这一关则使用指针的方法确定地址。
>
> 点击 `Change value` 数值都会改变。点击 `Change pointer` 有点类似重新开始一局游戏，这意味着，数值的地址会改变。
>
> 你需要做的是：将数值锁定在5000，即使点击 `Change pointer` 改变了数值所在地址之后。

先用第二关的方法把数值的地址找到，添加到 `Cheat Table` 中。

然后用第五关的方法 `Find out what writes to this address`，不过这回不使用 `Replace` 了，而是点击 `More infomation`。

![Step_06_01](/images/2018-01-26-cheat-engine-tutorial/Step_06_01.jpg)

使用 `Scan Type: Exact Value`、`Value Type: 4 Bytes`、勾选 `Hex` 搜索刚才复制的地址

![Step_06_02](/images/2018-01-26-cheat-engine-tutorial/Step_06_02.jpg)

![Step_06_03](/images/2018-01-26-cheat-engine-tutorial/Step_06_03.jpg)

绿色的地址表示基址，每次游戏启动时基址都是不会改变的，我们找到了基址，就大功告成了。

把搜索到的基址添加到 `Cheat Table` 中，然后双击 `Address` 区域，修改地址，把基址复制下来。

![Step_06_04](/images/2018-01-26-cheat-engine-tutorial/Step_06_04.jpg)

手动添加地址，勾选指针，然后最下面粘贴基址，上面的一级偏移填 `0`，

![Step_06_05](/images/2018-01-26-cheat-engine-tutorial/Step_06_05.jpg)

然后修改数据，改成 `5000`，然后点击前面的方框锁定数据。

点击 `Change pointer`，然后就可以点 `Next` 了。

#### Step 6 说明

##### 那个一级偏移为什么是 `0`？

方法一：

我们通过第二关的方法找到的地址为 `037B2C80`（你的地址应该与我的不一样），然后在 `More Information` 中复制的地址为 `037B2C80`，用第一个地址（目标地址）减去第二个（基址的值）就是 `0`（这两个完全一样嘛...所以就是 `0`）

方法二：

`mov [edx],eax`，方括号中没有任何加减法操作，就是 `0`。

如果出现 `mov [edx+10],eax` ，就填 `10` 就行了，这里的 `10` 是 16 进制的 `10` 换成 10 进制就是 `16`。

如果出现 `[eax*2+edx+00000310]` 这种复杂的运算，这时就要看 `More Information` 下面的寄存器了，如果 `eax=4c`、`edx=00801234`，那么，应该搜索较大的一个数值，然后将较小的一个数值运算得到一级偏移的结果（另外，有乘法的一定是作为偏移存在的，基址的值一定不存在乘法），即搜索 `00801234` 找到基址，然后一级偏移为 `4c * 2 + 310 = 3a8`，这个为 16 进制运算，请使用 Windows 自带的计算器

x86 系列的指令集就是复杂，可以把好几条运算集成成一条指令。

##### 什么是指针

这个可以从C语言讲起（不过指针不是起源于C语言的哦），C语言最牛逼的东西就属指针啦，指针本身是一个 4 字节（32 位程序）或 8 字节（64 位程序）的整数，如果将其解释为一个整数，那么就是指向那块内存的地址。（注意，内存里的东西只是字节组成的数据，具体是什么含义要看代码是怎么解释，代码将其用作指针那就是指针，代码将其用作整数型变量那就是普通的整数型变量）

看下面这段C语言代码，代码中演示了如何对同一个地址以不同的方式解释。

```c
#include <stdio.h>
#include <stdlib.h>
int main()
{
    int *a = 0; // 定义指针
    a = (int *)malloc(4); // 分配内存
    *a = 1; // 令其等于1
    printf("%d\n", *a); // 输出指针a指向的值
    printf("0x%08x\n", (unsigned int)a); // 以整数型的方式读取a
    free(a); // 释放内存
    return 0;
}
```

x86 指令集支持指针这种东西，就是汇编语言中的方括号，`mov [edx],eax` 的意思就是把 eax 的值存到 edx 指向的地址中去，如果仅仅为 `mov edx,eax` 那么就仅仅是令 edx 等于 eax 了。

##### 基址

基址在程序每次启动时都不会变，因为他们的地址是直接写在代码中的，如果他们的地址变了，这个程序还怎么运行了？

### Step 7: Code Injection: (PW=013370)

> 第七关：代码注入
>
> 点一下 `Hit me` 减少 1 滴血。
>
> 你需要做的是：点一下 `Hit me` 改成加 `2` 滴血。

也不知道这句话我说了多少遍了，先用第二关的方法把血量的地址找到，然后添加到 `Cheat Table` 中。

再用第五关的方法找到写入这个地址的代码。

这回我们不 `Replace` 也不用点 `More Information`，我们点 `Show disassembler` 打开反汇编窗口。

选中这条语句，使用 `Tools` > `Auto Assemble`

![Step_07_01](/images/2018-01-26-cheat-engine-tutorial/Step_07_01.jpg)

Auto Assemble（自动汇编，简称AA）

![Step_07_02](/images/2018-01-26-cheat-engine-tutorial/Step_07_02.jpg)

选择 `Template` > `Code injection`

![Step_07_03](/images/2018-01-26-cheat-engine-tutorial/Step_07_03.jpg)

这个地址就是刚才在 Disassembler 中选择的那个地址，直接点 `OK` 即可。

模板提供了以下代码。

```asm
alloc(newmem,2048)
label(returnhere)
label(originalcode)
label(exit)

newmem: //this is allocated memory, you have read,write,execute access
//place your code here

originalcode:
sub dword ptr [ebx+00000478],01

exit:
jmp returnhere

"Tutorial-i386.exe"+255BD:
jmp newmem
nop
nop
returnhere:
```

把 `sub dword ptr [ebx+00000478],01` 改成 `add dword ptr [ebx+00000478],02` 就可以了。

原本这条代码是把 `[ebx+00000478]` 这个内存地址的数据减 1，把 `sub` 改成 `add` 就是加 1 了，再把 `01` 改成 `02` 就是加 2 了。

完整的代码就是

```asm
alloc(newmem,2048)
label(returnhere)
label(originalcode)
label(exit)

newmem: //this is allocated memory, you have read,write,execute access
//place your code here

originalcode:
add dword ptr [ebx+00000478],02

exit:
jmp returnhere

"Tutorial-i386.exe"+255BD:
jmp newmem
nop
nop
returnhere:
```

改完之后，点 `Execute` 就大功告成了。

![Step_07_04](/images/2018-01-26-cheat-engine-tutorial/Step_07_04.jpg)

![Step_07_05](/images/2018-01-26-cheat-engine-tutorial/Step_07_05.jpg)

![Step_07_06](/images/2018-01-26-cheat-engine-tutorial/Step_07_06.jpg)

点击 `Hit me` 然后就可以点击 `Next` 了。

这里有个更简单的方法，直接在反汇编窗口中把 `sub dword ptr [ebx+00000478],01` 中的 `01` 改成 `-02`。

![Step_07_07](/images/2018-01-26-cheat-engine-tutorial/Step_07_07.jpg)

#### Step 7 说明

`newmem:`、`originalcode:`、`exit:`、`"Tutorial-i386.exe"+255BD:`、`returnhere:` 这几个个东西虽然都有冒号，但是的用途是不一样的。

`newmem` 和 `"Tutorial-i386.exe"+255BD` 是具体的内存地址，他表示接下来所有指令将被写入这个内存地址。

`originalcode`、`exit` 和 `returnhere` 是标签，不占据字节，不占据指令，他表示一个暂时不知道的地址，仅仅用于跳转。

所以从 `newmem:` 到 `"Tutorial-i386.exe"+255BD:` 之间的指令都会写到新分配的地址中，`"Tutorial-i386.exe"+255BD:` 到结尾的指令都会覆盖原始指令（实现代码注入的效果）

而代码最前面的这四句，就是用来定义这些内存地址或标签的

```asm
alloc(newmem,2048) // 申请 2048 字节的内存，newmem 就是这个内存地址
label(returnhere) // 定义用于跳转的标签 returnhere
label(originalcode) // 定义用于跳转的标签 originalcode
label(exit) // 定义用于跳转的标签 exit
```

### Step 8: Multilevel pointers: (PW=525927)

> [Info]
>
> 第八关：多级指针
>
> 和第六关差不多，不过这次不是一级指针，而是4级指针，就是指向目标数值 的指针 的指针 的指针 的指针
>
> 你需要做的是：点击 `Change pointer`之后的 3 秒内 将新的数值锁定在 `5000`。

你懂的，先用第二关的方法把血量的地址找到，然后添加到 `Cheat Table` 中。再用第六关的方法搜索指针，不过这次你发现，搜索到的地址不是绿色的基址了，这就需要我们再继续搜索上一级指针。

![Step_08_01](/images/2018-01-26-cheat-engine-tutorial/Step_08_01.jpg)

将这个地址添加到下方，然后使用 `Find out what accesses this address`，注意是 `accesses` 而不是 `writes`。

![Step_08_02](/images/2018-01-26-cheat-engine-tutorial/Step_08_02.jpg)

然后点击 `Change value` 会收集到两条指令，`cmp` 指令跟指针没什么关系，对我们有用的是第二条指令 `mov esi,[esi]`。

![Step_08_03](/images/2018-01-26-cheat-engine-tutorial/Step_08_03.jpg)

不过问题来了，我们发现，这里提示的地址和上一次提示的地址是一样的，这是为什么呢？

CE 默认使用硬件断点的方式，断点只能停在指令执行之后，而这条指令正好是把 esi 原来指向的地址中的值再赋值给 esi，所以执行之后 esi 的值已经是被覆盖掉的值了，而我们想知道的恰恰是执行这条指令之前的 esi 值，那么怎么办呢。

方法一：秀操作

我们可以手动在当前指令的前一条指令下断点...（陈独秀同志，请你坐下）

方法二：动一动脑子

我们的 `Find out what accesses this address` 是干什么的？查找访问这个地址的指令，然后我们又发现了 `mov esi,[esi]` 这条指令访问了这个地址，那么 `[esi]` 原来是啥？原来的 esi 不就是这个我们监视的地址嘛。

所以直接搜索这个地址即可。

![Step_08_04](/images/2018-01-26-cheat-engine-tutorial/Step_08_04.jpg)

将这个地址添加到下方，然后使用 `Find out what accesses this address`，再来一遍。

![Step_08_05](/images/2018-01-26-cheat-engine-tutorial/Step_08_05.jpg)

和上一步一样，不在赘述。

![Step_08_06](/images/2018-01-26-cheat-engine-tutorial/Step_08_06.jpg)

不过这次我们搜索到了两个指针，用哪个呢？通常的话选第一个就可以了，不过这个也不一定，大不了再把第二个也试一下嘛。

真不巧，还真是第二个...

![Step_08_07](/images/2018-01-26-cheat-engine-tutorial/Step_08_07.jpg)

现在我们来整理一下

我们可以借用汇编语言的指针表示方法来表示一下我们需要的内存地址

`[[[["Tutorial-i386.exe"+1FD660]+0C]+14]+00]+18`

把基址（一级指针） `"Tutorial-i386.exe"+1FD660` 的值取出来，加上一级偏移 `0C`，当做地址，这是二级指针的地址，再把二级指针的值取出来，加上 `14`，这是三级指针的地址，依次类推。

然后就来手动添加地址

![Step_08_08](/images/2018-01-26-cheat-engine-tutorial/Step_08_08.jpg)

把刚添加的条目改成5000，然后锁定

![Step_08_09](/images/2018-01-26-cheat-engine-tutorial/Step_08_09.jpg)

点击 `Change pointer` 然后就可以点击 `Next` 了。

#### 注意

* 可以通过代码注入的方式通过此关。

* 上述过程中，除了对目标数值的地址使用 `Find writes`，其余都使用 `Find accesses`。其实，对目标数值的地址使用 `Find accesses` 也可以。

#### Pointer scan

如果你觉得这样就结束了的话，那你太低估 CE 的强大了。CE 内置了搜索指针的工具。

右键这个地址，选择 `Pointer scan for this address`

![Step_08_10](/images/2018-01-26-cheat-engine-tutorial/Step_08_10.jpg)

弹出的搜索设置提示框，通常使用默认配置即可。由于 Pointer 列表过于庞大，所以需要有一个保存的地方，这个自己随意保存。

![Step_08_11](/images/2018-01-26-cheat-engine-tutorial/Step_08_11.jpg)

点击确定开始搜索，可以发现有非常多的路径可以指向我们要找的地址，这时我们要做的就是 `Change pointer`，至于为什么请继续往下看。

我们重新找到目标地址，把这个地址复制下来，然后选择 `Pointer scan` 窗口中的菜单选项 `Pointer scanner` > `Rescan memory - removes pointers not pointing to the right address`

![Step_08_12](/images/2018-01-26-cheat-engine-tutorial/Step_08_12.jpg)

然后把新的地址填上就好了，点击 `OK` 就好了

![Step_08_13](/images/2018-01-26-cheat-engine-tutorial/Step_08_13.jpg)

![Step_08_14](/images/2018-01-26-cheat-engine-tutorial/Step_08_14.jpg)

只剩一个了，双击添加到地址列表，按原来的方法锁定为 `5000` 即可。

### Step 9: Shared code: (PW=31337157)

> [Info]
>
> 第9关：共享代码
>
> 有时候使敌人掉血的代码和使自己掉血的代码是同一个代码，单纯修改这个代码会使要么同时对自己和敌人有利，要么同时有害，而不是对自己有利，对敌人有害。
>
> 这一关重现了这样一种情况：己方初始血量很少，且被攻击一次掉血很多，敌方初始血量很多，且每次攻击只掉1滴血。
>
> 你需要做的是：不使用锁定，让己方不死，而敌方阵亡。
>
> 注意：生命值是 `Float` 类型。
>
> 注意：解决方案不唯一。

嗯，你懂得。先用第二关的方法把第一个人的血量的地址找到，然后添加到 `Cheat Table` 中。然后使用第七关的方法找出写入该地址的代码。

同理你可以把4个人的血量地址全找到，再查找写入该地址的代码，发现全都是同一条指令。

我们需要在代码注入时区分己方和敌方。

怎么办呢？来吧，找不同。

分别对四个血量进行 `Browse this memory region` 操作（可以使用快捷键 `Ctrl + B`）

![Step_09_01](/images/2018-01-26-cheat-engine-tutorial/Step_09_01.jpg)

对比一下吧

![Step_09_02](/images/2018-01-26-cheat-engine-tutorial/Step_09_02.jpg)

最明显的要数这个名字了，我们可以对比这个名字，如果是 `D` 或 `E` 开头，则是友军，不能让其掉血。如果是其他字母开头的话，则正常掉血。

当然，如果仔细看看，会发现数据中有队伍编号，对这个进行判断再简单不过了，如果是 `1` 则不掉血，否则掉血。

现在我们要进行代码注入了，`Tools` > `Auto Assemble`，然后 `Template` > `Code injection`。

```asm
alloc(newmem,2048)
label(returnhere)
label(originalcode)
label(exit)

newmem: //this is allocated memory, you have read,write,execute access
//place your code here

originalcode:
mov [ebx+04],eax
fldz 

exit:
jmp returnhere

"Tutorial-i386.exe"+265B7:
jmp newmem
returnhere:
```

原始代码是 `mov [ebx+04],eax`，意思就是，血量处于 `ebx+04` 的位置。我们再看 `Dave` 的血量地址 `04D9B22C` 和队伍编号地址 `04D9B238`，两者做个差值（16进制减法，可以用计算器算），应该是`0C`，如果血量是 `ebx+04`，那么队伍编号就应该是 `ebx+04+0C` 就是 `ebx+10` 了，我们需要在运行原来代码之前判断一下 `[ebx+10]` 是否等于 `1`。

最终完整代码如下（注释在代码中）：

```asm
alloc(newmem,2048)
label(returnhere)
label(originalcode)
label(no_decrese_health) // 在这里定义一个标签
label(exit)

newmem: //this is allocated memory, you have read,write,execute access
//place your code here
// 在这里添加代码
cmp [ebx+10], 1 // 判断 [ebx+10] 是否为 1
je no_decrese_health // 如果相等的话，则跳转到 no_decrese_health 标签

originalcode:
mov [ebx+04],eax
no_decrese_health: // 在这里使用这个标签
fldz 

exit:
jmp returnhere

"Tutorial-i386.exe"+265B7:
jmp newmem
returnhere:
```

当然也可以通过判断名字的方法来实现：

```asm
alloc(newmem,2048)
label(returnhere)
label(originalcode)
label(no_decrese_health) // 在这里定义一个标签
label(exit)

newmem: //this is allocated memory, you have read,write,execute access
//place your code here
// 在这里添加代码
cmp byte ptr [ebx+15], 44 // 判断 [ebx+15] 是否为 D
je no_decrese_health // 如果相等的话，则跳转到 no_decrese_health 标签
cmp byte ptr [ebx+15], 45 // 判断 [ebx+15] 是否为 E
je no_decrese_health // 如果相等的话，则跳转到 no_decrese_health 标签

originalcode:
mov [ebx+04],eax
no_decrese_health: // 在这里使用这个标签
fldz 

exit:
jmp returnhere

"Tutorial-i386.exe"+265B7:
jmp newmem
returnhere:
```

后来我想了想，还可以比较名字的第二位是否是小写，ASCII 怎么判断大小写？大写是 41 - 5A，小写是 61 - 7A，所以和 `60` 比较大小即可，所以中间判断的那部分可以这样写：

```
cmp byte ptr [ebx+16], 60 // 判断 [ebx+16] 和 'a' - 1
jg no_decrese_health // 如果大于的话，则跳转到 no_decrese_health 标签
```

点击 `Execute` 注入代码。然后点击 `Restart game and autoplay` ，可以看到己方存活，敌方两员大将死翘翘了，我们的 `Next` 可以点击了。

#### Step 9 说明

##### 为什么我们能在血量附近找到人物的其他一些属性？

通常人物属性是以结构体的方式存储的，在C语言中，结构体的所有信息就会储存在一块连续的内存中。

##### cmp 指令

`cmp` 就是比较左右两个数，不过要注意的是，比较队伍编号我用的是 `cmp [ebx+10], 1`，他编译之后是 `cmp dword ptr [ebx+10], 01`，而比较名字首字母的时候用的是 `cmp byte ptr [ebx+15], 44`。`cmp dword ptr` 比较指针指向地址处的 4 个字节而 `cmp byte ptr` 只比较 1 个字节。

### 完结撒花

![Step_10](/images/2018-01-26-cheat-engine-tutorial/Step_10.jpg)

## 附录

### 相关链接

* CE 官方网站：<https://cheatengine.org/>
* CE 官方中文翻译：<https://cheatengine.org/download/zh_CN.rar>
* GitHub 下载地址：<https://github.com/cheat-engine/cheat-engine/releases>
* CE 官方教程：<https://wiki.cheatengine.org/index.php?title=Tutorials>
* 反汇编的一些基本知识：<https://www.52pojie.cn/thread-434732-1-1.html>
