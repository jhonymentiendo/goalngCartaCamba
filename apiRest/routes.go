package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

// Route Tipo para almacenar una ruta de un WebService
type Route struct {
	Name       string
	Method     string
	Pattern    string
	HandleFunc http.HandlerFunc
}

// Routes Arreglo de Route
type Routes []Route

// NewRouter Crea un nuevo ruteo de servicios.
func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	for _, route := range routes {
		router.Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(route.HandleFunc)
	}

	return router
}

var routes = Routes{
	Route{
		"usaimagen",
		"POST",
		"/usaimagen",
		usaimagen,
	},
	Route{
		"Contactonm",
		"POST",
		"/contactonm/{nmCont}",
		Contactonm,
	},
	Route{
		"creaimagen",
		"POST",
		"/creaimagen",
		creaimagen,
	},
	Route{
		"creaimagen2",
		"POST",
		"/creaimagen2",
		creaimagen2,
	},
	Route{
		"creacartacord",
		"POST",
		"/creacartacord",
		creacartacord,
	},
	Route{
		"imprimeListaDeCartas",
		"POST",
		"/imprimeListaDeCartas",
		ImprimeListaDeCartas,
	},
	Route{
		"carpdfcli",
		"POST",
		"/carpdfcli",
		Carpdfcli,
	},
	Route{
		"traedebase",
		"POST",
		"/traedebase",
		traedebase,
	},
	Route{
		"insertaImagenBase",
		"POST",
		"/insertaImagenBase",
		InsertaImagenBase,
	},
	Route{
		"traelistacampanas",
		"GET",
		"/traelistacampanas",
		Traelistacampanas,
	},
	Route{
		"eliminacampana",
		"POST",
		"/eliminacampana",
		Eliminacampana,
	},
	/*Route{
		"pagcartas",
		"GET",
		"/pagcartas",
		Pagcartas,
	},*/
}
