package main

import (
	"bytes"
	"context"
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"image/png"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	wkhtml "github.com/SebastiaanKlippert/go-wkhtmltopdf"
	"github.com/godror/godror"
	"gopkg.in/fogleman/gg.v1"
)

func createPDF(w http.ResponseWriter, cartera Cartera, vt string) {

	htmlStr := traehtmlImagenes(vt)
	pdfg, err := wkhtml.NewPDFGenerator()
	check(err)
	pdfg.Dpi.Set(150)
	pdfg.NoCollate.Set(false)
	pdfg.PageSize.Set(PageSizeA4)
	pdfg.AddPage(wkhtml.NewPageReader(strings.NewReader(htmlStr)))
	err = pdfg.Create()
	check(err)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Length", strconv.Itoa(len(pdfg.Bytes())))
	if _, err := w.Write(pdfg.Bytes()); err != nil {
		log.Println("unable to write PDF.")
	}
	deletefrompathvt(pathtempfile, vt)
}

func traehtmlImagenes(vt string) (html string) {
	var files []string
	var buffer bytes.Buffer
	root, _ := filepath.Abs(pathtempfile)
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {

		if strings.ContainsAny(path, vt) == true {
			files = append(files, path)
			return nil
		} else {
			return nil
		}
	})
	if err != nil {
		panic(err)
	}
	var count = 0
	buffer.WriteString("<html>")
	for _, file := range files {
		if count == 0 {
			count++
		} else {
			buffer.WriteString("<img src='" + file + "'></img>")
		}
	}
	buffer.WriteString("</html>")
	return buffer.String()
}

func creaImagenEmpleado(vt string, empleado Empleado) {

	nombreCarta := empleado.Carta
	idTemp := strings.Split(nombreCarta, "_")
	idLetter, _ := strconv.Atoi(strings.Split(idTemp[1], ".")[0])
	var existeimgjsoncache = fileExists(pathcacheimg+"/"+strings.Split(idTemp[1], ".")[0]+".png") && fileExists(pathcachejson+"/"+strings.Split(idTemp[1], ".")[0]+".json")
	if existeimgjsoncache == true {
		//  img, err := ioutil.ReadFile(pathcacheimg + "/" + strings.Split(idTemp[1], ".")[0] + ".png") // ioutil.ReadAll(file)
		//  if err != nil {
		//  	panic(err)
		//  }
		//  coord, err := ioutil.ReadFile(pathcachejson + "/" + strings.Split(idTemp[1], ".")[0] + ".json") //ioutil.ReadAll(file2)
		//  if err != nil {
		//  	panic(err)
		//  }

		img, coord := getcartacordcache(idLetter)

		if len(img) > 0 {
			crearimagen(vt, empleado, img, string(coord))
			//deletefrompath(pathcachetempfiles)
		}
	} else {
		/*crea la nueva imagen y json*/
		img, coord := getcartacord(idLetter)
		if len(img) > 0 {
			crearcacehimagenjson(vt, empleado, img, coord)
			crearimagen(vt, empleado, img, coord)
			//log.Printf("----------------------")
			//log.Printf("------22222222222-----")
			//log.Printf("----------------------")
		}

	}
}

func crearcacehimagenjson(vt string, empleado Empleado, img []byte, coord string) {
	/*se debe guardar dos archivos una imagen y un json con la llave idCarta*/
	creacacheImagen(vt, empleado, img)
	creacachejson(vt, empleado, coord)
}

func creacacheImagen(vt string, empleado Empleado, img []byte) {
	nombreCarta := empleado.Carta
	idTemp := strings.Split(nombreCarta, "_")
	idLetter := strings.Split(idTemp[1], ".")[0]

	err := ioutil.WriteFile(pathcacheimg+"/"+idLetter+".png", img, 0777)
	if err != nil {
		panic(err)
	}

}

