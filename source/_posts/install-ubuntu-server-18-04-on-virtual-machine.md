---
title: 虚拟机安装 Ubuntu Server 18.04
date: 2018-10-27 14:13:12
tags:
  - ubuntu
  - virtualbox
  - vm
  - filesystem
  - server
  - network
  - nic
  - nat
  - ssh
  - homestead
---

## 安装系统

系统安装过程很简单，基本上一路回车，最后输入个用户名密码，静静等待登录界面呈现在你的面前就行了。

{% bilibili 34732105 %}

## 共享文件夹

本段参考了 Ubuntu 社区文档 [VirtualBox/GuestAdditions]、[VirtualBox/SharedFolders]

### 虚拟机设置

在虚拟机设置中的共享文件夹选项中，可以添加共享文件夹。

选择共享文件夹路径，设置一个共享文件夹名称，自动挂载、固定分配。

> [Info]
>
> 那个共享文件夹名称叫做 share name，在虚拟机挂载时用于区分不同来源。
>
> 临时分配（transient）可以在虚拟机运行中随时添加，固定分配必须重启。
>
> 自动挂载（automount），自动挂载到 `/media/USER/sf_<name>` 或 `/media/sf_<name>`
>
> 详情参考 [VBoxManage 的说明文档][vboxmanage-docs]

### 虚拟机内安装扩展功能

想使用这个共享文件夹的功能，必须让虚拟机安装一个程序。

向虚拟机插入 Guest Additions 光盘。

![Insert Guest Additions CD image](/images/install-ubuntu-server-18-04-on-virtual-machine/insert-guest-addition-cd-image.jpg)

然后挂载光盘

```bash
cd /media/
sudo mkdir cdrom
sudo mount /dev/cdrom /media/cdrom/
```

然后安装即可

```bash
cd /media/cdrom/
sudo ./VBoxLinuxAdditions.run
```

### 虚拟机内挂载 vboxsf

最后挂载 `vboxsf` 即可

```bash
sudo mount -t vboxsf -o uid=1000,gid=1000 sharename ~/target
```

注意：这里的 `sharename` 需要替换成前面设置“共享文件夹”时设置的 share name，`~/target` 替换成挂载的目标文件夹。

> [Comment]
>
> `vboxsf` 并不是 `vboxfs`（VirtualBox Filesystem）写错了，应该是 `VirtualBox Shared Folders` 的简写。

## 双网卡

一块网卡使用 NAT（Network Address Translation，网络地址转换）方式连接外网，另一块使用 Host-Only 方式提供 SSH 服务

### 安装双网卡

首先在 `管理` `主机网络管理器` 中添加一块网卡，IPv4 填 `192.168.10.1`，IPv4 子网掩码填 `255.255.255.0`，DHCP 服务器不启用。

> [Notice]
>
> 因为我们想要在本地通过 SSH 连接这台服务器，所以不让 DHCP 动态分配 IP 地址，手动设一个固定的 IP。

然后到虚拟机设置中添加两块网卡，一块 `NAT`，另一块 `Host-Only`。

> [Info]
>
> VirtualBox 有两种 NAT，`网络地址转换(NAT)` 和 `NAT 网络`，其实就是 `NAT` 和 `NAT Network`。
>
> 在只有一台虚拟机的时候看不出什么意义，但是当有两台虚拟机同时开启的时候，你就会明白什么是 `NAT 网络` 了。
>
> 第一种是每个虚拟机单独连接外网。第二种是虚拟机先组成一个局域网，然后统一连接外网。第二种虚拟机之间可以在局域网中互相访问。

> [Comment]
>
> 中文翻译看不懂的时候，把语言调成英文说不定就明白了。

### 虚拟机内系统设置

Ubuntu 18.04 使用 [netplan] 管理网络，`/etc/network/interfaces` 已经弃用。

单个 NAT 很简单，无需任何配置，直接联网（因为虚拟机中相当于直接插网线，并且由 DHCP 分配 IP 地址，想上外网完全没有问题。

双网卡需要通过路由（route）的方式指定与哪个 IP 通信，走哪一个网卡。

手动新建一个 `/etc/netplan/01-netcfg.yaml`

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s8:
     addresses: [192.168.10.10/24]
     routes:
       - to: 192.168.10.1/24
         via: 192.168.10.1
```

然后应用设置即可

```bash
sudo netplan apply
```

> [Notice]
>
> 我最开始写的是
>
>     enp0s8:
>       addresses: [192.168.10.10/24]
>       gateway4: 192.168.10.1
>       routes:
>         - to: 192.168.10.1/24
>           via: 192.168.10.1
>
> 然后无论如何，所有的请求都会从这个网卡走，导致我不能通过 NAT 访问外网。
>
> 我在这里困惑了很久，最后发现 `routes` 不能和 `gateway4` 同时出现，启用 `gateway4` 相当于自动把全部目标都路由到这个网关了。

> [Notice]
>
> 系统自带一个 `/etc/netplan/50-cloud-init.yaml`，直接改这个也会生效，但是不推荐直接改这个，这个是 [cloud-init] 自动生成的，之后可能会被 cloud-init 覆盖掉。

> [Comment]
> 
> `enp0s8` 的意思是 `ethernet network peripheral 0 serial 8`

## 安装系统的目的

用过 [Laravel] [Homestead] 之后，就会觉得这个使用脚本自动控制虚拟机非常神奇。所以我也尝试自己安装一下，想学习一下 Homestead 是如何配置 Ubuntu 的，遇到了不少问题，也参考了 Homestead 的 Ruby 代码以及 shell 脚本，确实受益匪浅。

## 相关链接

* [What does "enp0s3" mean/stand for?][enp0s3-meaning]

[vboxmanage-docs]: https://www.virtualbox.org/manual/ch08.html#vboxmanage-sharedfolder
[VirtualBox/GuestAdditions]: https://help.ubuntu.com/community/VirtualBox/GuestAdditions
[VirtualBox/SharedFolders]: https://help.ubuntu.com/community/VirtualBox/SharedFolders
[cloud-init]: https://cloud-init.io/
[netplan]: https://netplan.io/
[enp0s3-meaning]: https://community.spiceworks.com/topic/975404-what-does-enp0s3-mean-stand-for
[Laravel]: https://laravel.com/
[Homestead]: https://laravel.com/docs/5.7/homestead
