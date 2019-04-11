---
title: PHP 解密：EnPHP 混淆加密
date: 2019-03-01 20:08:55
categories:
  - hack
tags:
  - php
  - enphp
  - obfuscate
  - decrypt
  - encrypt
  - decode
---


## EnPHP

下面两段话摘录自 [EnPHP 官方网站](http://enphp.djunny.com/)

### 加密、混淆

EnPHP 支持加密混淆 PHP 代码。

EnPHP 可以对函数、参数、变量、常量以及内嵌 HTML 代码进行加密、混淆。

支持不同的加密强度、混淆方式

### EnPHP 可以破解吗？

代码，机器能解析就能还原，您使用任何一个加密工具都会有这个风险，理论上 EnPHP 被还原代码部分是可以的，但是 EnPHP 主打是的混淆+加密，打散、混淆才是 EnPHP的核心，EnPHP 是根据语法进行打散和混淆的，就算解密后，也是不可能还原变量名的！！！除非重新读一遍代码，将变量重新写上去。所以，那些所谓破解，是不可能还原语法和变量名的。如果您需要高强度的加密，可以联系管理员订制化加密。

### 我们的结论

我们应该是能还原代码的，但是不能还原变量名、函数名、方法名。如果想还原成原始代码是不可能了，但是如果只是想改一个注册码验证之类的，应该还是比较简单的。

## 分析过程

### 简单分析一下原理

我使用 [VSCode](https://code.visualstudio.com/) 打开这个文件，这个文件全都是不可读字符，如果用 UTF-8 来显示的话很不友好。

使用 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 打开快捷指令，输入 `encoding`，选择用 Change File Encoding，选择 Reopen with Encoding，选择 Western (Windows 1252)。

> [Tips]
>
> Windows 1252 是个单字节的字节集，不会出现任何 2 个字节被显示成 1 个字符的问题，其他的单字节集通常也可以。

我们只看代码部分，不看乱码部分。

![代码概况](/images/2019-03-14-enphp-decode/code.jpg)

```php
error_reporting(E_ALL ^ E_NOTICE);
define('字符串1', '字符串2');
一堆乱码1;
$GLOBALS[字符串1] = explode('字符串3', gzinflate(substr('字符串4', 0x0a, -8)));
一堆乱码2;
include $GLOBALS{字符串1}[0];
include $GLOBALS{字符串1}{0x001}(__FILE__) . $GLOBALS{字符串1}[0x0002];
```

解释一下我们分析出来的代码的含义

1. 抑制错误显示
2. 定义一个全局常量作为被加密字符串储存的名称
3. 一个不知道什么常量，毫无意义
4. `gzinflate` 就是 gzip 解压缩，把一个二进制的字节串还原成原始字符串，并用 `explode` 分成一堆小字符串。
5. 一个不知道什么常量，毫无意义
6. `$GLOBALS{字符串1}` 就是那一堆小字符串的储存位置，从中提取出第一个元素 `$GLOBALS{字符串1}[0]` 就是我们要还原的内容了。

### PHP-Parser

既然是乱码，我们又得请出我们的重量级选手了 [PHP-Parser](https://github.com/nikic/php-parser)

> [Comment]
>
> 这个库的作者是 nikic，其实他是 PHP 核心开发组的人员，这个解释器真的堪称完美。

新建一个文件夹作为这个工程的文件夹

创建 Composer 文件，安装 PHP-Parser

```bash
composer init
composer require nikic/php-parser
```

然后新建一个 `index.php` 先把 AST 解析写好。

> [Tips]
>
> 这个初始代码来自 <https://github.com/nikic/php-parser#quick-start>

> [Comment]
>
> 看乱码我用 VSCode，但是写代码我还是选择 PHPStorm。

```php

<?php
use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;

require 'vendor/autoload.php';

$code = file_get_contents(__DIR__ . '/tests//images/2019-03-14-enphp-decode/admin.php');

$parser = (new ParserFactory)->create(ParserFactory::PREFER_PHP7);

try {
    $ast = $parser->parse($code);
} catch (Error $error) {
    echo "Parse error: {$error->getMessage()}\n";
    return;
}

$dumper = new NodeDumper;
echo $dumper->dump($ast) . "\n";
```

### 找出有用的参数

我们必须从 AST 中把有用信息提取出来。

什么是有用的呢？

就是上面的字符串 1、3、4，不包括字符串 2，因为代码中根本就没用到，他只是一个临时的变量名称。还有 `substr` 的参数 `0x0a` 和 `-8`。

我们根据他在 AST 中的位置编写代码

```php
$str1 = $ast[1]->expr->args[0]->value->value;
$str3 = $ast[3]->expr->expr->args[0]->value->value;
$str4 = $ast[3]->expr->expr->args[1]->value->args[0]->value->args[0]->value->value;
$int1 = $ast[3]->expr->expr->args[1]->value->args[0]->value->args[1]->value->value;
$int2 = -$ast[3]->expr->expr->args[1]->value->args[0]->value->args[2]->value->expr->value;
```

如何知道他的位置？

![代码调试 1](/images/2019-03-14-enphp-decode/debug-1.jpg)

![代码调试 2](/images/2019-03-14-enphp-decode/debug-2.jpg)

> [Tips]
>
> 调试必须得配置好 XDebug，配置过程请自行百度。

![代码调试 3](/images/2019-03-14-enphp-decode/debug-3.jpg)

然后就可以得到 `$ast[1]->expr->args[0]->value->value` 这个了。

### 先看看解密之后的字符串是什么样子的

在原来的代码之后添加

```php
$string_array = explode($str3, gzinflate(substr($str4, $int1, $int2)));
print_r($string_array);
```

再次调试，看调试输出

```plain
Array
(
    [0] => config.php
    [1] => dirname
    [2] => /../include/class.db.php
    [3] => filter_has_var
    [4] => type
    [5] => json_encode
    [6] => success
    [7] => icon
    [8] => m
    [9] => 请勿非法调用！
    [10] => filter_input
......
    [152] => id错误，没有找到id！
    [153] => ua
    [154] => Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36
    [155] => curl
)
```

的确不出所料，我们要的字符串都出来了。

### 逐步还原

我们需要把代码中所有的 `$GLOBALS{字符串1}[0]`，都换成原来的字符串。

我们需要用到 NodeTraverser 了，他负责遍历 AST 的每一个节点

当他发现任何一个 Node 是下面这种结构的时候

```plain
Expr_ArrayDimFetch(
    var: Expr_ArrayDimFetch(
        var: Expr_Variable(
            name: GLOBALS
        )
        dim: Expr_ConstFetch(
            name: Name(
                parts: array(
                    0: �
                )
            )
        )
    )
    dim: Scalar_LNumber(
        value: 0
    )
)
```

他将直接把这个 Node 替换成

```plain
Scalar_String(
    value: $string_array[0]
)
```

```php
class GlobalStringNodeVisitor extends NodeVisitorAbstract
{
    protected $globalVariableName;
    protected $stringArray;

    public function __construct($globals_name, $string_array)
    {
        $this->globalVariableName = $globals_name;
        $this->stringArray = $string_array;
    }

    public function leaveNode(Node $node)
    {
        if ($node instanceof Node\Expr\ArrayDimFetch
            && $node->var instanceof Node\Expr\ArrayDimFetch
            && $node->var->var instanceof Node\Expr\Variable
            && $node->var->var->name === 'GLOBALS'
            && $node->var->dim instanceof Node\Expr\ConstFetch
            && $node->var->dim->name instanceof Node\Name
            && $node->var->dim->name->parts[0] === $this->globalVariableName
            && $node->dim instanceof Node\Scalar\LNumber
        ) {
            return new Node\Scalar\String_($this->stringArray[$node->dim->value]);
        }
        return null;
    }
}

$nodeVisitor = new GlobalStringNodeVisitor($str1, $string_array);
$traverser = new NodeTraverser();
$traverser->addVisitor($nodeVisitor);
$ast = $traverser->traverse($ast);

$prettyPrinter = new Standard;
echo $prettyPrinter->prettyPrintFile($ast);
```

运行结果

![初步运行结果 1](/images/2019-03-14-enphp-decode/result-1.jpg)

### 美化代码

我们看到 `('dirname')(__FILE__)` 这种代码不太符合正常代码书写习惯，我们需要把它改成 `dirname(__FILE__)`。

```php
class BeautifyNodeVisitor extends NodeVisitorAbstract
{
    public function enterNode(Node $node)
    {
        if ($node instanceof Node\Expr\FuncCall
            && $node->name instanceof Node\Scalar\String_) {
            $node->name = new Node\Name($node->name->value);
        }
        return null;
    }
}

$nodeVisitor = new BeautifyNodeVisitor();
$traverser = new NodeTraverser();
$traverser->addVisitor($nodeVisitor);
$ast = $traverser->traverse($ast);
```

运行结果

![代码美化](/images/2019-03-14-enphp-decode/beautify.jpg)

### 函数内部字符串

前面全局部分的代码看上去还不错，但是后面的函数内部代码还是有些乱码

![初步运行结果 2](/images/2019-03-14-enphp-decode/result-2.jpg)

它使用一个 `$局部变量1 =& $GLOBALS[字符串1]` 把这个全局变量变成局部变量了，我们必须遍历所有函数，把这些字符串替换掉。

原理就是发现 `$局部变量1 =& $GLOBALS[字符串1]` 则把 `局部变量1` 保存下来，之后再发现 `$局部变量1[0]` 则替换成 `$string_array[0]`。

（代码较长，此处省略）

运行结果

![函数内字符串](/images/2019-03-14-enphp-decode/strings-in-function.jpg)

### 函数局部变量名

这里的原理就是把所有参数名统一替换成 `$arg0`, `$arg1`，所有变量名统一替换成 `$v0`, `$v1`。

（代码较长，此处省略）

### 类的方法

由于样例文件中没有包含类的方法，所以对类方法变量名的去除乱码可能并不是很好。

### 去除无用常量语句

这个代码里面有一堆无用的调用常量的语句，完全不知道是干什么的，毫无意义，去掉。

（代码较长，此处省略）

![最终结果](/images/2019-03-14-enphp-decode/final.jpg)

### 自动寻找全局字符串变量

```php
$str1 = $ast[1]->expr->args[0]->value->value;
$str3 = $ast[3]->expr->expr->args[0]->value->value;
$str4 = $ast[3]->expr->expr->args[1]->value->args[0]->value->args[0]->value->value;
$int1 = $ast[3]->expr->expr->args[1]->value->args[0]->value->args[1]->value->value;
$int2 = -$ast[3]->expr->expr->args[1]->value->args[0]->value->args[2]->value->expr->value;
```

这个代码用的是固定的 `$ast[1]`, `$ast[3]`，但是实际上他并不一定总是 `1` 或 `3`，所以我们做得适用性强一些。自动寻找

```php
$GLOBALS[globalVarName] = explode('delimiter', gzinflate(substr('data', start, -length)))
```

这个句话的位置。

## 总结

只有局部变量的变量名不能还原。

其他所有的标识符（函数名、类名、方法名、函数调用、常量名）、字符串、数字全部都能成功还原。

代码结构完全没有加密，只需替换被混淆的名称即可。

## 相关链接

* [EnPHP 官方网站](http://enphp.djunny.com/)
* [PHP-Parser](https://github.com/nikic/php-parser)
* [本文代码仓库](https://github.com/ganlvtech/php-enphp-decoder)
