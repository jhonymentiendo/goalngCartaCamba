package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
)

var environment string

func main() {

	env := flag.String("env", "", "Ambiente de la aplicacion")
	flag.Parse()
	if len(*env) == 0 {
		fmt.Fprintln(os.Stderr, "El argumento env es requerido")
		flag.PrintDefaults()
		os.Exit(1)
	}
	environment = *env
	portServer := consulRegistration()

	verificaCarpetas(pathtempfile, pathcachefiles, pathcacheimg, pathcachejson)
	router := NewRouter()
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./dragrevisa/prueba_drag_180424_concaja/"))))
	server := http.ListenAndServe(":"+portServer, router)
	log.Fatal(server)
}
