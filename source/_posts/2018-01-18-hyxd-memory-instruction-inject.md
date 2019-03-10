---
title: CE教程：《荒野行动》从内存数据修改到代码注入
date: 2018-01-18 03:07:10
tags:
  - cheatengine
  - tutorial
  - disassemble
  - game
  - 荒野行动
---

<!-- toc -->

## 人物物品变黄色

2018 年 1 月 8 日之后，网易似乎对荒野行动的内存数据进行了简单的检测，原来的通过 `基址 + 偏移` 的方法改数据会被秒封。

物品红色 gamma 值地址：`[[["hyxd.exe"+1B9A678]+AC]+E0]+E0`，float 类型，直接把该数值改成 `1000` 会导致账号被封，具体原因暂时不清楚。

### 反调试

首先这个游戏有简单的反调试，`Cheat Engine 菜单 > Edit > Settings > Debugger Options`，改一下设置 `Debugger method: Use windows debugger`，`Debugger interface config: Try to prevent detection of debugger`，简单粗暴的反反调试就可以了，至于 `Try to prevent detection of debugger` 具体做了什么暂时不太清楚，有待进一步研究。

![Try to prevent detection of debugger](/images/2018-01-18-hyxd-memory-instruction-inject/prevent-detection-of-debugger.png)

### 找到修改内存的指令

然后就可以对这个地址进行`Find out what accesses the address > Find what accesses the address pointed at by this pointer` 可以看到两条指令

![Find what accesses the address pointed at by this pointer](/images/2018-01-18-hyxd-memory-instruction-inject/opcodes-accessed-address.png)

经过测试，第一条是真正有用的代码，第二条大约每 1 秒触发 1 次，可能就是用来检测数据异常的。

既然直接改内存数据会被检测到，那么不用内存数据修改的方法怎么办呢？

### 代码注入

选中第一条指令，点击 `Show disassembler`。

![Show disassembler](/images/2018-01-18-hyxd-memory-instruction-inject/show-disassembler.png)

```asm
hyxd.exe+64F3E2 - F3 0F10 86 EC000000   - movss xmm0,[esi+000000E0]
hyxd.exe+64F3EA - F3 0F59 86 EC000000   - mulss xmm0,[esi+000000EC]
hyxd.exe+64F3F2 - F3 0F11 47 40         - movss [edi+40],xmm0
```

这三条指令，第一条是读取红色亮度，第二条是乘以白色亮度，第三条是存到 `[edi+40]`。

代码注入原理很简单，就是二话不说，直接给 `[edi+40]` 赋值 float 的 `1000`。

这块内存区域足够我们注入了，不需要申请新内存，直接在这块内存上修改即可。

原始代码：8 + 5 bytes = 13 bytes

```asm
hyxd.exe+64F3EA - F3 0F59 86 EC000000   - mulss xmm0,[esi+000000EC]
hyxd.exe+64F3F2 - F3 0F11 47 40         - movss [edi+40],xmm0
```

修改后代码：7 + 6 * 1 bytes = 13 bytes

```asm
mov [edi+40], (float)1000.0
nop
nop
nop
nop
nop
nop
```

这个就是最简单的代码注入了。

### 在 CE 中实现

![Auto assemble](/images/2018-01-18-hyxd-memory-instruction-inject/auto-assemble.png)

```asm
[ENABLE]
"hyxd.exe"+64F3EA:
  mov [edi+40], (float)1000.0
  nop
  nop
  nop
  nop
  nop
  nop

[DISABLE]
"hyxd.exe"+64F3EA:
  mulss xmm0,[esi+000000EC]
  movss [edi+40],xmm0
```

保存到代码列表即可。

然而 CE 的自动汇编似乎每条指令不是同时写入的，连续的开关这个代码注入有时直接导致程序崩溃，所以我改为使用 `db` 直接拷贝字节数组，这样可以一次性写入，防止程序崩溃。

```asm
[ENABLE]
"hyxd.exe"+64F3EA:
  db C7 47 40 00 00 7A 44 90 90 90 90 90 90

[DISABLE]
"hyxd.exe"+64F3EA:
  db F3 0F 59 86 EC 00 00 00 F3 0F 11 47 40
```

