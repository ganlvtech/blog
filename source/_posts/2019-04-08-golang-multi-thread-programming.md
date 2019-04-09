---
title: Golang 多线程编程
date: 2019-04-08 23:35:51
tags:
  - golang
  - thread
  - goroutine
---

我们在写某个程序时，经常需要同时进行多个任务。如果使用 Java 的话，做法通常就是开启多个线程，然后各个线程运行各自的任务，然后使用线程间通信、共用变量等等方法实现结果的传递。

但是 Golang 的 goroutine 并不是线程，他并不是抢占式调度。所以你必须要注意以下问题

1. 非抢占式调度不能再单核上同时执行多个 goroutine。一个 goroutine 会一直运行下去，直到它被阻塞。

2. 没有任何方法从外部强行终止一个 goroutine，你只能在创建 goroutine 时传入一个 channel，从外部关闭这个 channel，然后在 goroutine 中定期检查这个 channel 是否被关闭，从而从内部主动结束这个 goroutine。

3. 没有任何方法从外部判断一个 goroutine 是否已经结束，你只能在创建 goroutine 传入一个 channel，在结束时关闭这个 channel，这样外部就可以知道这个 goroutine 结束了。

由于这些局限，我们创建 goroutine 的时候应该是这样的。

1. 如果你不在乎这个 goroutine 的生死，那就直接

```go
go func() {
    // do things
}()
```

2. 如果你希望知道这个 goroutine 什么时候结束。

```go
done := make(chan struct{})
go func(done chan<- struct{}) {
    for {
        // do things
        if (...) {
            break
        }
    }
    close(done)
}(done)
<-done // this will be blocked util goroutine end.
```

3. 如果你希望随时可以控制 goroutine 中断

```go
interrupt := make(chan struct{})
go func(interrupt <-chan struct{}) {
    for {
        select {
        case <-interrupt:
        default:
            // do things
        }
    }
}(interrupt)
close(interrupt) // when you need interrupt it.
```

4. 既有 interrupt 又有 done

