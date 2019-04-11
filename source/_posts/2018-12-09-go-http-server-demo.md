---
title: Go Simple HTTP Server Demo
date: 2018-12-09 06:01:35
categories:
  - demo
tags:
  - golang
  - http
  - server
  - demo
  - web
---

Build an http server in go is really easy. By using `net/http`, we can build a http server easily.

## Simple HTTP Server

{% include_code main.go 2018-12-09-go-http-server-demo/main.go %}

Run `go run main.go`

Visit <http://127.0.0.1:8000/>

Hello, world!

The `net/http` package provided by golang is really powerful, so sometimes you even don't need any web framework for a small project.

## Server Mux

{% include_code mux.go 2018-12-09-go-http-server-demo/mux.go %}

Run `go run mux.go`

We use a new `mux` as http handler.

### Why Should We Use Mux

If we don't use mux, `http.HandleFunc` makes `http` package messy. It polluted the global namespace. It's not so good when we are developing a package. We shouldn't modify other packages. We can only do things with a new instance.

The first example use `nil` handler. When `nil` provided, `http.DefaultServeMux` is used. All routes are registered in default mux. Any other package may be affected by this code.

When we use a new mux, routes are save in this mux. We can create multiple server listening different ports. Run them with goroutines.

```go
go http.ListenAndServe(":8000", mux)
go http.ListenAndServe(":8001", mux1)
// wait
```