![Assign to current cheat table](/images/2018-01-18-hyxd-memory-instruction-inject/assign-to-current-cheat-table.png)

![Set hotkeys](/images/2018-01-18-hyxd-memory-instruction-inject/set-hotkeys.png)

这样基本可以完成了，2018 年 1 月 18 日测试不会被封号。

![人物物品变黄色](/images/2018-01-18-hyxd-memory-instruction-inject/yellow-things-result.png)

## 摄像机抬高

关于这个游戏的摄像机位置，大家可能都知道了。

人物站立搜 `1.65`，蹲下搜 `1.30`，趴下搜 `0.76`，只剩下一个地址，这是跟随摄像机的高度。

不要直接修改这个数值，队友观战的情况下可以看到和你相同的画面（他们的视野也是提高的，或者说服务器会收到你修改的异常数据）。

对这个地址使用上述同样的方法，找出写入的代码，然后在原始内存上代码注入即可，比如设置成 `30`，就可以拥有一个头上的无人侦察机了。

然而，简单的内存注入会使摄像机顶在天花板上，极其影响使用体验，所以，我们深入研究一下这段代码。

### 内存修改到代码注入

1. 人物站立搜 `1.65`，蹲下搜 `1.30`，趴下搜 `0.76`，只剩下一个地址。

2. Find out what accesses the address，只有一条指令，然后 Show disassembler.

![Find what accesses the address pointed at by this pointer](/images/2018-01-18-hyxd-memory-instruction-inject/opcodes-accessed-camera-address.png)

看到两条有用的指令

```asm
hyxd.exe+23954D - F3 0F10 86 C4000000   - movss xmm0,[esi+000000C4]
hyxd.exe+239555 - F3 0F11 45 C8         - movss [ebp-38],xmm0
```

把 `[esi+000000C4]` 赋值给 `[ebp-38]`

于是我们就使用 Find out what addresses this instruction accesses 找出这条指令访问的地址。

![Find out what addresses this instruction accesses](/images/2018-01-18-hyxd-memory-instruction-inject/what-addresses-this-instruction-accesses.png)

可以看到，找到的地址的值一直在变啊，我们下断点看看 ESP（Stack Pointer，栈指针）的值，ESP 和 EBP 比较接近，所以 `[ebp-38]` 指向的是一个栈内存的数据，很麻烦。

了解一些反汇编的原理就会知道，堆内存是分配完只要不销毁、无论怎么在函数间传递或调用都会一直存在的，也不会被其他数据占据，而栈是只在函数调用期间存在的，一旦这个函数调用结束，别的函数就会复用这块栈，这块数据会频繁的改变，所以栈内存根本没法使用普通方式修改，必须依赖代码注入。

```asm
mov [ebp-38],(float)30.0
nop
nop
nop
nop
nop
nop
```

### 解决顶在天花板的问题

这样就可以了，非常简单，不过顶在天花板上的问题还没解决呢。

虽然栈是短暂的，在线程外访问会得到不确定的结果。但是，如果我们下了断点，让程序在这里沿着游戏的线程执行，就不会出现这个问题了，但是 Find out what addresses this instruction accesses 这种简单的方法就不行了。

![Set breakpoint](/images/2018-01-18-hyxd-memory-instruction-inject/set-instruction-breakpoint.png)

首先 F5 下断点，然后看寄存器，并右键 EBP 选择 `Show in hexview`，并且往上找 3 行 8 字节（就是 `[ebp-38]`），右键 `Data breakpoint > Break on access`，然后 F9 继续执行就可以了，程序会断在对 `[ebp-38]` 访问的指令上，我们可以确定，这条指令一定是有用的，而不会被其他函数复用了这块内存（因为这个数据刚写入，第一次访问一定是有用的访问）。

![Set data breakpoint. Break on access](/images/2018-01-18-hyxd-memory-instruction-inject/data-breakpoint-break-on-access.png)