func creacachejson(vt string, empleado Empleado, coord string) {
	nombreCarta := empleado.Carta
	idTemp := strings.Split(nombreCarta, "_")
	idLetter := strings.Split(idTemp[1], ".")[0]

	err := ioutil.WriteFile(pathcachejson+"/"+idLetter+".json", []byte(coord), 0777)
	if err != nil {
		panic(err)
	}
}

func crearimagen(vt string, empleado Empleado, img []byte, coord string) {
	r := bytes.NewReader(img)
	imageP, err := png.Decode(r)
	if err != nil {
		panic(err)
	}
	var W = imageP.Bounds().Dx()
	var H = imageP.Bounds().Dy()
	dc := gg.NewContext(W, H)
	dc.DrawImage(imageP, 0, 0)
	var etiquetasCC EtiquetasCC
	json.Unmarshal(reemplazarParam([]byte(coord), empleado), &etiquetasCC)
	for _, v := range etiquetasCC.TextosPintar {
		dc.SetHexColor(v.ColorH)

		f, _ := strconv.ParseFloat(strconv.Itoa(v.TamanioFuente), 64)

		if err := dc.LoadFontFace("./fuentes/"+strings.Replace(v.TipoFuente, " ", "-", -1)+".ttf", f); err != nil {
			panic(err)
		}

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
	dc.SavePNG(pathtempfile + "/out" + vt + ".png")

}

/*------------------------------------------------------------------------*/

func getCartasExistentes2(cam int) (lista []Cartacamba) {
	db := getConnection()
	var err = db.Ping()
	check(err)
	defer db.Close()
	var refCursor driver.Rows
	var codigo int
	var mensaje string
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	qry := `DECLARE
				PA_CAMPA NUMBER;
				PA_CARTA SYS_REFCURSOR;
				CODE_ERROR NUMBER;
				DESC_ERROR VARCHAR2(200);
			BEGIN
				PQMULTIDATA.SPGETCARTAS(
				PA_CAMPA => :1,
				PA_CARTA => :2,
				CODE_ERROR => :3,
				DESC_ERROR => :4
				);
			END;`

	if cam == 0 {
		_, err = db.Exec(qry, nil, sql.Out{Dest: &refCursor}, sql.Out{Dest: &codigo}, sql.Out{Dest: &mensaje})
	} else {
		_, err = db.Exec(qry, cam, sql.Out{Dest: &refCursor}, sql.Out{Dest: &codigo}, sql.Out{Dest: &mensaje})
	}

	check(err)
	sub, err := godror.WrapRows(ctx, db, refCursor.(driver.Rows))
	check(err)
	defer sub.Close()

	var listatem []Cartacamba
	for sub.Next() {
		var campa int
		var blob interface{}
		var corrdenadas string
		if err := sub.Scan(&campa, &blob, &corrdenadas); err != nil {
			fmt.Println(err)
			break
		}
		listatem2 := Cartacamba{[]byte(``), campa, corrdenadas}
		listatem = append(listatem, listatem2)
	}

	return listatem
}

func getCartasExistentes(cam int) (lista []int) {
	db := getConnection()
	var err = db.Ping()
	check(err)
	defer db.Close()
	var refCursor driver.Rows
	var codigo int
	var mensaje string
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	qry := `DECLARE
				PA_CAMPA NUMBER;
				PA_CARTA SYS_REFCURSOR;
				CODE_ERROR NUMBER;
				DESC_ERROR VARCHAR2(200);
			BEGIN
				PQMULTIDATA.SPGETCARTAS(
				PA_CAMPA => :1,
				PA_CARTA => :2,
				CODE_ERROR => :3,
				DESC_ERROR => :4
				);
			END;`

	if cam == 0 {
		_, err = db.Exec(qry, nil, sql.Out{Dest: &refCursor}, sql.Out{Dest: &codigo}, sql.Out{Dest: &mensaje})
	} else {
		_, err = db.Exec(qry, cam, sql.Out{Dest: &refCursor}, sql.Out{Dest: &codigo}, sql.Out{Dest: &mensaje})
	}

	check(err)
	sub, err := godror.WrapRows(ctx, db, refCursor.(driver.Rows))
	check(err)
	defer sub.Close()

	var listatem []int
	for sub.Next() {
		var campa int
		var blob interface{}
		var corrdenadas string
		if err := sub.Scan(&campa, &blob, &corrdenadas); err != nil {
			fmt.Println(err)
			break
		}
		listatem2 := campa
		listatem = append(listatem, listatem2)
	}

	return listatem
}

func getcartacordcache(cam int) (img []byte, coord string) {
	var camp = strconv.Itoa(cam)
	img, err := ioutil.ReadFile(pathcacheimg + "/" + camp + ".png") // ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	coords, err := ioutil.ReadFile(pathcachejson + "/" + camp + ".json") //ioutil.ReadAll(file2)
	if err != nil {
		panic(err)
	}
	coord = string(coords)

	return img, coord
}

func getcartacord(cam int) (img []byte, coord string) {
	db := getConnection()
	var err = db.Ping()
	check(err)
	defer db.Close()
	var refCursor driver.Rows
	//cam := 200
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	qry := `DECLARE
				PA_IMAGEN           SYS_REFCURSOR;
			BEGIN
				PQMULTIDATA.SPGETCARTAIMG(
					PA_CAMPA       => :1,
					PA_IMAGEN      => :2);
			END;`

	_, err = db.Exec(qry, cam, sql.Out{Dest: &refCursor}) //, sql.Out{Dest: &codigo}, sql.Out{Dest: &mensaje})

	//log.Println(err)
	check(err)
	sub, err := godror.WrapRows(ctx, db, refCursor.(driver.Rows))
	check(err)
	defer sub.Close()
	//var arr []byte
	var stringcoord string
	for sub.Next() {
		//var campa int
		var blob interface{}
		var corrdenadas string
		if err := sub.Scan(&blob, &corrdenadas); err != nil {
			fmt.Println(err)
			break
		}
		arr := blob.([]byte)
		cord := corrdenadas
		img = arr
		stringcoord = string(cord)
	}

	// log.Printf("-------------------\n")
	// log.Printf(stringcoord)
	// log.Printf("-------------------\n")
	return img, stringcoord
}

func guardacarta(img []byte, campa int, etiq string) {
	db := getConnection()
	var err = db.Ping()
	check(err)
	defer db.Close()
	var cderr int
	var dderr string

	qry := `DECLARE
				PA_IMAGEN BLOB;
				PA_ETIQ VARCHAR2(200);
				PA_CAMAPA NUMBER;
				CODE_ERROR NUMBER;
				DESC_ERROR VARCHAR2(200);
			BEGIN
				PQMULTIDATA.SPSAVECARTAIMG(
				PA_IMAGEN => :1,
				PA_ETIQ => :2,
				PA_CAMAPA => :3,
				CODE_ERROR => :4,
				DESC_ERROR => :5
				);
			END;`

	_, err = db.Exec(qry, img, string(etiq), campa, sql.Out{Dest: &cderr}, sql.Out{Dest: &dderr})
	check(err)

}

func eliminacarta(campa int) {
	db := getConnection()
	var err = db.Ping()
	check(err)
	defer db.Close()
	var cderr int
	var dderr string

	qry := `DECLARE
				PA_CAMPA NUMBER;
				CODE_ERROR NUMBER;
				DESC_ERROR VARCHAR2(200);
			BEGIN
				PQMULTIDATA.SPDELETECARTAIMG(
				PA_CAMPA => :1,
				CODE_ERROR => :2,
				DESC_ERROR => :3
				);
			END;`
	_, err = db.Exec(qry, campa, sql.Out{Dest: &cderr}, sql.Out{Dest: &dderr})
	log.Println(cderr)
	log.Println(dderr)
	check(err)

}
