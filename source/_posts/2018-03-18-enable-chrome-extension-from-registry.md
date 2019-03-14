---
title: 修改注册表启用 Chrome 插件
date: 2018-03-18 16:11:19
tags:
  - chrome
  - extension
  - plugin
---

> 为了提高 Chrome 的安全性，我们停用了以下扩展程序，（该扩展程序未在 Chrome 网上应用店中，并且可能是在您不知情的情况下添加的）。

![已自动停用](/images/2018-03-18-enable-chrome-extension-from-registry/auto-disabled.jpg)

Chrome 现在禁止加载自己打包生成的扩展程序了。

![无法启用](/images/2018-03-18-enable-chrome-extension-from-registry/unable-to-enable.jpg)

## 解决方法

### 修改注册表

新建一个 reg 文件，写入以下内容

{% include_code extension-install-whitelist.reg 2018-03-18-enable-chrome-extension-from-registry/extension-install-whitelist.reg %}

这个 `nmgnihglilniboicepgjclfiageofdfj` 是插件 ID，就是勾选 “开发者模式” 之后显示的那个 ID。替换成所用的插件的 ID 即可。

然后双击这个 reg 文件，导入就行了。

现在就可以启用了。

![可以启用](/images/2018-03-18-enable-chrome-extension-from-registry/enabled.jpg)

> [Comment]
>
> 参考文章结尾处的 Chrome 组策略模板压缩包中的 `.\windows\examples\chrome.reg`

### 修改组策略

> [Comment]
>
> 文章结尾处的 Chrome 组策略模板压缩包中还提供了组策略的模板，可以通过组策略允许加载。
>
> 二者的效果相同，而且组策略不适用于 Windows 家庭版用户，这里就不再赘述。

## 为什么 Chrome 要这么做？

因为 Windows 并没有隔离应用程序的数据，任何程序都可以访问 Chrome 的配置文件，Chrome 自己可以安装扩展程序、启用扩展程序，其他恶意程序也可以这么做，他们可以通过简单的修改配置文件，就达到了修改浏览器行为的目的。但是组策略并不是，修改组策略是需要管理员权限的。

之前就有其他人问：为什么 Chrome 保存的密码不加密，直接就可以显示密码？Chrome 的密码其实是加密过的，只有当前登录的 Windows 用户才能解密。如果你都选择直接把电脑借给别人，而不是用访客账户，那么 Chrome 加密有什么用呢。

## 相关链接

* 原文链接：<https://productforums.google.com/forum/#!msg/chrome/9NlMAr6uEVc/ambkrcKpi1cJ>
* 官方链接：<https://support.google.com/chrome/a/answer/188453>
* 官方说明文档：<http://dev.chromium.org/administrators/policy-list-3#ExtensionInstallForcelist>
* Chrome 组策略模板：<http://dl.google.com/dl/edgedl/chrome/policy/policy_templates.zip>