```asm
hyxd.exe+239B3D - F3 0F10 8E 84000000   - movss xmm1,[esi+00000084]
hyxd.exe+239B45 - F3 0F10 86 88000000   - movss xmm0,[esi+00000088]
hyxd.exe+239B4D - F3 0F58 96 80000000   - addss xmm2,[esi+00000080]
hyxd.exe+239B55 - F3 0F58 4D C8         - addss xmm1,[ebp-38]
hyxd.exe+239B5A - F3 0F58 45 C4         - addss xmm0,[ebp-3C]
hyxd.exe+239B5F - 0F14 D1               - unpcklps xmm2,xmm1
hyxd.exe+239B62 - 66 0FD6 17            - movq [edi],xmm2
hyxd.exe+239B66 - F3 0F11 45 A4         - movss [ebp-5C],xmm0
```

我们可以分析一下这段代码的意图，在 `hyxd.exe+239B45` 处下断点，查看 `XMM1` 寄存器，很显然 `[esi+00000084]` 存放的是当前人物的 Y 坐标（高度方向坐标），然后使用 `addss` 指令把 `[ebp-38]` 的相机高度加上，然后 `unpcklps` 把 `xmm1` 和 `xmm2` 寄存器各自的前 4 字节合成到 `xmm2` 的前 8 字节，写入 `[edi]`，我们可以看到 `edi` 在每局游戏中是固定的，这个就非常舒服，我们直接添加到地址列表中就可以研究了。

![FPU](/images/2018-01-18-hyxd-memory-instruction-inject/fpu.png)

### 尝试

我们可以尝试第一个实验，直接把 `movq [edi],xmm2` 改为 `nop`，右键该条指令，`Replace with code that does nothing`，我们发现镜头不会跟随我们了，然后我们可以对 `edi` 的地址用 CE 直接进行内存修改，发现镜头真的可以随数值移动，证明，`edi` 这个地址是有用的。

改完记得在右键 `Restore with original code` 还原代码

然后，就是 `Find out what writes the address`，可以看到，在相机不碰到天花板的时候只有一条指令写入，在碰到天花板的时候有两条写入，我们直接把第二条`nop` 掉。大功告成，我们可以在屋子里提高视野了。

![Replace camera collision detect](/images/2018-01-18-hyxd-memory-instruction-inject/replace-camera-collision-detect.png)

于是我们又发现问题了，开镜、开车和观战的时候，步骤 2 中注入的代码不好使，搜索对 EDI 这个地址的写入，我们发现开镜、开车和观战的时候分别有不同的代码写入 EDI 这个地址，我们必须继续探究 EDI 这个地址到底之后被用来做什么了。

### 相机碰撞代码注入

还是熟悉的套路，右键刚才那个相机高度的地址，Find out what accesses the address，查找访问（访问包括写入和读取），可以看到通常情况下有 4 条指令，当进行某些复杂的相机位置计算的时候回多出来很多（比如顶到天花板，比如开镜）

![查找访问相机高度的指令](/images/2018-01-18-hyxd-memory-instruction-inject/find-opcodes-accessed-camera-z.png)

注意，前面的计数器是相等的，很显然这些操作是一系列有顺序的操作，其中第二条是刚才写入 `[edi]` 的那条指令。

另外，这里显示的指令的顺序是非常重要的，CE按照触发顺序列出了所有的访问指令，我们要改的应该是哪一个呢？

想一想，肯定是最后一个嘛。我们的想法就是，前面无论你怎么算，让游戏随便算，我们到最后一步，把结果一改就 OK 啦。（你前面尽管算，结果对了算我输）

### 开始修改

Show disassembler

![最后一条访问相机高度的指令](/images/2018-01-18-hyxd-memory-instruction-inject/last-opcodes-accessed-camera-z.png)

```asm
hyxd.exe+21F7FB - F3 0F10 47 04         - movss xmm0,[edi+04]
hyxd.exe+21F800 - F3 0F5C C5            - subss xmm0,xmm5
hyxd.exe+21F804 - F3 0F11 45 90         - movss [ebp-70],xmm0
```

`[edi]` 是 X 坐标，`[edi+04]` 是 Y 坐标（相机高度）

