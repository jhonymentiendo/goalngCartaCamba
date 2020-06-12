package main

import (
	"encoding/json"
	"fmt"
	"image/png"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	wkhtml "github.com/SebastiaanKlippert/go-wkhtmltopdf"
	"github.com/gorilla/mux"
	"gopkg.in/fogleman/gg"
)

/*
type Page struct {
	Title string
	Body  []byte
}

func loadPage(title string) *Page {
	root, _ := filepath.Abs("./dragrevisa/prueba_drag_180424_concaja")
	filename := "indexdrg.html"
	log.Printf(root + filename)
	body, _ := ioutil.ReadFile(root + "/" + filename)
	log.Printf(string(body))
	return &Page{Title: title, Body: body}
}

func Pagcartas(w http.ResponseWriter, r *http.Request) {
	log.Printf("prueba")
	p2 := loadPage("indexdrg")
	fmt.Fprintf(w, string(p2.Body))
}
*/

func Eliminacampana(w http.ResponseWriter, r *http.Request) {
	campa := r.PostFormValue("campa")
	campai, err := strconv.Atoi(campa)
	var resp = ""
	if err != nil {
		//log.Printf(err)
		//panic(err)
		resp = "false"
	} else {
		eliminacarta(campai)
		deletefilefrompath(pathcachejson, campa+".json")
		deletefilefrompath(pathcacheimg, campa+".png")
		resp = "true"
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, resp)
}

func Traelistacampanas(w http.ResponseWriter, r *http.Request) {
	var l []int
	campa := r.PostFormValue("campa")
	campai, err := strconv.Atoi(campa)
	if err != nil {
		//panic(err)
		l = getCartasExistentes(0)
	} else {
		l = getCartasExistentes(campai)
	}
	//l = getCartasExistentes(0)
	ldcc := Ldcc{l}
	js, err := json.Marshal(ldcc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func InsertaImagenBase(w http.ResponseWriter, r *http.Request) {

	campa := r.PostFormValue("campa")
	campai, err := strconv.Atoi(campa)
	if err != nil {
		panic(err)
	}

	etiq := r.PostFormValue("etiq")
	//log.Printf(etiq)

	file, _, err := r.FormFile("myfile")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	guardacarta(fileBytes, campai, etiq)
	deletefilefrompath(pathcachejson, campa+".json")
	deletefilefrompath(pathcacheimg, campa+".png")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, "true")
}

func ImprimeListaDeCartas(w http.ResponseWriter, r *http.Request) {
	vt := gettimekey()
	decoder := json.NewDecoder(r.Body)
	var cartera Cartera
	err := decoder.Decode(&cartera)
	if err != nil {
		panic(err)
	}
	defer r.Body.Close()
	for k, empleado := range cartera.Empleado {
		creaImagenEmpleado(vt+strconv.Itoa(k), empleado)
	}
	createPDF(w, cartera, vt)
}

func traedebase(w http.ResponseWriter, r *http.Request) {

	stringHTML, stringcoord := getcartacord(100)
	v := string(stringHTML)
	fmt.Fprintf(w, "-------------------\n")
	fmt.Fprintf(w, "-------------------\n")
	fmt.Fprintf(w, v+"\nconsulta terminada 2\n"+stringcoord)
}

func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hola Mundo")
}

func Contacto(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Respuesta de el contacto")
}

func Carpdfcli(w http.ResponseWriter, r *http.Request) {

	pdfg, err := wkhtml.NewPDFGenerator()
	check(err)
	pdfg.Dpi.Set(150)
	pdfg.NoCollate.Set(false)
	pdfg.PageSize.Set(PageSizeA4)
	htmlStr := "<html><img src='/home/b337289/Documentos/gogs/cd_fuente_go/apiRest20200602/temp-file/out0.png'></img><img src='/home/b337289/Documentos/gogs/cd_fuente_go/apiRest20200602/temp-file/out1.png'></img><img src='/home/b337289/Documentos/gogs/cd_fuente_go/apiRest20200602/temp-file/out2.png'></img></html>"
	pdfg.AddPage(wkhtml.NewPageReader(strings.NewReader(htmlStr)))
	err = pdfg.Create()
	check(err)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Length", strconv.Itoa(len(pdfg.Bytes())))
	if _, err := w.Write(pdfg.Bytes()); err != nil {
		log.Println("unable to write PDF.")
	}

}

func Contactonm(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	nmCont := params["nmCont"]
	vt := gettimekey()
	//fmt.Println(re.ReplaceAllString(t.Format(time.StampNano), ``))
	fmt.Fprintf(w, "Hola "+nmCont+" "+vt)

}

func creaimagen(w http.ResponseWriter, r *http.Request) {
	file, handler, err := r.FormFile("myfile")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	http.ServeContent(w, r, handler.Filename, time.Now(), file)
}

func regresaArchivo(w http.ResponseWriter, r *http.Request) {
	/*se nota aqui que si mandas un archivo como metodo post, el tipo de dato multipart.File regresa integro el archivo*/
	file, handler, err := r.FormFile("myfile")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	http.ServeContent(w, r, handler.Filename, time.Now(), file)
}

