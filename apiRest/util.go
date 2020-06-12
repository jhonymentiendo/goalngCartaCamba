package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

const PageSizeA4 = "A4"
const pathtempfile = "./img-temp-cc" //en esta carpeta se crean las imagenes finales, para el armado del pdf
const pathcachefiles = "./img-cache-cc"
const pathcacheimg = "./img-cache-cc/img"
const pathcachejson = "./img-cache-cc/json"

//const pathcachetempfiles = "./img-cache-cc/tempfiles"

var jsonmensajes = []byte(`{"datosImagen":{"nombreImagen":"carta.png","idPais":null},"textosPintar":[{"colorR":0,"colorG":0,"colorB":0,"tipoFuente":"Verdana","estiloFuente":1,"tamanioFuente":20,"texto":"#*NOMBRE*#","coordX":158,"coordY":172,"centrado":"false","width":145}]}`)

type Cartera struct {
	Empleado []Empleado `json:empleado`
}

type Empleado struct {
	Nombre string `json:"nombre"`
	Asesor string `json:"asesor"`
	Tienda string `json:"tienda"`
	Carta  string `json:"carta"`
}

type EtiquetasCC struct {
	DatosImagen  DatosImagen    `json:"datosImagen"`
	TextosPintar []TextosPintar `json:"textosPintar"`
}

type DatosImagen struct {
	NombreImagen string `json:"nombreImagen"`
	IdPais       int    `json:"idPais"`
}

type TextosPintar struct {
	ColorH string `json:"colorH"`
	//ColorR        int    `json:"colorR"`
	//ColorG        int    `json:"colorG"`
	//ColorB        int    `json:"colorB"`
	TipoFuente    string `json:"tipoFuente"`
	EstiloFuente  int    `json:"estiloFuente"`
	TamanioFuente int    `json:"tamanioFuente"`
	Texto         string `json:"texto"`
	CoordX        int    `json:"coordX"`
	CoordY        int    `json:"coordY"`
	Centrado      string `json:"centrado"`
	Width         int    `json:"width"`
}

type Ldcc struct {
	Lcampa []int
}

func fileExists(filename string) (resp bool) {
	info, err := os.Stat(filename)

	// log.Printf("----------------------")
	// log.Printf(filename)
	// log.Printf("----------------------")

	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

func reemplazarParam(texto []byte, empleado Empleado) (tmp []byte) {
	var resultado string
	resultado = string(texto)
	ParamIn := [][]string{{"#fechaActual#", time.Now().String()}, {"#*NOMBRE*#", empleado.Nombre}, {"#*ASESOR*#", empleado.Asesor}, {"#*TIENDA*#", empleado.Tienda}}
	for _, equivalencia := range ParamIn {
		resultado = strings.Replace(resultado, equivalencia[0], equivalencia[1], -1)
	}
	tmp = []byte(resultado)
	return tmp

}

func check(err error) {
	if err != nil {
		panic(err)
	}
}

func gettimekey() (tk string) {
	var re = regexp.MustCompile(`\s|\.|\:`)
	t := time.Now()
	vt := re.ReplaceAllString(t.Format(time.StampNano), `_`)
	return vt

}

func deletefilefrompath(path string, filename string) {
	if fileExists(path + "/" + filename) {
		err := os.Remove(path + "/" + filename)
		if err != nil {
			fmt.Println(err)
			return
		}
	}
}

func deletefrompath(path string) {
	var files []string
	root, _ := filepath.Abs(path)
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		files = append(files, path)
		return nil
	})
	if err != nil {
		panic(err)
	}
	var count = 0

	for _, file := range files {
		if count == 0 {
			count++
		} else {
			err := os.Remove(file)
			if err != nil {
				fmt.Println(err)
				return
			}
		}
	}

}

func verificaCarpetas(paths ...string) {
	for _, path := range paths {
		if _, err := os.Stat(path); os.IsNotExist(err) {
			os.Mkdir(path, 0777)
		} else {
			log.Printf(path + "ya existe")
		}
	}
}