我们要做什么你们懂吧，在 `movss [ebp-70],xmm0` 这句话之前，在 `xmm0` 上加 `30.0` 就可以了。

对这句指令进行 `Auto Assemble`，使用 `Template > Full Injection` 模板

![Full Injection](/images/2018-01-18-hyxd-memory-instruction-inject/full-injection.png)

CE 提供了以下 Full Injection 模板

```asm
define(address,"hyxd.exe"+21F804) // 定义我们要修改的地址
define(bytes,F3 0F 11 45 90) // 这是改地址原来的指令机器码

[ENABLE]

assert(address,bytes) // 只有在我们要修改的地址为原来的指令的时候才继续
alloc(newmem,$1000) // 分配1KB内存

label(code) // 定义标签
label(return) // 定义标签

newmem: //这是我们刚分配的内存地址，在这里添加修改代码// ...
// ...
// ...
code: // 这是原来指令的拷贝（因为jmp newmem指令覆盖了原来的指令，所以需要把原来的指令搬到我们新分配的地址中来）
  movss [ebp-70],xmm0
  jmp return

address: // 这是原始的地址，这个标签之后的内容会覆盖原始指令（就是跳转到我们分配的那一段内存里）
  jmp newmem
return:

[DISABLE]

address:
  db bytes
  // movss [ebp-70],xmm0

dealloc(newmem)
```

代码中有解释，不过我还要再说明一下，`newmem:` `code:` `address:` `return:` 这四个东西的用途是不一样的。`newmem` 和 `address` 是具体的内存地址，他表示接下来所有指令将被写入这个内存地址。`code` 和 `return` 是标签，不占据字节，不占据指令，他表示一个暂时不知道的地址，仅仅用于跳转，所以从 `newmem:` 到 `address:` 之间的指令都会写到新分配的地址中，`address:` 到 `[DISABLE]` 之间的指令都会覆盖原始指令（实现代码注入的效果）

我们需要做的就是在 `newmem:` 后面添加几条指令，你们可以自行发挥（由于 `newmem:` 到 `address:` 之间的指令都会写到新分配的地址中，改 `code:` 之后的指令也是没有任何问题的）。

我的写法如下：

```asm
push (float)30.0
addss xmm0, [esp]
add esp, 4
```

由于 `ss` 系列指令不能接受具体的数值（应该叫立即数吧，我对 ASM 只是粗略的了解），所以我先直接往栈中压入一个数值，由于栈可以通过地址使用 `[esp]` 访问（ESP 永远指向栈顶），然后再把栈指针增加 4 ，恢复栈平衡。

这里基本就完事了。

我甚至发现一个有趣的东西，就是可以在天上开镜，甚至还可以打到人。看来这个游戏的命中检测是客户端做的。

![照相机提高效果](/images/2018-01-18-hyxd-memory-instruction-inject/camera-cheat-result.png)

如果在车上开提高视角，一旦屏幕中没有显示出自己的车子，屏幕就会非常卡，暂时不知道原因是什么。（所以在车里提高视角之后只能竖直向下看）

### 课后拓展

看到 `movss [ebp-70],xmm0` 这条指令，对 `[ebp-70]` 有没有什么兴趣。

`ebp` 和 `esp` 差不多，通常都是指向栈内存的，分析这个地址也需要单步或内存断点。

## 放大视野（自带8倍镜）

不开镜搜 `39.4`，枪自带的镜或红点搜 `31.52`，二倍镜搜 `39.4/2`，四倍镜搜`39.4/4`，以此类推。

1. 先通过内存搜索把地址定下来，应该会有 4 个地址。

2. 你们可以一个一个试，找出访问这个地址的指令。

最后我定位到这段代码了

![修改视野的代码](/images/2018-01-18-hyxd-memory-instruction-inject/field-of-vision-code.png)

