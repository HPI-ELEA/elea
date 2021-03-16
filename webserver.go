package main

import (
  "net/http"
  //"fmt"
  "io"
  "io/ioutil"
  "log"
)

func main() {
  //http.HandleFunc("/", servePage)
  fs := http.FileServer(http.Dir("./static"))
  http.Handle("/", fs)
	http.ListenAndServe(":8080", nil)
}

func readHTML() (text string) { 
  content, err := ioutil.ReadFile("static/main.html")
    if err != nil {
        log.Fatal(err)
    }
    // Convert []byte to string and print to screen
    text = string(content)
    //fmt.Print(text)
    return
}

func servePage(writer http.ResponseWriter, reqest *http.Request) {
  io.WriteString(writer, readHTML())
}