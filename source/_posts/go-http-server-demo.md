---
title: Go Simple HTTP Server Demo
date: 2018-12-09 06:01:35
tags:
  - golang
  - http
  - server
  - demo
  - web
---

Build an http server in go is really easy. By using `net/http`, we can build a http server easily.

{% include_code main.go go-http-server-demo/main.go %}

Run `go run main.go`

Visit <http://127.0.0.1:8000/>

Hello, world!

The `net/http` package provided by golang is really powerful, so sometimes you even don't need any web framework for a small project.