```asm
hyxd.exe+175FBD - F3 0F10 05 94DD4802   - movss xmm0,[hyxd.exe+168DD94] { [179.90] }
hyxd.exe+175FC5 - F3 0F10 0D 90DD4802   - movss xmm1,[hyxd.exe+168DD90] { [0.10] }
hyxd.exe+175FCD - F3 0F5D 86 FC010000   - minss xmm0,[esi+000001FC]
hyxd.exe+175FD5 - F3 0F5F C8            - maxss xmm1,xmm0
hyxd.exe+175FD9 - 84 C0                 - test al,al
hyxd.exe+175FDB - 75 32                 - jne hyxd.exe+17600F
hyxd.exe+175FDD - 0F2E 8F 98000000      - ucomiss xmm1,[edi+00000098]
hyxd.exe+175FE4 - 9F                    - lahf 
hyxd.exe+175FE5 - F6 C4 44              - test ah,44 { 68 }
hyxd.exe+175FE8 - 7B 25                 - jnp hyxd.exe+17600F
hyxd.exe+175FEA - 8B 4D 08              - mov ecx,[ebp+08]
hyxd.exe+175FED - F3 0F11 8F 98000000   - movss [edi+00000098],xmm1
hyxd.exe+175FF5 - F3 0F59 0D 8CDD4802   - mulss xmm1,[hyxd.exe+168DD8C] { [0.02] }
hyxd.exe+175FFD - 51                    - push ecx
hyxd.exe+175FFE - 8B 01                 - mov eax,[ecx]
hyxd.exe+176000 - F3 0F11 0C 24         - movss [esp],xmm1
hyxd.exe+176005 - FF 50 34              - call dword ptr [eax+34]
hyxd.exe+176008 - C7 45 FC FFFFFFFF     - mov [ebp-04],FFFFFFFF { -1 }
hyxd.exe+17600F - F3 0F10 86 00020000   - movss xmm0,[esi+00000200]
```

读取 `[esi+000001FC]`，然后与给定范围对比，最大179.9度，最小0.10度。

（然后后面那一堆代码可以不用理解，具体想研究的话需要去查ucomiss和lahf指令的具体含义，反正我研究了半天，也没什么大用）

如果 `[edi+00000098]` 不等于 `xmm1` 则令 `[edi+00000098]` 等于 `xmm1`，然后把 `xmm1` 乘以 `0.02` 存入 `[esp]`，调用 `[eax+34]` 这个函数 。

这个 `0.02` 是四舍五入以后的，具体看一下那个内存地址是 `0.017`，猜一猜嘛，高中数学，就是 `π/180` 呗。（就算知道了又怎样呢.....）

### 思路

我们需要做的很简单，把 `maxss xmm1,xmm0` 那一堆直接改成令 `xmm1 = 39.4/8` 就行了。（下面的代码没有填充nop，自己调整一下就好了）

```asm
push (float)5.0
movss xmm1,[esp]
add esp,4
```

这样其实就可以了。不过你会发现这样的放大视野并不会加载远处的东西，那怎么办呢？我还没研究出来

（还在探索中，不过真不太想玩这个游戏了）

## 高级代码注入

抬高相机玩的还不够爽，毕竟只是改变一个 Y 轴。那么 X 轴和 Z 轴呢？

当然也可以改，不过问题来了，我怎么知道 X 轴、Z 轴的数值要怎么改变呢，我们需要更人性化的使用方法。

以下代码实现的功能，简单来说就是一个隐形无人机：IJKL:控制方向，P/分号:上升/下降，左/右方括号:减速/加速

如果是可以开镜的枪，开镜使用就是一个具备攻击能力的隐形无人机。

> [Tips]
>
> 以下内容需要对 Windows 的 API 有一定了解，对汇编有一定了解。如果你对汇编不太了解可以用 C 语言写，然后使用 CE 进行注入（不过这个我还没试过）。

### 无人机代码

