---
title: Photoshop 内存问题无法打开性能选项
date: 2018-10-26 14:45:21
tags:
  - photoshop
  - memory
  - ram
  - registry
---

> 要求 96 和 8 之间的整数。已插入最接近的数值

![无法打开首选项中的性能](/images/photoshop-memory-problem/cannot-open-performance-tab.jpg)

这个问题困扰了我一段时间。这个方法也是从网上找到的。

## 手动修改注册表

打开注册表编辑器 `regedit`。

找到 `HKEY_CURRENT_USER\Software\Adobe\Photoshop\110.0`，最后面的版本号可能不一样。

右键，`新建`，`DWORD (32 位) 值`，名称填 `OverridePhysicalMemoryMB`。

双击修改，把 `基数` 改成 `十进制`。然后把数值修改成你的内存大小（比如 4GB 内存填写 `4096`）。确定。

![注册表编辑器界面](/images/photoshop-memory-problem/regedit.jpg)

重新打开 Photoshop。

## 下载注册表文件

[photoshop-memory-problem.reg]

```reg
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Adobe\Photoshop\110.0]
"OverridePhysicalMemoryMB"=dword:00001000
```

> [Info]
>
> 这里面的 `00001000` 是 16 进制，转换成 10 进制就是 `4096`，这是我自己的电脑的总内存大小。
>
> 根据注册表文件格式，这里只能是 16 进制，必须手动进行把 10 进制和 16 进制的转换。

如果用的时候需要改成自己电脑的内存大小对应的 16 进制数值。

## 原因分析

解决问题之后，我认为原因可能就是 Photoshop 没有正常识别内存大小。

它认为总内存大小只有 8MB。但是 Photoshop 又要求最小值是 96MB。于是出现了“要求 96 和 8 之间的整数”。

然后估计是抛出异常了，但是被 catch 住了，然后就什么也没发生，但是也什么都做不了。

[photoshop-memory-problem.reg]: /assets/photoshop-memory-problem/photoshop-memory-problem.reg
