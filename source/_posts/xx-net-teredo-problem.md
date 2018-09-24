---
title: XX-Net Teredo 问题
date: 2018-09-24 17:34:35
tags:
  - xx-net
  - gfw
  - teredo
  - google
---

偶尔用 [XX-Net][xx-net] 来访问 [Google][google]、[MDN][mdn]。教育网原生 IPv6 可以完全正常使用 XX-net，但其他情况下需要 Teredo 隧道，然而我的电脑就是用不了，周围的人都可以，一直不知道为什么。

今天终发现于原因了：我刚装系统的时候手贱把很多防火墙规则都改成禁用了，然后默认就阻止连接了。

## 发现过程

我今天再一次查看 [XX-Net IPv6 说明][xx-net-wiki-ipv6]，很随意的点开了 [Teredo Wikipedia][teredo-wikipedia]。简单浏览了一下，突然发现这个服务是需要开启 UDP 3544 端口。我猛然意识到我刚装系统之后，在防火墙中把大部分端口都禁了。

![Windows Defender Firewall Advanced Settings](/images/xx-net-teredo-problem/firewall-settings.jpg)

在高级安全 Windows Defender 防火墙设置中，把与 IPv6 有关的条目都启用，再试了一下果然就成功了。

自己手欠啊！

我继续看 XX-Net 的 Wiki 中，FAQ 中提到了 [Teredo Xbox Support][teredo-xbox-support]，点进去发现里面说了防火墙问题。

真是懒啊，没耐心去读文档。

[xx-net]: https://github.com/XX-net/XX-Net
[google]: https://www.google.com/ncr
[mdn]: https://developer.mozilla.org/
[xx-net-wiki-ipv6]: https://github.com/XX-net/XX-Net/wiki/%E5%A6%82%E4%BD%95%E5%BC%80%E5%90%AFIPv6
[teredo-wikipedia]: https://en.wikipedia.org/wiki/Teredo_tunneling
[teredo-xbox-support]: https://support.xbox.com/zh-CN/xbox-on-windows/social/troubleshoot-party-chat