```asm
// 首先定义了很多常量
// 这个代码地址是原来的计算已经结束的地方，我们的目的是在得到原始计算结果之后再进行修改
define(address,"hyxd.exe"+21F812)
define(bytes,F3 0F 11 45 CC)
define(VK_I,49)
define(VK_J,4A)
define(VK_K,4B)
define(VK_L,4C)
define(VK_P,50)
define(VK_OEM_1,BA) // 分号键
define(VK_OEM_4,DB) // 左方括号
define(VK_OEM_6,DD) // 右方括号

[ENABLE]

// 目标地址必须是指定指令才进行注入
assert(address,bytes)

// 分配代码内存
alloc(newmem,$1000)
// 分配变量内存
alloc(delta_x,4)
alloc(delta_y,4)
alloc(delta_z,4)
alloc(v_x,4)
alloc(v_y,4)
alloc(v_z,4)
alloc(v,4)
alloc(v_ratio,4)

// 定义标签
label(return)
label(uav)
label(not_press_VK_I)
label(not_press_VK_J)
label(not_press_VK_K)
label(not_press_VK_L)
label(not_press_VK_P)
label(not_press_VK_OEM_1)
label(not_press_VK_OEM_4)
label(not_press_VK_OEM_6)

// 变量初始化
delta_x:
  dd (float)0
delta_y:
  dd (float)0
delta_z:
  dd (float)0
v_x:
  dd (float)0
v_y:
  dd (float)1
v_z:
  dd (float)0
v:
  dd (float)0.5
v_ratio:
  dd (float)1.05

// 注入的代码
newmem:

  // 原来地址上的代码
  movss [ebp-34],xmm0

  // 把速度存下来，供其他部分使用
  // movss xmm3, [edi+0c]
  movss [v_x], xmm3
  // movss xmm5, [edi+10]
  movss [v_y], xmm5
  // movss xmm4, [edi+14]
  movss [v_z], xmm4
  // 检测键盘操作
  call uav
  // 在相机位置上加上偏移量
  movss xmm0,[ebp-6C]
  addss xmm0,[delta_x]
  movss [ebp-6C],xmm0
  movss xmm0,[ebp-70]
  addss xmm0,[delta_y]
  movss [ebp-70],xmm0
  movss xmm0,[ebp-34]
  addss xmm0,[delta_z]
  movss [ebp-34],xmm0
  // 我调试了半天才发现，call user32.GetAsyncKeyState会清空xmm寄存器
  // 恢复xmm寄存器
  movss xmm3, [edi+0c]
  movss xmm5, [edi+10]
  movss xmm4, [edi+14]
  jmp return

// 这个是我们通过键盘操控的代码
uav:
  // 记录寄存器和标志位
  push eax
  push ecx
  push edx
  pushf
  // GetAsyncKeyState接受一个参数，就是虚拟按键的编码
  push VK_I
  call user32.GetAsyncKeyState
  // 返回值保存到EAX，AX的最高位为1则按下，这里简单的判断EAX是否为0
  test eax,eax
  je not_press_VK_I
  // delta_x = delta_x + v * v_x
  movss xmm0,[delta_x]
  movss xmm1,[v_x]
  mulss xmm1,[v]
  addss xmm0,xmm1
  movss [delta_x],xmm0
  // 这里可以根据自己的喜好，选择注释或取消注释。
  // movss xmm0,[delta_y]
  // movss xmm1,[v_y]
  // mulss xmm1,[v]
  // addss xmm0,xmm1
  // movss [delta_y],xmm0
  movss xmm0,[delta_z]
  movss xmm1,[v_z]
  mulss xmm1,[v]
  addss xmm0,xmm1
  movss [delta_z],xmm0
not_press_VK_I:
  push VK_K
  call user32.GetAsyncKeyState
  test eax,eax
  je not_press_VK_K
  movss xmm0,[delta_x]
  movss xmm1,[v_x]
  mulss xmm1,[v]
  subss xmm0,xmm1
  movss [delta_x],xmm0
  // movss xmm0,[delta_y]
  // movss xmm1,[v_y]
  // mulss xmm1,[v]
  // subss xmm0,xmm1
  // movss [delta_y],xmm0  movss xmm0,[delta_z]
  movss xmm1,[v_z]
  mulss xmm1,[v]
  subss xmm0,xmm1
  movss [delta_z],xmm0
not_press_VK_K:
  push VK_J
  call user32.GetAsyncKeyState
  test eax,eax
  je not_press_VK_J
  // 左右移动需要动动脑子，delta_x = delta_x + v * v_z，delta_z = delta_z - v * v_x
  movss xmm0,[delta_x]
  movss xmm1,[v_z]
  mulss xmm1,[v]
  addss xmm0,xmm1
  movss [delta_x],xmm0
  movss xmm0,[delta_z]
  movss xmm1,[v_x]
  mulss xmm1,[v]
  subss xmm0,xmm1
  movss [delta_z],xmm0
not_press_VK_J:
  push VK_L
  call user32.GetAsyncKeyState
  test eax,eax
  je not_press_VK_L
  movss xmm0,[delta_x]
  movss xmm1,[v_z]
  mulss xmm1,[v]
  subss xmm0,xmm1
  movss [delta_x],xmm0
  movss xmm0,[delta_z]
  movss xmm1,[v_x]
  mulss xmm1,[v]
  addss xmm0,xmm1
  movss [delta_z],xmm0
not_press_VK_L:
  push VK_P
  call user32.GetAsyncKeyState
  test eax,eax
  je not_press_VK_P
  movss xmm0,[delta_y]
  addss xmm0,[v]
  movss [delta_y],xmm0
not_press_VK_P:
  push VK_OEM_1
  call user32.GetAsyncKeyState
  test eax,eax
  je not_press_VK_OEM_1
  movss xmm0,[delta_y]
  subss xmm0,[v]
  movss [delta_y],xmm0
not_press_VK_OEM_1:
  push VK_OEM_4
  call user32.GetAsyncKeyState
  test eax,eax
  je not_press_VK_OEM_4
  movss xmm0,[v]
  divss xmm0,[v_ratio]
  movss [v],xmm0
not_press_VK_OEM_4:
  push VK_OEM_6
  call user32.GetAsyncKeyState
  test eax,eax
  je not_press_VK_OEM_6
  movss xmm0,[v]
  mulss xmm0,[v_ratio]
  movss [v],xmm0
not_press_VK_OEM_6:
  // 恢复栈平衡
  popf
  pop edx
  pop ecx
  pop eax
  ret

address:
  jmp newmem
return:

[DISABLE]

address:
  db bytes
  // movss [ebp-34],xmm0

dealloc(newmem)
dealloc(delta_x)
dealloc(delta_y)
dealloc(delta_z)
dealloc(v_x)
dealloc(v_y)
dealloc(v_z)
dealloc(v)
```

