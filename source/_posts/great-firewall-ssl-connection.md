---
title: 关于 GFW 的 SSL 连接检测
date: 2018-09-22 23:11:47
tags:
  - gfw
  - ssl
  - tunnel
---

当访问 <https://zh.wikipedia.org/> 时会在 SSL 握手时直接被 RESET 或 ABORT，因为握手的时候是明文发送域名的。

![zh wikipedia abort](/images/great-firewall-ssl-connection/1.jpg)

由于墙并没有去管 <https://en.wikipedia.org/> 或 <https://www.wikipedia.org/>，这两个网站可以正常访问，SSL 握手正常进行，Socket 成功连接了。

![www wikipedia ok](/images/great-firewall-ssl-connection/2.jpg)

这时再访问 <https://zh.wikipedia.org/>，由于这两个网站在一个服务器上，可以直接使用刚才的 Socket，于是访问中文维基百科时完全处于加密中。

![zh wikipedia use www ssl tunnel](/images/great-firewall-ssl-connection/3.jpg)

也就是说，假如能和对方成功建立起 SSL 连接，那么这种检测证书的方式就会被绕过。
