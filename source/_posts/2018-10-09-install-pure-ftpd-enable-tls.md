---
title: 安装 Pure-FTPd 并启用 TLS
date: 2018-10-09 01:38:17
categories:
  - installation
tags:
  - ftp
  - pure-ftpd
  - ssl
  - tls
  - ubuntu
---

<!-- toc -->

我使用的系统是 Ubuntu Server 18.04 LTS。

> [Comment]
>
> 其实我用的是 [Laravel Homestead][homestead] 的 [Vagrant][vagrant] [Box][homestead-box]，一个非常方便的虚拟机。

本文参考了 [Pure-FTPd][pure-ftpd] 的 [Ubuntu Community Wiki][pure-ftpd-ubuntu-community-help]

## 安装 Pure-FTPd

```bash
sudo apt install pure-ftpd
```

### 查看一下端口

这是一个很常见的指令

```bash
sudo netstat -tlnp
```

* `t` 表示 TCP，只显示 TCP 连接
* `l` 表示 listening，只显示正在监听的 Socket
* `n` 表示 numeric，就是只显示 IP 数值，不解析域名
* `p` 表示 programs 显示 PID/Program name

可以看到其中这两行，表示 Pure-FTPd 在对外监听 IPv4 和 IPv6 的 21 端口。

```plain
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:21              0.0.0.0:*               LISTEN      2663/pure-ftpd (SER
tcp6       0      0 :::21                   :::*                    LISTEN      2663/pure-ftpd (SER
```

> [Info]
>
> Local Address 是 `0.0.0.0` 表示对外监听，如果是 `127.0.0.1` 的话就是只监听本机，外部的请求无法访问到这个端口。

### 尝试连接一下

我们可以用 [FileZilla][filezilla] 连接一下试试。

暂时用匿名用户 `anonymous` 登录，可以看到服务器回应 `Login authentication failed`，证明服务器是安装成功了，但是还没创建 FTP 用户呢。

> [Info]
>
> Laravel Homestead 虚拟机默认的 IP 是 `192.168.10.10`。

### 启用虚拟账户

Pure-FTPd 可以使用虚拟账户，这个账户与 Linux 系统的账户无关，仅仅用于 FTP 登录验证。你可以很多 FTP 账户而不会把系统弄乱。

```bash
sudo ln -s /etc/pure-ftpd/conf/PureDB /etc/pure-ftpd/auth/PureDB
```

### 重启 FTP 服务器

重启 FTP 服务器，应用配置。

```bash
sudo service pure-ftpd restart
```

### 添加账号

```bash
sudo pure-pw useradd ganlv -u vagrant -d /home/vagrant/
```

* `ganlv` 是我一会 FTP 登录时输入的用户名。
* `vagrant` 表示用哪个 Linux 系统账户来完成 FTP 文件操作。
* `/home/vagrant/` 表示登录 FTP 之后的根目录 `/`。

Linux 下每个文件和文件夹都有用户和用户组，所以需要特定用户才能操作。虽然有虚拟账户系统，但是还是需要用一个系统账户来进行操作的，总不能用 root 账户来操作吧。

> [Notice]
>
> 其实在登录之后，`pure-ftpd` 会用权限较低用户（就是设置的 `vagrant`）创建一个新进程来执行操作，保证以较低的权限来执行操作。

然后输入两遍密码就创建完成了。

其实，这时还是登录不上的。还需要把文本文件 `/etc/pure-ftpd/pureftpd.passwd` 转换成 `/etc/pure-ftpd/pureftpd.pdb`，后面的 PDB 文件才是程序真正读取的用户数据库。

```bash
sudo pure-pw mkdb
```

可以在添加账号时直接使用 `-m` 直接 `mkdb`，把两步合并成一步。

```bash
sudo pure-pw useradd ganlv -u vagrant -d /home/vagrant/ -m
```

添加账号并不需要重启 FTP 服务器。

## 配置 TLS

### 启用强制 TLS

这部分需要使用 root 用户来操作，但是 sudo 又不是很方便，所以直接用 `su` 切换到 root。

```bash
sudo su
```

```bash
echo 2 > /etc/pure-ftpd/conf/TLS
```

如果想既允许普通的 FTP 又支持 FTPS，那就用 `echo 1`。

然后 `exit` 退出 root 账户。

### 生成证书

然后去生成一个自签发的证书。

如果 `/etc/ssl/private/` 这个目录不存在的话就新建一个。如果存在的话就没事了。要注意这个目录的权限。

```
mkdir -p /etc/ssl/private/
chown root:root /etc/ssl/private/
chmod 700 /etc/ssl/private/
```

我的 Ubuntu 是自带这个目录的，默认是 `root:ssl-cert 710` 的权限，和 [StackOverflow 上的一个答案][ubuntu-ssl-cert-permission] 差不多。我感觉不到什么区别。

```plain
drwx--x---   2 root ssl-cert  4096 Jun  3 19:59 private
```

用 openssl 生成证书，填好证书的各种信息，不想看的话就一直回车就行了。

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/pure-ftpd.pem -out /etc/ssl/private/pure-ftpd.pem
```

### 重启 FTP 服务器

凡是修改配置文件，肯定要重启，因为配置文件只在程序启动的时候加载，之后就不会再读取配置了。

## 大功告成

FileZilla 连接一下试一试

![使用 Pure-FTPd 连接到 FTP 服务器](/images/2018-10-09-install-pure-ftpd-enable-tls/filezilla-connect.jpg)

确定即可，信任这个证书，以后就不会再提示了。

站点管理器中也可以要求显式的 FTP 通过 TLS。

![要求显式的 FTP 通过 TLS](/images/2018-10-09-install-pure-ftpd-enable-tls/filezilla-explicit-tls.jpg)

## 关于 Pure-FTPd 的配置文件

Pure-FTPd 并不是使用 `/etc/pure-ftpd/pure-ftpd.conf` 来作为配置文件，可以看 `pure-ftpd.conf` 这个文件的开头的说明。

```conf
# If you want to run Pure-FTPd with this configuration
# instead of command-line options, please run the
# following command :
#
# /usr/sbin/pure-ftpd /etc/pure-ftpd/etc/pure-ftpd.conf
```

如果你想用这个配置文件运行 Pure-FTPd，你必须要在命令行后面加上这个文件路径作为参数。

如果你不用这个配置文件，直接修改 `/etc/pure-ftpd/conf/` 下的文件内容就行。

[pure-ftpd]: https://www.pureftpd.org/
[pure-ftpd-ubuntu-community-help]: https://help.ubuntu.com/community/PureFTP
[homestead]: https://laravel.com/docs/5.7/homestead
[vagrant]: https://www.vagrantup.com/
[homestead-box]: https://app.vagrantup.com/laravel/boxes/homestead
[filezilla]: https://filezilla-project.org/
[ubuntu-ssl-cert-permission]: https://serverfault.com/questions/259302/best-location-for-ssl-certificate-and-private-keys-on-ubuntu/259307#259307