> [Tips]
>
> 这个代码是完全在绘图线程上做的，CE 其实还可以支持 createthread 再建立一个自己的线程，在自己的线程完成移动视角的操作，这样就可以减轻原始线程的负担。

### GetAsyncKeyState 函数

参考 <https://msdn.microsoft.com/en-us/library/windows/desktop/ms646293>

判断当这个函数被调用时，某一个按键是否处于按下状态。如果处于按下状态，则返回值的最高位为1（返回值为-32767），通常简单的判断非零即可。

```cpp
SHORT WINAPI GetAsyncKeyState(_In_ int vKey);
```

他接受一个参数，就是虚拟按键码，Visual C++ 开发可以直接使用 `VK_*` 的常量来表示，这里需要我们自己定义。

### WIN32 API

直接使用汇编语言调用 API 其实不是特别难，如果这个 DLL 已经加载了，那就更简单了，逆序 push 进去参数，call 即可，返回值保存在 EAX 寄存器

参考 <https://www.52pojie.cn/thread-434732-1-1.html>

### 算法

位移速度时间计算，高中数学+物理，这个自行解决吧。

左右移动可能需要一些比如向量的乘法或者行列式之类的东西，不过这里简单的说一下，如下图，就两种情况，试一试就知道了。

![位移计算方法](/images/2018-01-18-hyxd-memory-instruction-inject/movement-calculation.jpg)

### 题外话

> [Comment]
>
> 现在的挂不就是比谁更牛逼嘛，飞天、遁地、穿墙又能怎样？
>
> 当你们还在用人体作战，我们已经拥有无人机了。

![无人机效果](/images/2018-01-18-hyxd-memory-instruction-inject/uav-1.jpg)