func creacartacord(w http.ResponseWriter, r *http.Request) {

	file, handler, err := r.FormFile("myfile")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	//obten el tipo, para su posterior distincion
	s := strings.Split(handler.Header.Values("Content-Type")[0], "/")[1]
	fmt.Fprintf(w, s)

	tempfile, err := ioutil.TempFile(pathtempfile, "carta-*.png")
	if err != nil {
		panic(err)
	}
	defer tempfile.Close()
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	//usna ves procesada la imagen, se escribe en carpeta temporal, se usa base 64
	tempfile.Write(fileBytes)
	tempfile.Seek(0, 0)

	imageP, err := png.Decode(tempfile)
	if err != nil {
		panic(err)
	}
	var W = imageP.Bounds().Dx()
	var H = imageP.Bounds().Dy()
	im, err := gg.LoadImage(tempfile.Name())
	if err != nil {
		log.Fatal(err)
	}

	dc := gg.NewContext(W, H)
	dc.SetRGB(1, 1, 1)
	dc.Clear()
	dc.SetRGB(0, 0, 0)
	if err := dc.LoadFontFace("./arial.ttf", 30); err != nil {
		panic(err)
	}

	dc.DrawImage(im, 0, 0)

	var etiquetasCC EtiquetasCC
	json.Unmarshal([]byte(jsonmensajes), &etiquetasCC)
	for _, v := range etiquetasCC.TextosPintar {
		posX, err := strconv.ParseFloat(strconv.Itoa(v.CoordX), 64)
		if err != nil {
			posX = 0.0
		}
		posY, err := strconv.ParseFloat(strconv.Itoa(v.CoordY), 64)
		if err != nil {
			posY = 0.0
		}
		dc.DrawStringAnchored(v.Texto, posX, posY, 0, 0)
	}

	dc.Clip()
	dc.SavePNG(pathtempfile + "/out.png")

	tempfile2, err := os.Open(pathtempfile + "/out.png")
	if err != nil {
		panic(err)
	}
	defer tempfile2.Close()

	http.ServeContent(w, r, "out", time.Now(), tempfile2)

}

func creaimagen2(w http.ResponseWriter, r *http.Request) {

	file, handler, err := r.FormFile("myfile")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	//obten el tipo, para su posterior distincion
	s := strings.Split(handler.Header.Values("Content-Type")[0], "/")[1]
	fmt.Fprintf(w, s)

	tempfile, err := ioutil.TempFile(pathtempfile, "carta-*.png")
	if err != nil {
		panic(err)
	}
	defer tempfile.Close()
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	//usna ves procesada la imagen, se escribe en carpeta temporal, se usa base 64
	tempfile.Write(fileBytes)
	tempfile.Seek(0, 0)

	imageP, err := png.Decode(tempfile)
	if err != nil {
		panic(err)
	}
	var W = imageP.Bounds().Dx()
	var H = imageP.Bounds().Dy()
	im, err := gg.LoadImage(tempfile.Name())
	if err != nil {
		log.Fatal(err)
	}

	dc := gg.NewContext(W, H)
	dc.SetRGB(1, 1, 1)
	dc.Clear()
	dc.SetRGB(0, 0, 0)
	if err := dc.LoadFontFace("./arial.ttf", 30); err != nil {
		panic(err)
	}
	dc.DrawImage(im, 0, 0)

	var etiquetasCC EtiquetasCC
	json.Unmarshal([]byte(jsonmensajes), &etiquetasCC)
	for _, v := range etiquetasCC.TextosPintar {
		posX, err := strconv.ParseFloat(strconv.Itoa(v.CoordX), 64)
		if err != nil {
			posX = 0.0
		}
		posY, err := strconv.ParseFloat(strconv.Itoa(v.CoordY), 64)
		if err != nil {
			posY = 0.0
		}
		dc.DrawStringAnchored(v.Texto, posX, posY, 0, 0)
	}

	dc.Clip()
	dc.SavePNG(pathtempfile + "/out.png")

	tempfile2, err := os.Open(pathtempfile + "/out.png")
	if err != nil {
		panic(err)
	}
	defer tempfile2.Close()

	http.ServeContent(w, r, "out", time.Now(), tempfile2)
}

func usaimagen(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "-------PROCESO INICIA CORRECTO-------\n")
	/*limita el peso del file que recibe*/
	r.ParseMultipartForm(10 << 20)
	/*toma file del body de la peticion*/
	file, handler, err := r.FormFile("myfile")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	fmt.Fprintf(w, "archivo movido exitosamente %+v\n", handler.Filename)
	fmt.Fprintf(w, "peso %+v\n", handler.Size)
	fmt.Fprintf(w, "MYME header %+v\n", handler.Header)
	fmt.Fprintf(w, "----MYME header %+v\n", handler.Header.Values("Content-Type")[0])
	fmt.Fprintf(w, "----MYME header %+v\n", handler.Header.Values("Content-Type")[0])

	/*obten el tipo, para su posterior distincion*/
	s := strings.Split(handler.Header.Values("Content-Type")[0], "/")[1]
	fmt.Fprintf(w, s)

	//pngi, err := png.Decode(file)

	//se crea un archivo termporal en el servidor que se puede usar para guardar en base
	tempfile, err := ioutil.TempFile(pathtempfile, "carta-*."+s)
	if err != nil {
		panic(err)
	}
	defer tempfile.Close()
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	/*usna ves procesada la imagen, se escribe en carpeta temporal, se usa base 64*/
	tempfile.Write(fileBytes)
	fmt.Fprintf(w, "-------PROCESO TERMINADO CORRECTO-------")
}
