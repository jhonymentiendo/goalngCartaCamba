
function guardainsertacampa() {

    var campa = document.getElementById("campa").value;
    var jsonEsc = document.getElementById("jsonEsc").value || '{"datosImagen":{"nombreImagen":"carta.png","idPais":1},"textosPintar":[]}';
    var myfile = document.getElementById("myfile").files[0];

    var formdata = new FormData();
    formdata.append("myfile", myfile, "cartainserta.png");
    formdata.append("campa", campa);
    formdata.append("etiq", jsonEsc);
    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };
    
    //fetch("http://localhost:8080/insertaImagenBase", requestOptions)
    fetch(origin+"/insertaImagenBase", requestOptions)
        .then(response => response.text())
        .then(function (v) {
            document.getElementById("jsonEsc").value = null;
            location.reload();
        })
        .catch(error => console.log('error', error));
}


function pidepdf(i) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    var raw = "{\n   \"empleado\":[\n    {\n        \"carta\":\"offerLetter_" + i + ".html\",\n        \"nombre\":\"AURELIANO ROMERO FLORES1\",\n        \"tienda\":\"MEGA SAN ANGEL\",\n        \"asesor\":\"YESICA PIAGA ZAPOxxxx\"\n}\n]\n}";

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    //fetch("http://localhost:8080/imprimeListaDeCartas", requestOptions)
    fetch(origin+"/imprimeListaDeCartas", requestOptions)
        .then(function (resp) {
            return resp.blob();
        })
        .then(function (blob) {
            download(blob);
        })
        .catch(error => console.log('error', error));
}

function eliminacampa(campa) {

    var formdata = new FormData();
    formdata.append("campa", '' + campa);

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    //fetch("http://localhost:8080/eliminacampana", requestOptions)
    fetch(origin+"/eliminacampana", requestOptions)
        .then(response => response.text())
        .then(function (v) { location.reload(); })
        .catch(error => console.log('error', error));

}

function pidecampanas() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    console.log('datos',origin)

    //fetch("http://localhost:8080/traelistacampanas", requestOptions)
    fetch(origin+"/traelistacampanas", requestOptions)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (jsonresp) {
            console.log(jsonresp);

            for (var i = 0; i < jsonresp.Lcampa.length; i++) {
                var element = document.querySelector("#ligasCampanas");
                var html = '<a class="elim" onclick="eliminacampa(' + jsonresp.Lcampa[i] + ')">X</a>    ||    <a onclick="pidepdf(' + jsonresp.Lcampa[i] + ')">pide pdf campa ' + jsonresp.Lcampa[i] + '</a><br>';
                element.insertAdjacentHTML('beforeend', html);
            }

        })
        .catch(error => console.log('error', error));
}

pidecampanas();