![无人机效果](/images/2018-01-18-hyxd-memory-instruction-inject/uav-2.jpg)

![无人机效果](/images/2018-01-18-hyxd-memory-instruction-inject/uav-3.jpg)

**这个功能严重影响游戏平衡，请酌情使用！**

可谓杀人于无形。

> 运筹帷幄之中，决胜千里之外。

（上面这句话的引用纯属娱乐，语文考生请勿如此使用）

> 外挂是百分之一的灵感加上百分之九十九的汗水。

### 课后练习

设计一个可以动态改变瞄准镜倍数的外挂。

## 其他

1. 有人在回复询问，`39.4` 是怎么找到的？

    学习 CE 最开始肯定是破解 CE 自带的 `Tutorial.exe` 了，CE 的第三步就是未知初始值查询。

    首先我们不开镜选择 `Scan Type: Unknown initial value`。至于 `Value Type`，对这个游戏研究一下就会发现他全都用的是 `Float` 类型，如果实在不知道可以选择 `All`。

    然后就是开镜，`Scan Type: Changed value`，搜索，`Scan Type: Unchanged value`，搜索，搜索，搜索。关镜，`Scan Type: Changed value`，搜索，`Scan Type: Unchanged value`，搜索，搜索，搜索。如此反复。中间可以夹杂着一下比如 `Bigger than ...` `1e-9`、`Smaller than ...` `1e9` 之类的，把没用的地址去掉。

    最后剩下的就是这个数值了。

    同理：`1.65`、`1.30`、`0.76` 可以通过同样的方法获取到。

2. 人物颜色那个地址是哪来的？

    恕我直言，我不知道怎么获取。

    原贴地址：<https://www.52pojie.cn/thread-674430-1-1.html>

3. 基本上算是结帖了，有什么问题可以我也可以回复，这个游戏真的没什么意思了，到处都是神仙，上天入地满地乱爬的，希望大家也尽量少开挂，本着学习交流的心态去使用辅助工具。

4. 恕我直言，根据以上分析，这个游戏的命中检测肯定实在客户端做的，而且只在打枪的一方做，服务器和被打中的一方没有其他检测。恕我直言这个游戏吃枣药丸。真希望网易尽快解决这个问题。之前也在论坛里看到有人发不用瞄准，随便打，枪枪打中人的动态图，我希望这个功能的外挂我希望还是最好不要放出来。

5. 我已经卸载游戏了，教程不会继续更新了。

6. CE 有自带的 Trainer，可以将 CE 存档文件直接生成 exe 可执行文件

7. 我不会易语言，而且我也不想单独发布外挂，这个教程仅仅是个教程，具体怎么用就看你们自己的了，更何况附件的 CE 存档文件又不是不能用。

    如果想使用其他编程语言编写外挂 可能需要 OpenProcess VirtualAllocEx WriteProcessMemory 等 Windows API 函数，如果要过检测，还需要 Hook 住相关的 API，易语言可能有相关的模块，这个我不太懂。

8. 我在这方面只是研究了不到一个月，我是靠这个内容申请的吾爱破解账号（[会员申请贴](https://www.52pojie.cn/thread-686004-1-1.html)）。之前只是对计算机其他东西有所了解，对反汇编、代码注入这方面仅仅只有不到一个月的水平。不要向我要联系方式，也不要提是否收徒这种问题，这篇文章是我在这方面研究的全部内容，就算收徒也不会带来其他的知识了。有相关问题可以回帖，在这个帖子凉之前我应该都会回答。私信我我会视情况回复的，如果是常见问题尽量还是在下面回帖提问。

9. 2018 年 1 月 26 日有人回帖称，已被秒封，请尽可能小心地进行破解。

10. 有其他帖子有制作 Trainer 教程

    原贴地址：https://www.52pojie.cn/thread-690777-1-1.html

## 附件

> [Info]
>
> 附件是我自己的 Cheat Engine 存档文件（密码52pojie.cn）。

[下载 hyxd.zip](/assets/2018-01-18-hyxd-memory-instruction-inject/hyxd.zip)
