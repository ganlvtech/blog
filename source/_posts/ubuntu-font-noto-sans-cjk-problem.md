---
layout: post
date: 2018-09-29 15:25:00 +0800
title: Ubuntu Use Noto Sans CJK SC as Default Fallback Font
tags:
  - ubuntu
  - locale
  - i18n
---

[如何正确为 Noto Sans CJK 配置 fontconfig 使中文不会被显示为日文字型？][how-to-configure-noto-sans-cjk]

## How to

```bash
sudo vi /etc/fonts/conf.d/64-language-selector-prefer.conf
```

Use `yy` (yield a whole line) and `p` (paste) to move `Noto Sans CJK SC` to the first. And then `:wq` (write and quite). Restart running program may apply the changes.

## About The Default Order

`JP, KR, SC, TC`. They are sorted by alphabet. So a newly installed copy of Ubuntu would prefer `Noto Sans CJK JP` as default fallback font.

> `CJK`, `Chinese, Japanese, Korean`, is also sorted by alphabet resulting in Chinese `C` first.

[how-to-configure-noto-sans-cjk]: https://www.zhihu.com/question/47141667
