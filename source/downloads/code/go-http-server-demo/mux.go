package main

import (
	"net/http"
)

func hello(w http.ResponseWriter, req *http.Request) {
	w.Write([]byte("Hello, world!"))
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", hello)
	http.ListenAndServe(":8000", mux)
}
