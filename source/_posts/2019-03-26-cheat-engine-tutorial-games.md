---
title: Cheat Engine 进阶教程 CE Tutorial Games
date: 2019-03-26 21:17:59
tag:
  - cheatengine
  - tutorial
  - disassemble
  - assemble
  - game
  - hack
  - memory
  - integrity
---

<!-- toc -->

## 注意事项

本文使用 [署名-非商业性使用-相同方式共享 4.0 国际 (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可证发布（可以参考 [此协议的中文翻译](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)）。您可以随意分享本文章的链接。全文转载的具体注意事项请阅读协议内容，转载的话最好在下面回帖告诉我一声。

我用的是本文起草时（2019 年 3 月 26 日）的最新版 `Cheat Engine 6.8.3`（在 2019 年 2 月 9 日发布的）

请尽量在看懂 [CE 教程：基础篇 CE Tutorial](https://www.52pojie.cn/thread-691615-1-1.html) 之后再来看本篇文章。

## 绪言

2018 年 6 月 8 日，Cheat Engine 6.8 发布，软件中新增了一个 Cheat Engine Tutorial Games。这个新的小游戏有 3 关，并不是特别难修改，但是却很有意思。因为它不再是之前的教学程序那种技能教学，而是一种有目的实战教学。

每一关目标只有一个，但办法是多种多样的。这篇文章尽可能利用不同方法来解决问题。重点不是修改这个小游戏，重点是理解其中的思路。

## 打开 CE Tutorial Games

菜单栏 → Help → Cheat Engine Tutorial Games

![Cheat Engine Tutorial Games](/images/2019-03-26-cheat-engine-tutorial-games/start-cheat-engine-tutorial-games.jpg)

## 第 1 关

![Step 1](/images/2019-03-26-cheat-engine-tutorial-games/step-1.jpg)

第 1 关：每 5 次射击你必须重新装填，在这个过程中目标会回复血量，尝试找到一种方法消灭目标。

> [Tips]
>
> 游戏中使用空格键射击。

### 第 1 关尝试 1

**有数字的时候肯定先尝试搜索数字**，毕竟这个是最方便快捷、最直观准确的方式。

右下角有个数字 `5`，新扫描，搜索 4 字节的精确数值 `5`。

射一发之后再搜索 `4`。

不知道你们搜索到没有，反正我是没有。

### 第 1 关尝试 2

我怀疑上一种方法有缺陷，可能子弹没撞到目标和撞到目标时，游戏的数据是两种状态。

我勾选了 `Pause the game while scanning`。

![扫描时暂停游戏](/images/2019-03-26-cheat-engine-tutorial-games/pause-the-game-while-scanning.jpg)

在子弹射出过程中搜索 `4`，结果发现还是不行。

### 第 1 关尝试 3

有时候游戏中显示的数字并不是内存中实际存储的数据，你看到的只是计算结果。

> [Info]
>
> 如果你学习过简单的编程知识，你应该了解堆内存和栈内存的区别
>
> 堆内存（这里的堆 Heap 与数据结构的堆 Heap 完全无关，这只是一种名称）通常是使用 `malloc` 函数分配的，一旦分配完仅用来存储某个确定结构、数组、对象，通常直到使用 `free` 释放之前都代表同一游戏数据。堆内存在传递的时候只会传递指针。
>
> 栈内存，栈内存是不断复用的，栈内存通常用作函数的局部变量、参数、返回值，函数调用时一层一层嵌套的，调用一个函数，栈就会增长一块，一个函数调用完返回了，栈就会缩短，下一个函数再调用，这块内存就会被重新使用。所以栈内存是会快速变化的，搜索到栈内存通常都没有什么意义。你应该听过 ESP 和 EBP，SP 就是 Stack Pointer，栈指针，描述栈顶在什么内存位置的寄存器。
>
> 这里有两篇扩展阅读（说实话我自己都没看）：[基于栈的内存分配 - 维基百科](https://en.wikipedia.org/wiki/Stack-based_memory_allocation)、[内存管理 动态内存分配 - 维基百科](https://en.wikipedia.org/wiki/Memory_management#Dynamic_memory_allocation)

我猜测他显示 `5` 的时候其实内存中是已发射 `0` 颗子弹。`5` 只是一个局部变量的计算结果，他在栈中只存在很短的一段时间，搜索是搜索不到的。

所以显示 `5` 的时候搜索 `0`，显示 `4` 的时候搜索 `1`。

![第 1 关弹药量](/images/2019-03-26-cheat-engine-tutorial-games/step-1-ammo.jpg)

> [Comment]
>
> 这个地址是在运行之后分配的，你的搜索结果可能和我不一样

把搜索结果添加到下方地址列表中，点击左侧的小方块锁定，这样就可以了。

> [Tips]
>
> 这个游戏中显示的是 `5` 而存储的是 `0`。类似的，某些游戏的货币可能都是 `10` 的倍数，比如 `500` 金币，内存中存储的可能就是 `50`，而不是显示的 `500`。例如：植物大战僵尸。

![第 1 关通关](/images/2019-03-26-cheat-engine-tutorial-games/step-1-clear.jpg)

### 第 1 关尝试 4

你以为这样就结束了吗？

这个游戏真的很有意思。你的最终目的是要打败敌人，那如果我直接把敌人就设置为 1 滴血，会怎么样呢？

血条没有具体数值，我们使用未知初始值（Unknown initial value）来搜索。

类型怎么选呢？血量这种东西一般我会先试试 Float（单精度浮点型），然后再试试 4 字节整数，如果不行的话再试试 8 字节和双精度浮点型，再不行的话就方案吧。

![第 1 关敌人血量](/images/2019-03-26-cheat-engine-tutorial-games/step-1-health.jpg)

这里搜索了好几次还剩几个结果，凭感觉应该是第一个，因为敌人回血回到满的时候，第一个数值恰好是 `100`。

直接把敌人血量改为 `1`，然后发射子弹。

> 一发入魂。

### 第 1 关尝试 5

找到刚才那两个内存地址之后，我们还可以尝试代码注入，但是由于第 1 关是在太简单了，没有必要这样大费周章请来代码注入这种复杂的东西，内存修改搞定就行。代码注入的应用在下一关会提到。

## 第 2 关

![第 2 关](/images/2019-03-26-cheat-engine-tutorial-games/step-2.jpg)

第 2 关：这两个敌人和你相比拥有更多的血量、造成更多的伤害。消灭他们。提示/警告：敌人和玩家是相关联的。

> [Tips]
>
> 游戏中使用左右方向键控制旋转，使用上方向键控制前进，使用空格键射击。

### 第 2 关尝试 1

敌人两个人一起打我们，每次要掉 4 滴血，我们总共才 100 滴血，而我们打敌人，每次大概就掉 1/100，而且对面还有两个人。

> 这谁顶得住啊！

我们直接搜自己的血量，把血量改成上千，然后激情对射。

> 来呀，互相伤害啊！

![第 2 关调高血量激情对射](/images/2019-03-26-cheat-engine-tutorial-games/step-2-fire-with-each-other.jpg)

然后...

### 第 2 关 Plus

![第 2 关 Plus](/images/2019-03-26-cheat-engine-tutorial-games/step-2-plus.jpg)

第 2 关加强：你将会为之付出代价！启动究极炸弹。3、2、1。

![第 2 关究极炸弹](/images/2019-03-26-cheat-engine-tutorial-games/step-2-mega-bomb.jpg)

> 啊！我死了。

![第 2 关死亡](/images/2019-03-26-cheat-engine-tutorial-games/step-2-death.jpg)

`9199` 血的我被炸到 `-1` 滴血。

### 第 2 关尝试 2

怎么办呢？

我们发现，我们的子弹飞行速度比较快，我可以先把两个人都打到只剩 1 滴血，然后杀掉其中一个，另一个会启动究极炸弹，这时我只需要一发小子弹就能把对面打死。

![第 2 关对面两个都残血](/images/2019-03-26-cheat-engine-tutorial-games/step-2-both-low-health.jpg)

然而。

![第 2 关对面两个都残血，杀掉其中一个](/images/2019-03-26-cheat-engine-tutorial-games/step-2-both-low-health-killed.jpg)

我太天真了。

对面另外一个虽然也残血，但是启动究极炸弹的时候能回血。

### 第 2 关尝试 3

肯定有人觉得麻烦了，你直接搜索敌人血量改成 1 不就得了，对面就算回血，就再改成 1。

![第 2 关敌人血量](/images/2019-03-26-cheat-engine-tutorial-games/step-2-enemies-health.jpg)

![第 2 关启动究极炸弹时回血](/images/2019-03-26-cheat-engine-tutorial-games/step-2-mega-bomb-health-restore.jpg)

果然，他又回到了 `21` 滴血，我再改成 `1` 滴血，然后开火。

![第 2 关通过](/images/2019-03-26-cheat-engine-tutorial-games/step-2-clear.jpg)

谁让他的炸弹飞的慢呢~

### 第 2 关尝试 4

这么赢得好像比较不保险，万一游戏作者把敌人导弹的速度调的比我们子弹快，那不就完蛋了。

我们来从根本上解决问题。

找出修改我们自己血量的指令，Find out what writes to this address。

![Find out what writes to this address](/images/2019-03-26-cheat-engine-tutorial-games/step-2-find-writes.jpg)

然后把这个语句替换成 NOP （No operation），原来修改血量的代码就会变成什么也不做。

![替换成 NOP](/images/2019-03-26-cheat-engine-tutorial-games/step-2-replace-with-nop.jpg)

再与敌人打几个回合，发现，我们不掉血了，但敌人也不掉血了。

> Tip/Warning: Enemy and player are related
>
> 提示/警告：敌人和玩家是相关联的。

这就是“共用代码”（Shared Code），敌人和我们减血的代码是共用的，不能简单地修改为 NOP，我们需要做一些判断。

### 第 2 关尝试 5

我们先把指令还原。

![还原指令](/images/2019-03-26-cheat-engine-tutorial-games/step-2-restore-with-original-code.jpg)

你可以分别对这三个地址使用 `Find out what writes to this address`，看看什么指令写入了这个地址，你应该会有所发现。

![三个地址写入的指令](/images/2019-03-26-cheat-engine-tutorial-games/step-2-3-writes-opcodes.jpg)

你可以看到，分别向这三个地址写的指令是同一条指令（指令地址相同，就是图中的 `10003F6A3`）。

既然这几个血量的修改是通过相同的代码，那么就表示玩家的数据存储方式和敌人的数据存储方式是相同的，至少血量都是在 `+60` 的位置存储。

我们的想法是：从储存玩家和敌人信息的结构体中找出一些差别，然后靠代码注入构造一个判断，如果是玩家自己的话则跳过，不扣血。

这里使用 `Dissect data/structures`。

![Dissect data/structures](/images/2019-03-26-cheat-engine-tutorial-games/step-2-dissect-data-structures.jpg)

里面默认已经有一个地址了，我们再额外添加两个地址。

![Add extra address](/images/2019-03-26-cheat-engine-tutorial-games/step-2-dissect-add-extra-address.jpg)

然后填入三个 `血量地址 - 60`，要注意这里需要减掉 `60`，因为 `+60` 之后的是血量地址，把这个 `60` 减掉才是结构体的开头。

![Dissect 开始地址](/images/2019-03-26-cheat-engine-tutorial-games/step-2-dissect-start-address.jpg)

![Dissect 结构大小](/images/2019-03-26-cheat-engine-tutorial-games/step-2-dissect-structure-size.jpg)

因为两个同类的结构肯定不能重叠，所以这里我可以算一下两个结构体的距离，一个结构体最大只有 160 字节，再大就会重叠了。

> [Tips]
>
> 通常情况下，两个结构体会相距比较远，你可以适当设置这个数值，比如设置一个 `1024` 甚至 `4096` 字节之类的，反正你觉得应该足够就行。

![解析之后的结构](/images/2019-03-26-cheat-engine-tutorial-games/step-2-dissect-structure.jpg)

我们的逻辑就是

```plain
if (*(p + 70) == 0) { // 0 表示是玩家自己
    // 什么也不干
} else {
    // 正常扣血
}
```

`Find out what writes to this address` → `Show disassembler` → `Tools` → `Auto Assemble` → `Template` → `Code injection`

![Code Inject](/images/2019-03-26-cheat-engine-tutorial-games/step-2-code-inject.gif)

这是自动生成的代码

```asm
alloc(newmem,2048,"gtutorial-x86_64.exe"+3F6A3)
label(returnhere)
label(originalcode)
label(exit)

newmem: //this is allocated memory, you have read,write,execute access
//place your code here

originalcode:
sub [rax+60],edx
ret
add [rax],al

exit:
jmp returnhere

"gtutorial-x86_64.exe"+3F6A03:
jmp newmem
nop
returnhere:
```

代码注入的原理就是把原来那个位置的指令换成 jmp，跳转到我们新申请的一块内存中，程序正常运行到这里就会跳转到我们新申请的那块内存中，然后执行我们的指令，我们自己写的指令的最后一条指令是跳转回原来的位置，这样程序中间就会多执行一段我们的指令了。

不过这里有一点问题，

```asm
originalcode:
sub [rax+60],edx
ret
add [rax],al
```

`ret` 语句之后是另外一个函数了，我们这样修改的话，如果有人调用那个函数就会出错，我们把注入点往前挪一下。

```asm
gtutorial-x86_64.exe+3F6A0 - 48 89 C8              - mov rax,rcx
gtutorial-x86_64.exe+3F6A3 - 29 50 60              - sub [rax+60],edx
gtutorial-x86_64.exe+3F6A6 - C3                    - ret
gtutorial-x86_64.exe+3F6A7 - 00 00                 - add [rax],al
```

重新生成一个 `Code injection`，注入点设置为上一条语句 `gtutorial-x86_64.exe+3F6A0`。

```asm
alloc(newmem,2048,gtutorial-x86_64.exe+3F6A0) 
label(returnhere)
label(originalcode)
label(exit)

newmem: //this is allocated memory, you have read,write,execute access
//place your code here

originalcode:
mov rax,rcx
sub [rax+60],edx

exit:
jmp returnhere

gtutorial-x86_64.exe+3F6A0:
jmp newmem
nop
returnhere:
```

其他部分不用动，我们直接在 `originalcode` 上修改

```asm
originalcode:
mov rax,rcx
cmp [rax+70],0
je exit // 如果等于 0，则表示玩家，跳到 exit，不执行下一条 sub 语句
sub [rax+60],edx

exit:
```

> [Tips]
>
> 双斜线后面是注释，删除掉也可以。

然后点击 `Execute`

我们可以简单修改一下，然后 `File` → `Assign to current cheat table`

```asm
[ENABLE]
alloc(newmem,2048,gtutorial-x86_64.exe+3F6A0)
label(returnhere)
label(originalcode)
label(exit)

newmem:

originalcode:
mov rax,rcx
cmp [rax+70],0
je exit
sub [rax+60],edx

exit:
jmp returnhere

gtutorial-x86_64.exe+3F6A0:
jmp newmem
nop
returnhere:

[DISABLE]
gtutorial-x86_64.exe+3F6A0:
mov rax,rcx
sub [rax+60],edx
```

![Assign to current cheat table](/images/2019-03-26-cheat-engine-tutorial-games/step-2-assign-to-current-cheat-table.jpg)

![开挂效果](/images/2019-03-26-cheat-engine-tutorial-games/step-2-invulnerable.gif)

### 第 2 关尝试 6

刚才的代码改的还不够好，我们可以像敌人的究极炸弹打我们一样，将敌人一击致命。

`originalcode` 部分修改成

```asm
originalcode:
mov rax,rcx
cmp [rax+70],0
je exit
mov edx,[rax+60]
sub [rax+60],edx
```

直接令 `edx` 等于敌人血量，然后敌人血量会被扣掉 `edx`，这样敌人直接就被秒了。

### 第 2 关尝试 7

不，第二关还没有结束，我们的还可以继续深入研究下去。

“扣血函数”是同一个的函数，但是调用“扣血函数”的地方肯定是不一样的。

我们可以找到调用他的位置。

我们在 `sub [rax+60],edx` 处下断点

```asm
gtutorial-x86_64.exe+3F6A0 - 48 89 C8              - mov rax,rcx
gtutorial-x86_64.exe+3F6A3 - 29 50 60              - sub [rax+60],edx
gtutorial-x86_64.exe+3F6A6 - C3                    - ret
```

发射一发子弹，等待他命中敌人或命中自己，断点会触发。

这个断点应该会触发 3 次，每次你需要观察一下右侧寄存器窗口中的 `rax` 的数值来判断这个代表扣谁的血。

![跟踪运行](/images/2019-03-26-cheat-engine-tutorial-games/step-2-trace.jpg)

然后跟着 `ret` 返回到他调用的位置，上一条语句一定是 `call`。

玩家扣血前后的代码

```asm
gtutorial-x86_64.exe+3DFB8 - E8 E3160000           - call gtutorial-x86_64.exe+3F6A0
gtutorial-x86_64.exe+3DFBD - 48 8B 4B 28           - mov rcx,[rbx+28]
```

单步执行返回之后指针停留在 `gtutorial-x86_64.exe+3DFBD`，前一条一定是一个 `call` 指令，就是 `call gtutorial-x86_64.exe+3F6A0`。

`gtutorial-x86_64.exe+3F6A0` 这个地址就是之前那个扣血函数。

```asm
gtutorial-x86_64.exe+3F6A0 - 48 89 C8              - mov rax,rcx
gtutorial-x86_64.exe+3F6A3 - 29 50 60              - sub [rax+60],edx
gtutorial-x86_64.exe+3F6A6 - C3                    - ret
```

同理可以知道敌人被打中时扣血的代码

左侧敌人扣血代码

```asm
gtutorial-x86_64.exe+3E0ED - E8 AE150000           - call gtutorial-x86_64.exe+3F6A0
```

右侧敌人扣血代码

```asm
gtutorial-x86_64.exe+3E1D6 - E8 C5140000           - call gtutorial-x86_64.exe+3F6A0
```

这个游戏很有意思，命中敌人和命中玩家使用的是不同的代码，仅仅扣血使用的是相同的代码。

> [Comment]
>
> 这就是传说中的面向复制粘贴型编程。

既然他们使用的是不同的代码，这个 `fastcall` 由没有影响栈平衡，那么我可以直接把 `gtutorial-x86_64.exe+3DFB8` 这一行用 NOP 替换掉。

![Replace code that does nothing](/images/2019-03-26-cheat-engine-tutorial-games/step-2-replace-with-code-that-does-nothing.jpg)

> [Tips]
>
> `ret` 语句的作用是返回调用处，`call` 的时候会往栈顶压一个返回之后应该执行的地址。
>
> 简单一个 `ret` 语句就是跳回栈顶那个地址的位置，然后再把栈顶那个地址弹出
>
> 也有 `ret 8` 这样的语句，就是先从栈中弹出 8 个字节（相当于 `add esp,8`），然后再执行返回。之所以这样所是因为调用这个函数之前，往栈中压入了 8 个字节的参数（比如两个 4 字节整数），函数返回之前必须恢复栈平衡。
>
> `gtutorial-x86_64.exe+3F6A6` 这个 `ret` 语句，后面没有参数，应该不会影响栈平衡。

现在也可以让敌人打我们不掉血，我们打敌人正常掉血了。

### 第 2 关尝试 8

现在来分析一下 `gtutorial-x86_64.exe+3F6A0` 这个扣血函数，这个函数总共就 3 条指令，函数有 2 个参数，分别是 `rcx` 和 `edx`，`rcx` 为结构体的指针，`edx` 为扣血的数量，没有返回值。

> [Info]
>
> 这种用寄存器传递参数来调用函数方法是典型的 `fastcall`。

我们需要分析一下 `call` 之前是什么确定了 `edx` 的值。

以玩家扣血为例，我们需要看 `call` 之前的几行代码。

```asm
gtutorial-x86_64.exe+3DF98 - FF 90 28010000        - call qword ptr [rax+00000128]
gtutorial-x86_64.exe+3DF9E - 84 C0                 - test al,al
gtutorial-x86_64.exe+3DFA0 - 0F84 D0000000         - je gtutorial-x86_64.exe+3E076
gtutorial-x86_64.exe+3DFA6 - 48 8B 53 40           - mov rdx,[rbx+40]
gtutorial-x86_64.exe+3DFAA - 49 63 C4              - movsxd  rax,r12d
gtutorial-x86_64.exe+3DFAD - 48 8B 04 C2           - mov rax,[rdx+rax*8]
gtutorial-x86_64.exe+3DFB1 - 8B 50 70              - mov edx,[rax+70]
gtutorial-x86_64.exe+3DFB4 - 48 8B 4B 28           - mov rcx,[rbx+28]
gtutorial-x86_64.exe+3DFB8 - E8 E3160000           - call gtutorial-x86_64.exe+3F6A0
```

在 `call qword ptr [rax+00000128]` 处下断点，然后回到游戏中发射子弹。会发现，刚一发射子弹立刻就断下来了。我猜测这里应该是碰撞检测，然后下面的 `test` 和 `je` 来做判断，如果碰撞上了，则执行扣血函数，没撞上则直接跳过这部分代码，不扣血。

怎么验证一下呢？把 `je` 改成 `jne`，看看是不是子弹没撞上的时候就直接扣血了。

修改以后的确是这样的，而且之前是一次掉 `4` 滴血，现在连自己的子弹都会把自己打掉血，一次会掉 `5` 滴血。

把这里 `je` 改成 `jmp` 即可。CE 会提示原来指令是 6 字节，新指令是 5 字节，是否用 NOP 填充多余的，选是就行了。

现在子弹会从我们上方飞过，而不与我们产生碰撞，而敌人却依然会中弹。

### 第 2 关尝试 9

尝试 5 中的分块数据中可以看到一个 `+34` 是敌人角度，我们可以让敌人不对准我们。

手动添加地址 `[[["gtutorial-x86_64.exe"+37DC50]+760]+30]+34`（左侧敌人角度），Float 类型（单精度浮点型）。

我们尝试把它修改成其他数值，但是他还会实时被游戏修改回指向玩家。

搜索写入这些数值的指令，然后 NOP 掉，这样游戏就不会修改他们的数值了，我们从外部的修改就成功了。

![锁定敌人发射方向](/images/2019-03-26-cheat-engine-tutorial-games/step-2-lock-enemy-direction.jpg)

但是，最后的究极炸弹似乎是跟踪导弹啊。

![跟踪导弹](/images/2019-03-26-cheat-engine-tutorial-games/step-2-mega-bomb-tracking.jpg)

我需要想个办法。

### 第 2 关尝试 10

尝试 5 中的扣血函数，我们下断点之后知道 `edx = 2`，这里的 `edx` 是扣血量。

```asm
gtutorial-x86_64.exe+3F6A3 - 29 50 60              - sub [rax+60],edx
```

我们再看函数调用处

```asm
gtutorial-x86_64.exe+3DFB1 - 8B 50 70              - mov edx,[rax+70]
```

这个 `edx` 是来自于 `[rax+70]` 的，我们下个断点之后我们从寄存器中知道了子弹强度的地址，然后使用通用的找基址偏移的方法找到地址。

![从寄存器中得到子弹地址](/images/2019-03-26-cheat-engine-tutorial-games/step-2-bullet-address.jpg)

他的前一行。

```asm
gtutorial-x86_64.exe+3DFAD - 48 8B 04 C2           - mov rax,[rdx+rax*8]
```

遇到 `[rdx+rax*8]` 通常就是个动态数组，`rdx` 就是数组头部地址，`rax` 就是元素下标，64 位寻址内存对齐下，两个变量地址相差 `8`。

子弹数组强度的地址为 `[[[["gtutorial-x86_64.exe"+37DC50]+760]+40]+rax*8]+70`。

然后我可以把敌人那发究极炸弹的威力改成 `1`。

![没有威力的究极炸弹](/images/2019-03-26-cheat-engine-tutorial-games/step-2-mega-bomb-low-damage.gif)

> 雷声大雨点小。

> 跟挠痒痒一样。

注意动画中，我使用 `Adavanced Options` → 暂停，把游戏暂停住了。这样避免了我操作时间不够，导致炸弹直接把我打死了。

![不让子弹移动](/images/2019-03-26-cheat-engine-tutorial-games/step-2-frozen-bullet.jpg)

当然我也可以把我的子弹改成超级大的威力，让我一下把它打死。

### 第 2 关尝试 11

我还可以直接锁住子弹的坐标，然后不让他接近我。

使用 `Dissect data/structures`。

我们射出一发子弹，然后暂停游戏。然后根据屏幕中的 3 颗子弹，大致分析一下这些地址的参数。

注意子弹强度是 `+70`，所以我们填入 Structure dissect 中的地址应该是子弹强度地址 `-70`。

我们找到了子弹的 X 坐标和 Y 坐标，将他们锁定就可以让子弹无法靠近我。

![子弹不能移动](/images/2019-03-26-cheat-engine-tutorial-games/step-2-bullet-cannot-move.gif)

## 第 3 关

![第 3 关](/images/2019-03-26-cheat-engine-tutorial-games/step-3.jpg)

第 3 关：把每个平台标记为绿色可以解锁那扇门。注意：敌人会将你一击致命（然后就失败了）玩的愉快！提示：有很多解决方案。比如：找到与敌人的碰撞检测，或者 Teleport（传送），或者飞行，或者...

### 第 3 关尝试 1

看样子，不开挂也能过啊。

### 第 3 关 Plus

> 看来我还是 too young, too naïve.

![第 3 关 Plus](/images/2019-03-26-cheat-engine-tutorial-games/step-3-plus.jpg)

第 3 关加强：门虽然解锁了，但是敌人把门堵住了。

### 第 3 关尝试 2

最简单的就是搜索人物坐标了。把人物直接改到门那里，不用“通过”敌人，而是直接瞬移过去。

计算机中，2D 游戏一般是左负、右正，上下的正负不一定。3D 游戏一般高度方向上正、下负，东西南北的正负不一定。

> [Info]
>
> 2D 游戏，如果使用计算机绘图的坐标系则是下正、上负，如果使用数学中的坐标则是上正、下负。
>
> ![绘图窗口坐标](/images/2019-03-26-cheat-engine-tutorial-games/graphics-window-coordinates.png)
>
> [图片来源页](https://social.technet.microsoft.com/wiki/contents/articles/16391.the-developers-reference-guide-to-small-basic-chapter-5-graphicswindow-object.aspx)
>
> ![笛卡尔坐标系](/images/2019-03-26-cheat-engine-tutorial-games/cartesian-coordinate-system.png)
>
> [图片来源页](https://en.wikipedia.org/wiki/Coordinate_system)
>
> 3D 游戏也有两种坐标系。一种是向上为 y 轴（这是沿袭 2D 坐标的惯例），然后一般是向右为 x，向屏幕外为 z（也有向屏幕内为 z 的）。另一种则是向上为 z，水平面中向北为 y，向东为 x。

搜索 Float（单精度浮点型）未知初始值，然后向右移动人物，搜索增大了的数值，然后向左移动人物，搜索减小了的数值，反复几次，你应该能看到剩下一个唯一的数值。过程中还可以不移动人物，搜索未改变的数值。

> [Tips]
>
> 你可以在设置中给常用搜索功能添加快捷键。这样不用切出游戏就可以进行下一次扫描了。
>
> ![搜索快捷键](/images/2019-03-26-cheat-engine-tutorial-games/step-3-search-hotkey.jpg)

添加到地址列表中，然后改名为“X 坐标”。然后复制粘贴，修改地址，把地址 `+4` 即为 Y 坐标。

> [Info]
>
> 这里 `+4` 还是 `-4` 主要看内存中的排列方式。一般 X 排在 Y 前面，所以要 `+4`。对于 3D 游戏，你搜索高度可能搜到的是 Y 也可能是 Z，你可以使用右键 → `Browse this memory region`，然后右键 → `Display Type` → `Float` 来看看前后的内存数据，然后在游戏中移动一下，凭感觉决定 X、Y、Z。
>
> ![Browse this memory region](/images/2019-03-26-cheat-engine-tutorial-games/step-3-browse-this-memory-region.jpg)
>
> ![Display Type Float](/images/2019-03-26-cheat-engine-tutorial-games/step-3-display-type-float.jpg)

移动一下人物，大概估计一下坐标的范围，整个游戏区域对应的 X 和 Y 是 `-1` 到 `1` 直接的值。估计一下门的 X 坐标，把 X 坐标改成 `0.97`。

### Well Done

![Well Done!](/images/2019-03-26-cheat-engine-tutorial-games/well-done.jpg)

你战胜了全部三个游戏，干得漂亮！

### 第 3 关尝试 3

上面的方法很简单也很实用，不过我们还可以继续“玩”这个游戏。

我们可不可以直接把所有的平台都改成绿色呢？

因为每个平台只有两种状态，而且只能从红变成绿，这样很不利于搜索，而且我也不知道他是怎么存储的，不知道红和绿两个状态的值都是多少。

这个我尝试了很多种办法，例如：

1. 红的时候搜 `0`，绿的时候搜 `1`，然后撞敌人撞死，再搜 `0`。

2. 红的时候搜未知初始值，绿的时候搜改变了的数值，然后撞敌人撞死，再搜改变了的数值。

3. 把类型改为 `Byte`（单字节类型），因为 bool 类型都是占用 1 字节的。

4. 其实我还怀疑是不是每次撞死都会重新申请内存，这样就更麻烦了。

最后，我使用“红的时候搜 Byte 类型未知初始值，绿的时候搜改变了的数值，然后撞敌人撞死，再搜改变了的数值”的方法找到了一点线索。虽然没有找到具体的数据存储地址，但是我找到了绝对相关的一组数据。这组数据每次颜色转换都会相应的来回改变。

![与颜色有关的内存地址](/images/2019-03-26-cheat-engine-tutorial-games/step-3-color-related-memory.jpg)

虽然没有找到具体与台阶有关的数值，但是注意图中 `015F1AD8` 这个值，他的含义似乎是已经点亮的平台的数量

我直接把这个数字改成 `12` 的话，虽然没有让所有的平台都变绿，但是依然触发“门解锁、敌人堵门”这一事件了。

我突然有个想法，就是我直接站在门上，然后把数值修改为 `12`，我已经在门上了，敌人就堵不到我了。

结果真的可以。

![把已变绿平台数直接修改为 12](/images/2019-03-26-cheat-engine-tutorial-games/step-3-set-finished-number-of-platforms.gif)

### 第 3 关尝试 4

`4BFEEB60` 那些 `255` 和 `204` 看样子像是 RGB 值。如果我手动添加 `4BFEEB60` 类型设为 4 字节，显示十六进制值。结果就是 `FF00FF00`，4 个字节分别是 ARGB，就是不透明的绿色。红色的平台则是 `FFCC0000`，不透明的暗红色。

![颜色显示 16 进制值](/images/2019-03-26-cheat-engine-tutorial-games/step-3-color-show-hexadecimal.jpg)

但是这些数值改了也没什么用，应该就是每一像素的颜色。

上面那个 `015ABE78`，手动添加这个地址，并设置成 Float 类型的话，就会发现，红色的时候是 `0.8`，绿色的时候是 `0`。同理 `015ABE7C`，红色的时候是 `0`，绿色的时候是 `1`。

把这两个数值改成其他的，你会发现平台的颜色也变了。

![修改 RGB 值](/images/2019-03-26-cheat-engine-tutorial-games/step-3-change-rgb.jpg)

我又发现一个有趣的现象，如果我把平台的颜色锁定为红色，然后让人物站上去，这时“已变绿平台数”那个计数器会快速增长。所以你有什么想法？

这就是为什么我找不到一个 bool 型变量来描述平台是否变绿，因为他的代码根本没有这样一个变量，他的逻辑应该大致是这样的。

```c
if (collision) {
    R = 0;
    if (G != 1) {
        count++;
        G = 1;
    }
}
```

如果站到平台上了，则令红色为 `0`，如果绿色不为 `1`，则计数器 `+1`，并令绿色为 `1`。

这里面没有出现 flag 这种东西来表示平台是否变绿色，他直接用颜色来判断的。

### 第 3 关尝试 5

> 找到与敌人的碰撞检测，或者 Teleport（传送），或者飞行，或者...

关卡说明中告诉里一部分思路，TP 已经试过了，现在我们来试试飞行。

所谓的飞行其实就是把重力改小，或者是像玩 Flappy Bird 那样一跳一跳的，可以一直在天上飞着。

首先来找到重力大小。

重力会影响速度，速度影响坐标，我们现在只知道坐标的地址，我们可以通过查找写入，然后分析附近代码来找到速度，然后进而找到重力加速度。

> [Info]
>
> y = y_0 + v_y * t

计算位置需要先读取 Y 坐标 `y_0`，然后加上速度差，在赋值给 `y`。

这里有个小技巧，就是对同一个地址同时使用查找写入和查找访问，这样我们很容易地找到了写入的地址，然后在查找访问窗口中，写入地址以前的几个读取都很可疑。

![访问位置的指令](/images/2019-03-26-cheat-engine-tutorial-games/step-3-access-position-opcodes.jpg)

第二条写入指令，在跳起来悬空的时候，计数器不会增加，应该是当人物接触到地面的时候，防止人物穿过地面用的。我们只看第一条。

Show disassembler，我把 `gtutorial-x86_64.exe+40491` 到 `gtutorial-x86_64.exe+40506` 截取出来。

```asm
gtutorial-x86_64.exe+4048D - 48 8B 43 28           - mov rax,[rbx+28]
gtutorial-x86_64.exe+40491 - F3 44 0F10 40 28      - movss xmm8,[rax+28] { 读取 Y 坐标 }
gtutorial-x86_64.exe+40497 - 48 8B 43 28           - mov rax,[rbx+28]
gtutorial-x86_64.exe+4049B - F3 0F5A 48 28         - cvtss2sd xmm1,[rax+28] { 再次读取 Y 坐标 }
gtutorial-x86_64.exe+404A0 - F3 0F5A 53 78         - cvtss2sd xmm2,[rbx+78] { 读取 Y 速度 }
gtutorial-x86_64.exe+404A5 - F2 0F2A C6            - cvtsi2sd xmm0,esi { esi 是毫秒数 }
gtutorial-x86_64.exe+404A9 - F2 0F5E 05 AF382400   - divsd xmm0,[gtutorial-x86_64.exe+283D60] { 除以 1000 }
gtutorial-x86_64.exe+404B1 - F2 0F59 C2            - mulsd xmm0,xmm2 { 速度乘时间 }
gtutorial-x86_64.exe+404B5 - F2 0F5C C8            - subsd xmm1,xmm0 { Y 坐标减去位移 }
gtutorial-x86_64.exe+404B9 - F2 44 0F5A C9         - cvtsd2ss xmm9,xmm1 { double 转 float }

......

gtutorial-x86_64.exe+40506 - F3 44 0F11 48 28      - movss [rax+28],xmm9 { 赋值给 [rax+28] }
```

> [Comment]
>
> 注释是我自己加的。这个是根据逻辑和感觉猜出来的，也有可能猜错。不过这个简单的速度位移公式，一般来说分析应该是正确的。

注意这几条

```asm
gtutorial-x86_64.exe+40497 - 48 8B 43 28           - mov rax,[rbx+28]
gtutorial-x86_64.exe+4049B - F3 0F5A 48 28         - cvtss2sd xmm1,[rax+28] { 再次读取 Y 坐标 }
gtutorial-x86_64.exe+404A0 - F3 0F5A 53 78         - cvtss2sd xmm2,[rbx+78] { 读取 Y 速度 }
```

Y 坐标的内存地址是 `[[["gtutorial-x86_64.exe"+37DC50]+760]+28]+24`，`rbx` 应该是一级指针的值 `[["gtutorial-x86_64.exe"+37DC50]+760]`，那么 Y 速度的地址应该就是 `[["gtutorial-x86_64.exe"+37DC50]+760]+78`。

手动添加 Y 速度的地址，然后把速度改成 `3`，你会发现人物跳了起来。

![修改热键](/images/2019-03-26-cheat-engine-tutorial-games/step-3-change-hotkeys.jpg)

刚才设成 `3` 跳的有点高，添加一个上箭头的热键，设置值为 `1`。如果长按的话就会匀速向上飞。

![修改热键](/images/2019-03-26-cheat-engine-tutorial-games/step-3-change-hotkeys-2.jpg)

### 第 3 关尝试 6

刚才改速度已经成功了，现在我们来改重力加速度。

还是查找写入。

![写入速度的指令](/images/2019-03-26-cheat-engine-tutorial-games/step-3-velocity-write-opcodes.jpg)

* 第 1 个在脱离地面之后不计数，应该是地面支撑
* 第 2 个随时都会触发，应该是重力加速度导致的
* 第 3 个是起跳时触发
* 第 4 个则是长按跳跃连跳时触发

我突然有个想法，起跳时触发的那条语句，一定有什么限制他，让他只能在地面上起跳，而不能在空中起跳。

Show disassembler.

```asm
gtutorial-x86_64.exe+3FE9A - C6 43 74 01           - mov byte ptr [rbx+74],01 { 1 }
gtutorial-x86_64.exe+3FE9E - 80 7B 7C 00           - cmp byte ptr [rbx+7C],00 { 0 }
gtutorial-x86_64.exe+3FEA2 - 0F85 93000000         - jne gtutorial-x86_64.exe+3FF3B
gtutorial-x86_64.exe+3FEA8 - 8B 05 823E2400        - mov eax,[gtutorial-x86_64.exe+283D30] { (1.45) }
gtutorial-x86_64.exe+3FEAE - 89 43 78              - mov [rbx+78],eax
```

经过分析和猜测，`[rbx+74]` 表示是否按下跳跃键，`[rbx+7C]` 表示是否悬空。

`jne` 表示如果悬空则不允许跳。

直接把 `jne` 那条语句 NOP 掉，就可以实现无限连跳了。刚才设置的热键都用不着了。

你也尝试可以修改 `gtutorial-x86_64.exe+283D30` 这个地址的数值，它表示跳跃初速度。

上面的方法修改之后，长按不会一直向上飞，必须像 Flappy Bird 一样一下一下的。如果你想长按就一直向上飞，那就把第 4 条指令前面的 `jne` 也 NOP 掉。

```asm
gtutorial-x86_64.exe+406F8 - 80 7B 7C 00           - cmp byte ptr [rbx+7C],00 { 0 }
gtutorial-x86_64.exe+406FC - 75 0B                 - jne gtutorial-x86_64.exe+40709
gtutorial-x86_64.exe+406FE - 8B 05 2C362400        - mov eax,[gtutorial-x86_64.exe+283D30] { (1.45) }
gtutorial-x86_64.exe+40704 - 89 43 78              - mov [rbx+78],eax
```

### 第 3 关尝试 7

刚才跑题了，我们继续来找重力加速度

> [Info]
>
> v = v_0 + g * t

分析一下第 2 个指令附近

```asm
gtutorial-x86_64.exe+40709 - F3 0F5A 43 78         - cvtss2sd xmm0,[rbx+78] { 读取速度 }
gtutorial-x86_64.exe+4070E - F2 0F5C 05 52362400   - subsd xmm0,[gtutorial-x86_64.exe+283D68] { 减去 0.1 }
gtutorial-x86_64.exe+40716 - F2 0F5A C0            - cvtsd2ss xmm0,xmm0 { double 转 float }
gtutorial-x86_64.exe+4071A - F3 0F11 43 78         - movss [rbx+78],xmm0 { 写入速度 }
```

这个逻辑好简单啊，与时间都无关，就是每次计算把 Y 速度减 0.1。

手动添加地址 `gtutorial-x86_64.exe+283D68`，类型为 double，然后把重力加速度调小就行了。

### 第 3 关尝试 8

我们还有什么办法？我可不可以把敌人固定住，让他不要移动，或者移到屏幕外，总之让他别妨碍我们就行了。

用同样搜索自己坐标的方法搜索敌人的坐标。只不过自己的坐标可以自己控制，敌人的坐标只能随他们移动了。

找到 3 个 X 坐标之后 `+4` 就是 Y 坐标。

把这些坐标锁定，可行。把已变绿平台数改成 `12`，这些敌人又不听话了，又开始堵门了，锁定似乎对他们不好使。

查找写入他们的指令

![写入敌人位置的指令](/images/2019-03-26-cheat-engine-tutorial-games/step-3-enemy-position-write-opcodes.jpg)

既然他堵住门时会一直触发第 5 条，那么我就简单粗暴一点，直接把第 5 条指令 NOP 掉，这样我就可以从外部修改这个数值了。

![敌人离开门口](/images/2019-03-26-cheat-engine-tutorial-games/step-3-get-away-from-the-door.jpg)

### 第 3 关尝试 9

我们还可以想办法直接开门。

查找访问“已变绿平台数”的指令。

只有这一条

```asm
gtutorial-x86_64.exe+4098B - 48 63 93 88000000     - movsxd  rdx,dword ptr [rbx+00000088]
```

我们分析一下附近

```asm
gtutorial-x86_64.exe+4098B - 48 63 93 88000000     - movsxd  rdx,dword ptr [rbx+00000088] { 读取已变绿平台数 }
gtutorial-x86_64.exe+40992 - 48 8B 43 30           - mov rax,[rbx+30]
gtutorial-x86_64.exe+40996 - 48 85 C0              - test rax,rax
gtutorial-x86_64.exe+40999 - 74 08                 - je gtutorial-x86_64.exe+409A3
gtutorial-x86_64.exe+4099B - 48 8B 40 F8           - mov rax,[rax-08] { [rax-08] 为平台数组最大下标 }
gtutorial-x86_64.exe+4099F - 48 83 C0 01           - add rax,01 { 最大下标 + 1 即为总平台数 }
gtutorial-x86_64.exe+409A3 - 48 39 C2              - cmp rdx,rax { 比较已变绿平台数和总平台数 }
gtutorial-x86_64.exe+409A6 - 7C 17                 - jl gtutorial-x86_64.exe+409BF
gtutorial-x86_64.exe+409A8 - 48 8B 43 60           - mov rax,[rbx+60] { 二级指针 }
gtutorial-x86_64.exe+409AC - C6 40 18 00           - mov byte ptr [rax+18],00 { 开门 }
gtutorial-x86_64.exe+409B0 - C6 43 7D 01           - mov byte ptr [rbx+7D],01 { 堵门 }
gtutorial-x86_64.exe+409B4 - 48 8B 43 68           - mov rax,[rbx+68]
gtutorial-x86_64.exe+409B8 - 48 89 83 80000000     - mov [rbx+00000080],rax
gtutorial-x86_64.exe+409BF - 48 83 7B 28 00        - cmp qword ptr [rbx+28],00 { 0 }
```

`[rbx+00000088]` 为已变绿平台数，而已变绿平台数的地址为 `[["gtutorial-x86_64.exe"+37DC50]+760]+88`，所以 `rbx = [["gtutorial-x86_64.exe"+37DC50]+760]`，

所以可以求得开门地址为 `[[["gtutorial-x86_64.exe"+37DC50]+760]+60]+18`，堵门的地址为 `[["gtutorial-x86_64.exe"+37DC50]+760]+7D`。

我们直接执行 `mov byte ptr [rax+18],00` 这条开门语句的内容就行了。手动添加开门地址，Byte 类型，然后修改为 `0`。这样我们躲过敌人就可以进门了，不用让平台变绿，也不会被堵住。

![直接开门](/images/2019-03-26-cheat-engine-tutorial-games/step-3-open-the-door-directly.gif)

请注意上面动画中，修改完数值之后右下角门的变化。

### 第 3 关尝试 10

终于要到碰撞检测了。第 2 关中，我们让子弹直接忽略玩家，继续向前飞。第 3 关我们也可以让敌人忽略玩家，即使碰到了也不会死亡。

碰撞检测肯定会读取二者的 X、Y 坐标。查找访问敌人 Y 坐标的指令。

最开始只看到 1 条指令。

```asm
gtutorial-x86_64.exe+39DDE - F3 0F10 4B 28         - movss xmm1,[rbx+28]
```

但是查看附近代码的时候我看到 `call qword ptr [gtutorial-x86_64.exe+3825E0] { ->opengl32.glTranslatef }`

```asm
gtutorial-x86_64.exe+39DDE - F3 0F10 4B 28         - movss xmm1,[rbx+28]
gtutorial-x86_64.exe+39DE3 - F3 0F10 05 7D7F2400   - movss xmm0,[gtutorial-x86_64.exe+281D68] { (0.00) }
gtutorial-x86_64.exe+39DEB - 0F57 C8               - xorps xmm1,xmm0
gtutorial-x86_64.exe+39DEE - F3 0F10 43 24         - movss xmm0,[rbx+24]
gtutorial-x86_64.exe+39DF3 - F3 0F10 15 757F2400   - movss xmm2,[gtutorial-x86_64.exe+281D70] { (0.00) }
gtutorial-x86_64.exe+39DFB - FF 15 DF873400        - call qword ptr [gtutorial-x86_64.exe+3825E0] { ->opengl32.glTranslatef }
```

所以这个应该是在绘图指令前读取 Y 坐标，这个应该不是碰撞检测的代码。

我怀疑是不是碰撞检测和其他代码混在一起，所以只有一次读取。我沿着这个附近单步调试了很长时间。

终于，一次不经意间我发现问题了。请观察下面的动图。

![访问左下敌人 Y 坐标的指令](/images/2019-03-26-cheat-engine-tutorial-games/step-3-enemy-y-access-opcodes.gif)

原始的代码很可能是这样的。

```c
float player_w_2 = player_w / 2.0f;
float enemy_w_2 = enemy_w / 2.0f;
if (enemy_x - enemy_w_2 < player_x + player_w_2 && player_x - player_w_2 < enemy_x + enemy_w_2) {
    float player_h_2 = player_h / 2.0f;
    float enemy_h_2 = enemy_h / 2.0f;
    if (enemy_y - enemy_h_2 < player_y + player_h_2 && player_y - player_h_2 < enemy_y + enemy_h_2) {
        // 碰撞
    }
}
```

逻辑短路。如果 X 坐标不在敌人宽度范围内，那么直接就不用判断 Y 坐标了，就不会对 Y 坐标造成访问。

解决这个问题之后，我们又找到这条语句。

```asm
gtutorial-x86_64.exe+39B45 - F3 0F10 43 28         - movss xmm0,[rbx+28]
```

在周围分析一下。

```asm
gtutorial-x86_64.exe+39B26 - FF 90 E0000000        - call qword ptr [rax+000000E0] { movss xmm0,[100284490]
                                                                                     xmm0 = 0.1 }
gtutorial-x86_64.exe+39B2C - F3 0F10 4E 30         - movss xmm1,[rsi+30]
gtutorial-x86_64.exe+39B31 - F3 0F58 0D 1F822400   - addss xmm1,dword ptr [gtutorial-x86_64.exe+281D58] { (1.00) }
gtutorial-x86_64.exe+39B39 - F3 0F59 0D 1F822400   - mulss xmm1,[gtutorial-x86_64.exe+281D60] { (0.50) }
gtutorial-x86_64.exe+39B41 - F3 0F59 C8            - mulss xmm1,xmm0 { xmm1 = 0.5 * 0.1 }
gtutorial-x86_64.exe+39B45 - F3 0F10 43 28         - movss xmm0,[rbx+28] { 读取敌人 Y 坐标 }
gtutorial-x86_64.exe+39B4A - F3 0F5C C1            - subss xmm0,xmm1 { 减掉敌人高度的一半 }

......

gtutorial-x86_64.exe+39B56 - C3                    - ret
```

跟踪这个函数的返回，你会发现一片新天地。

```asm
gtutorial-x86_64.exe+3A72E - 48 89 CB              - mov rbx,rcx { rbx 为敌人指针 }
gtutorial-x86_64.exe+3A731 - 48 89 D6              - mov rsi,rdx
gtutorial-x86_64.exe+3A734 - 40 B7 00              - mov dil,00 { 0 }
gtutorial-x86_64.exe+3A737 - 83 7B 58 00           - cmp dword ptr [rbx+58],00 { 0 }
gtutorial-x86_64.exe+3A73B - 75 58                 - jne gtutorial-x86_64.exe+3A795 { 如果 [rbx+58] != 0，则使用普通碰撞算法，否则使用简化碰撞算法 }
gtutorial-x86_64.exe+3A73D - 48 89 F1              - mov rcx,rsi { rsi 为玩家指针 }
gtutorial-x86_64.exe+3A740 - E8 6BFFFFFF           - call gtutorial-x86_64.exe+3A6B0 { xmm0 = [rcx+44] 玩家碰撞半径 }
gtutorial-x86_64.exe+3A745 - 0F28 F0               - movaps xmm6,xmm0 { xmm6 = [rcx+44] 玩家碰撞半径 }
gtutorial-x86_64.exe+3A748 - 48 89 D9              - mov rcx,rbx { rbx 为敌人指针 }
gtutorial-x86_64.exe+3A74B - E8 60FFFFFF           - call gtutorial-x86_64.exe+3A6B0 { xmm0 = [rcx+44] 敌人碰撞半径 }
gtutorial-x86_64.exe+3A750 - F3 0F10 4E 24         - movss xmm1,[rsi+24] { xmm1 = 玩家 X }
gtutorial-x86_64.exe+3A755 - F3 0F5C 4B 24         - subss xmm1,[rbx+24] { xmm1 = 玩家 X - 敌人 X }
gtutorial-x86_64.exe+3A75A - 0F54 0D 0F641E00      - andps xmm1,[gtutorial-x86_64.exe+220B70] { 取绝对值 }
gtutorial-x86_64.exe+3A761 - F3 0F59 C9            - mulss xmm1,xmm1 { 平方 }
gtutorial-x86_64.exe+3A765 - F3 0F10 56 28         - movss xmm2,[rsi+28] { xmm2 = 玩家 Y }
gtutorial-x86_64.exe+3A76A - F3 0F5C 53 28         - subss xmm2,[rbx+28] { xmm2 = 玩家 Y - 敌人 Y }
gtutorial-x86_64.exe+3A76F - 0F54 15 FA631E00      - andps xmm2,[gtutorial-x86_64.exe+220B70] { 取绝对值 }
gtutorial-x86_64.exe+3A776 - F3 0F59 D2            - mulss xmm2,xmm2 { 平方 }
gtutorial-x86_64.exe+3A77A - F3 0F58 D1            - addss xmm2,xmm1 { 相加 }
gtutorial-x86_64.exe+3A77E - F3 0F51 D2            - sqrtss xmm2,xmm2 { xmm2 = 敌人、玩家中心距离 }
gtutorial-x86_64.exe+3A782 - 0F28 CE               - movaps xmm1,xmm6
gtutorial-x86_64.exe+3A785 - F3 0F58 C8            - addss xmm1,xmm0 { xmm1 = 敌人碰撞半径+玩家碰撞半径 }
gtutorial-x86_64.exe+3A789 - 0F2F CA               - comiss xmm1,xmm2
gtutorial-x86_64.exe+3A78C - 40 0F97 C7            - seta dil
gtutorial-x86_64.exe+3A790 - E9 B4000000           - jmp gtutorial-x86_64.exe+3A849
gtutorial-x86_64.exe+3A795 - 83 7B 58 01           - cmp dword ptr [rbx+58],01 { 1 }
gtutorial-x86_64.exe+3A799 - 0F85 AA000000         - jne gtutorial-x86_64.exe+3A849 { 如果 [rbx+58] != 1 则不判断碰撞，前面已将 dil 设为 0 }
gtutorial-x86_64.exe+3A79F - 48 89 D9              - mov rcx,rbx
gtutorial-x86_64.exe+3A7A2 - 48 89 D8              - mov rax,rbx
gtutorial-x86_64.exe+3A7A5 - 48 8B 00              - mov rax,[rax]
gtutorial-x86_64.exe+3A7A8 - FF 90 F8000000        - call qword ptr [rax+000000F8] { xmm0 = 敌人 left }
gtutorial-x86_64.exe+3A7AE - 0F28 F0               - movaps xmm6,xmm0
gtutorial-x86_64.exe+3A7B1 - 48 89 F1              - mov rcx,rsi
gtutorial-x86_64.exe+3A7B4 - 48 89 F0              - mov rax,rsi
gtutorial-x86_64.exe+3A7B7 - 48 8B 00              - mov rax,[rax]
gtutorial-x86_64.exe+3A7BA - FF 90 00010000        - call qword ptr [rax+00000100] { xmm0 = 玩家 right }
gtutorial-x86_64.exe+3A7C0 - 0F2F C6               - comiss xmm0,xmm6
gtutorial-x86_64.exe+3A7C3 - 0F8A 7D000000         - jp gtutorial-x86_64.exe+3A846
gtutorial-x86_64.exe+3A7C9 - 0F86 77000000         - jbe gtutorial-x86_64.exe+3A846
gtutorial-x86_64.exe+3A7CF - 48 89 F1              - mov rcx,rsi
gtutorial-x86_64.exe+3A7D2 - 48 89 F0              - mov rax,rsi
gtutorial-x86_64.exe+3A7D5 - 48 8B 00              - mov rax,[rax]
gtutorial-x86_64.exe+3A7D8 - FF 90 F8000000        - call qword ptr [rax+000000F8] { xmm0 = 玩家 left }
gtutorial-x86_64.exe+3A7DE - 0F28 F0               - movaps xmm6,xmm0
gtutorial-x86_64.exe+3A7E1 - 48 89 D9              - mov rcx,rbx
gtutorial-x86_64.exe+3A7E4 - 48 89 D8              - mov rax,rbx
gtutorial-x86_64.exe+3A7E7 - 48 8B 00              - mov rax,[rax]
gtutorial-x86_64.exe+3A7EA - FF 90 00010000        - call qword ptr [rax+00000100] { xmm0 = 敌人 right }
gtutorial-x86_64.exe+3A7F0 - 0F2F C6               - comiss xmm0,xmm6
gtutorial-x86_64.exe+3A7F3 - 7A 51                 - jp gtutorial-x86_64.exe+3A846
gtutorial-x86_64.exe+3A7F5 - 76 4F                 - jna gtutorial-x86_64.exe+3A846
gtutorial-x86_64.exe+3A7F7 - 48 89 D9              - mov rcx,rbx
gtutorial-x86_64.exe+3A7FA - 48 89 D8              - mov rax,rbx
gtutorial-x86_64.exe+3A7FD - 48 8B 00              - mov rax,[rax]
gtutorial-x86_64.exe+3A800 - FF 90 08010000        - call qword ptr [rax+00000108] { xmm0 = 敌人 top }
gtutorial-x86_64.exe+3A806 - 0F28 F0               - movaps xmm6,xmm0
gtutorial-x86_64.exe+3A809 - 48 89 F1              - mov rcx,rsi
gtutorial-x86_64.exe+3A80C - 48 89 F0              - mov rax,rsi
gtutorial-x86_64.exe+3A80F - 48 8B 00              - mov rax,[rax]
gtutorial-x86_64.exe+3A812 - FF 90 10010000        - call qword ptr [rax+00000110] { xmm0 = 玩家 bottom }
gtutorial-x86_64.exe+3A818 - 0F2F C6               - comiss xmm0,xmm6
gtutorial-x86_64.exe+3A81B - 7A 29                 - jp gtutorial-x86_64.exe+3A846
gtutorial-x86_64.exe+3A81D - 76 27                 - jna gtutorial-x86_64.exe+3A846
gtutorial-x86_64.exe+3A81F - 48 89 F1              - mov rcx,rsi
gtutorial-x86_64.exe+3A822 - 48 8B 06              - mov rax,[rsi]
gtutorial-x86_64.exe+3A825 - FF 90 08010000        - call qword ptr [rax+00000108] { xmm0 = 玩家 top }
gtutorial-x86_64.exe+3A82B - 0F28 F0               - movaps xmm6,xmm0
gtutorial-x86_64.exe+3A82E - 48 89 D9              - mov rcx,rbx
gtutorial-x86_64.exe+3A831 - 48 8B 03              - mov rax,[rbx]
gtutorial-x86_64.exe+3A834 - FF 90 10010000        - call qword ptr [rax+00000110] { xmm0 = 敌人 bottom }
gtutorial-x86_64.exe+3A83A - 0F2F C6               - comiss xmm0,xmm6
gtutorial-x86_64.exe+3A83D - 7A 07                 - jp gtutorial-x86_64.exe+3A846
gtutorial-x86_64.exe+3A83F - 76 05                 - jna gtutorial-x86_64.exe+3A846
gtutorial-x86_64.exe+3A841 - 40 B7 01              - mov dil,01 { 碰撞设置 dil 为 1 }
gtutorial-x86_64.exe+3A844 - EB 03                 - jmp gtutorial-x86_64.exe+3A849
gtutorial-x86_64.exe+3A846 - 40 B7 00              - mov dil,00 { 0 }
gtutorial-x86_64.exe+3A849 - 40 0FB6 C7            - movzx eax,dil { 碰撞函数返回值为 eax }
gtutorial-x86_64.exe+3A84D - 90                    - nop
gtutorial-x86_64.exe+3A84E - 66 0F6F 74 24 20      - movdqa xmm6,[rsp+20]
gtutorial-x86_64.exe+3A854 - 48 8D 64 24 30        - lea rsp,[rsp+30]
gtutorial-x86_64.exe+3A859 - 5E                    - pop rsi
gtutorial-x86_64.exe+3A85A - 5F                    - pop rdi
gtutorial-x86_64.exe+3A85B - 5B                    - pop rbx
gtutorial-x86_64.exe+3A85C - C3                    - ret
```

上面是完整的碰撞算法分析。

其实并没有这么麻烦，我们只需要知道返回值是 `eax`，如果 `eax == 1` 则表示碰撞，`eax == 0` 则表示未碰撞。

我们跟踪 ret 返回。

```asm
gtutorial-x86_64.exe+4093A - FF 90 28010000        - call qword ptr [rax+00000128] { eax = 是否碰撞 }
gtutorial-x86_64.exe+40940 - 84 C0                 - test al,al
gtutorial-x86_64.exe+40942 - 74 11                 - je gtutorial-x86_64.exe+40955 { eax == 0 则跳转 }
gtutorial-x86_64.exe+40944 - 48 8B 4B 28           - mov rcx,[rbx+28]
gtutorial-x86_64.exe+40948 - 48 8B 43 28           - mov rax,[rbx+28]
gtutorial-x86_64.exe+4094C - 48 8B 00              - mov rax,[rax]
gtutorial-x86_64.exe+4094F - FF 90 20010000        - call qword ptr [rax+00000120] { 碰撞之后执行的事件 }
gtutorial-x86_64.exe+40955 - 48 8B 53 38           - mov rdx,[rbx+38]
```

`je` 修改成 `jmp` 即可。

![取消碰撞检测](/images/2019-03-26-cheat-engine-tutorial-games/step-3-no-collision.gif)

### 第 3 关尝试 11

如果 `[rbx+58] != 0`，则使用普通碰撞算法，否则使用简化碰撞算法，如果 `[rbx+58] != 1` 则不判断碰撞。所以我们可以令 `[rbx+58] = 2` 这样两个碰撞就都没了。

手动添加 `[[[["gtutorial-x86_64.exe"+37DC50]+760]+38]+0]+58`，4 字节，设置为 `2`。

## 隐藏问题

你有没有注意到你执行代码注入以后标题栏会由 `Step 2` 变成 `Step 2 (Integrity check error)`

> [Info]
>
> 完整性检查错误

游戏中内置的检测工具发现你修改了他们的程序指令。怎么办呢？

他们是怎么检测的呢？

原理很简单，就是比较代码区域的内存。

避免被发现的方法并不是如何伪造内存让他们别发现。通常检测程序运行在另一个线程，直接关掉那个线程就行了。

首先在地址列表中手动添加我们刚才修改的地址 `gtutorial-x86_64.exe+3F6A3`，然后查找谁在访问这个地址。

> [Tips]
>
> 一般正常的程序不会访问程序代码部分的内存的，他们运行所要的数据和都在常量区、全局变量区、堆、栈中，代码区是额外的一个区域，他们之间都是隔离开的。要访问程序自己的代码区的程序都不是正常的程序。

我这里找到了 3 个，然后选择其中一个（我这里就选第一个了）

![完整性检查指令](/images/2019-03-26-cheat-engine-tutorial-games/step-2-integrity-check-instructions.jpg)

`Show disassembler`，然后下断点。

![完整性检查下断点](/images/2019-03-26-cheat-engine-tutorial-games/step-2-integrity-check-breakpoint.jpg)

然后我们需要做的就是记住标题上的线程编号。然后在 `Memory Viewer` 中 `View` → `Threadlist` → 右键点击刚才的线程编号 → `Freeze thread`。

![冻结线程](/images/2019-03-26-cheat-engine-tutorial-games/step-2-freeze-thread.jpg)

![通过完整性检查](/images/2019-03-26-cheat-engine-tutorial-games/step-3-integrity-check-passed.jpg)

你打败了 3 个“游戏”，并且你打败了完整性检查！

干的真的漂亮！

## 总结

本文通过 3 个小游戏的二十多种思路，向你展示了很多破解思路。

您应该学习并理解这种思路，主要是如何通过内存地址找代码，如果通过代码找内存地址。

本文还讲述了一些小技巧，如何搜索坐标这种未知数值的内存数据。

最后简单讲解了内存校验的原理与简易破解方法。

希望您不仅能从本文中学到 Cheat Engine 工具的使用方法，还能学到更广阔的破解思想。

最后如果你想继续研究，你可以对照 [GTutorial 源代码](https://github.com/cheat-engine/cheat-engine/tree/master/Cheat%20Engine/Tutorial/graphical) 进行研究，看看原作者的注释，你能看到他给你预留了很多变量用于破解。

如果您有任何疑问欢迎在评论区留言。

2019 年 3 月 29 日 Ganlv

## 相关链接

* 基于栈的内存分配 - 维基百科: <https://en.wikipedia.org/wiki/Stack-based_memory_allocation>
* 内存管理 动态内存分配 - 维基百科: <https://en.wikipedia.org/wiki/Memory_management#Dynamic_memory_allocation>
* GTutorial 源代码: <https://github.com/cheat-engine/cheat-engine/tree/master/Cheat%20Engine/Tutorial/graphical>
