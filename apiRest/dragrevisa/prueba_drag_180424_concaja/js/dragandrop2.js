
var jsong = { "datosImagen": { "nombreImagen": null, "idPais": null }, "textosPintar": [] }
var lstParambtns;

$(document).ready(function () {
    lstParambtns = JSON.parse('[]');//oculto.getAttribute("value"));
    /*por el momento puse los token de gato que tienen*/

    lstParambtns.push({ "val": "", "nomLstBtn": "Boton opciones antiguas", "nombreLista": "opcionesAntiguas" });


    for (var i = 0; i < lstParambtns.length; i++) {
        if (lstParambtns[i].nombreLista !== undefined && lstParambtns[i].nombreLista === "opcionesAntiguas") {
            
            var val = "";
            val = '[{"idBtn":"nombreCliente","nomBtn":"nombreCliente","vlr":"#*NOMBRE*#","type":"string","className":"none"},' +
                '{"idBtn":"fechaActual","nomBtn":"fechaActual","vlr":"#fechaActual#","type":"string","className":"none"},' +
                '{"idBtn":"CPD","nomBtn":"CPD","vlr":"#CPD#","type":"string","className":"none"},' +
                '{"idBtn":"direccion","nomBtn":"direccion","vlr":"#direccion#","type":"string","className":"none"},' +
                '{"idBtn":"sucursal","nomBtn":"sucursal","vlr":"#*TIENDA*#","type":"string","className":"none"},' +
                '{"idBtn":"vendedor","nomBtn":"vendedor","vlr":"#*ASESOR*#","type":"string","className":"none"},' +
                '{"idBtn":"idCliente","nomBtn":"idCliente","vlr":"#idCliente#","type":"string","className":"none"},' +
                '{"idBtn":"monto","nomBtn":"monto","vlr":"#monto#","type":"string","className":"none"},' +
                '{"idBtn":"abonoPuntual","nomBtn":"abonoPuntual","vlr":"#abonoPuntual#","type":"string","className":"none"},' +
                '{"idBtn":"abonoNormal","nomBtn":"abonoNormal","vlr":"#abonoNormal#","type":"string","className":"none"},' +
                '{"idBtn":"direccionPreA","nomBtn":"direccionPreA","vlr":"#direccionPreA#","type":"string","className":"none"},' +
                '{"idBtn":"fechaMes","nomBtn":"fechaMes","vlr":"#fechaMes#","type":"string","className":"none"},' +
                '{"idBtn":"diaVigencia","nomBtn":"diaVigencia","vlr":"#diaVigencia#","type":"string","className":"none"},' +
                '{"idBtn":"mesVigencia","nomBtn":"mesVigencia","vlr":"#mesVigencia#","type":"string","className":"none"}]';
            lstParambtns[i].val = val;
        }
    }
    //	lstParambtns.push({'idBtn':'nombreCliente','nomBtn':'nombreCliente','vlr':'#nombreCliente#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'fechaActual','nomBtn':'fechaActual','vlr':'#fechaActual#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'CPD','nomBtn':'CPD','vlr':'#CPD#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'direccion','nomBtn':'direccion','vlr':'#direccion#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'sucursal','nomBtn':'sucursal','vlr':'#sucursal#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'vendedor','nomBtn':'vendedor','vlr':'#vendedor#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'idCliente','nomBtn':'idCliente','vlr':'#idCliente#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'monto','nomBtn':'monto','vlr':'#monto#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'abonoPuntual','nomBtn':'abonoPuntual','vlr':'#abonoPuntual#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'abonoNormal','nomBtn':'abonoNormal','vlr':'#abonoNormal#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'direccionPreA','nomBtn':'direccionPreA','vlr':'#direccionPreA#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'fechaMes','nomBtn':'fechaMes','vlr':'#fechaMes#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'diaVigencia','nomBtn':'diaVigencia','vlr':'#diaVigencia#','type':'string','className':'none',});
    //	lstParambtns.push({'idBtn':'mesVigencia','nomBtn':'mesVigencia','vlr':'#mesVigencia#','type':'string','className':'none',});
    llenaListaBotones();
});

function llenaListaBotones() {
    $.each(lstParambtns, function (i, l) {
        if (l.nombreLista != undefined && l.val != undefined && l.val.length > 0) {

            var nomList = l.nombreLista.replace('/(\_)|(\.)|(\]|\[)/g', '');

            $('#tabs').append('<div class="dropdown"><div class="dropbtn"  onclick="muestraDrop(\'' + nomList + '\')">' + l.nomLstBtn
                + '</div><div class="dropdownContent" id="myDropdown' + nomList + '"><input class="myInput" type="text" placeholder="Search.." id="myInput' + nomList
                + '" onkeyup="filterFunction(this)"><ul id="pagin' + nomList + '"></ul></div></div>');


            var v = JSON.parse(l.val);
            /*agregarle el elemento*/
            $.each(v, function (i2, l2) {
                $('#myDropdown' + nomList).append('<div drpval="' + nomList + '" class="tablinks line-content ' + nomList + '" val="' + l2.vlr + '" onclick="creardraggable(\'' + l2.idBtn + '\',\'' + l2.vlr + '\');" id="carga' + l2.idBtn + '">' + l2.nomBtn + '</div>');
            });
            pagina(nomList);

        } else {
            if (l.vlr !== undefined & l.nomBtn !== undefined) {
                $('#tabs').append('<div class="dropdown dropbtn" val="' + l.vlr + '" onclick="creardraggable(\'' + l.nomBtn + '\',\'' + l.vlr + '\');" id="carga' + l.nomBtn + '">' + l.nomBtn + '</div>');
            }
        }
    });
}

var coordinates = function (element) {
    getJsonsTextarea();
}


function getJsonsTextarea() {
    var textareas = ($('.cajaConfig')[0] === undefined ? [] : $('.cajaConfig'));
    var msg = [];

    //var nombreArch= getNombreArch($("input[type='file'][name='form17:archivoCC']").val());
    var nombreArch = getNombreArch($("input[type='file'][name='imagefile']").val());
    jsong['datosImagen']['nombreImagen'] = nombreArch;
    for (var i = textareas.length - 1; i >= 0; i--) {

        var element = $('#' + textareas[i].id);

        var jsn = {
            // colorR: null, //YA
            // colorG: null, //YA
            // colorB: null, //YA
            tipoFuente: null, //YA
            estiloFuente: null, //ya lo obtengo aun no lo seteo
            tamanioFuente: null, //ya lo obtengo aun no lo seteo
            texto: null, //debo distinguir si son fijos o es el libre
            coordX: null, //YA
            coordY: null, //YA
            centrado: null, //ya lo obtengo aun no lo seteo
            width: null //no se de donde lo calculan
        }

        /*posiciones lo obtengo de .caja*/
        var cx = element.position() == undefined ? 0 : (element.position().left + 13);
        jsn['coordX'] = parseInt(parseInt(cx).toFixed(0));
        var cy = element.position() == undefined ? 0 : (element.position().top + 64);
        jsn['coordY'] = parseInt(parseInt(cy).toFixed(0));
        /*color,fuente,estilo,tamanio,texto...centrado y width(no los tengo,será duro) 
         lo obtengo de .texarea dentro de .caja*/
        var textarea = document.getElementById(textareas[i].id + 'canvasTextarea');
        var instance = sceditor.instance(textarea);
        var val = instance.val();/*de aqui puedo sacar color,texto,alineación*/
        var css = instance.css();
        var etik = encuentraEtiquetas(val);
        var colorHex = obtenColoretk(etik)
        var rgb = hexToRgb(colorHex);
        jsn['colorH'] = colorHex === null ? '#000000' : colorHex ;
        // jsn['colorR'] = rgb === null ? 0 : rgb.r;
        // jsn['colorG'] = rgb === null ? 0 : rgb.g;
        // jsn['colorB'] = rgb === null ? 0 : rgb.b;
        var tpf = obtenFuenteetk(etik)
        jsn['tipoFuente'] = tpf === null ? 'Verdana' : tpf;
        jsn['estiloFuente'] = 1;
        jsn['width'] = 145;
        var tf = parseInt($('#' + textareas[i].id).attr('fuente'));

        //              var tf=parseInt(parseInt($('#'+textareas[i].id).attr('fuente')).toFixed(0));
        jsn['tamanioFuente'] = tf == null ? 20 : tf;



        var cent = obtenerCentrado(etik);
        jsn['centrado'] = cent.toString() === "null" ? "false" : cent.toString();
        var text = obtenTexto(textareas[i].attributes.value.value);
        jsn['texto'] = text === null ? "" : text;
        var body = instance.getBody();
        msg.push(jsn);
    }
    jsong['textosPintar'] = msg;
    $('#jsons').text(JSON.stringify(jsong));
    $('#jsonEsc').val(JSON.stringify(jsong));

    //console.log(JSON.stringify(jsong));
    //$("[id*='form17:jsonEsc']").val(JSON.stringify(jsong));
    return msg;
}



function obtenerCentrado(etik) {
    var valor = etik || null
    var resp = false;
    if (valor.length > 0) {
        for (var i = valor.length - 1; i >= 0; i--) {
            if (valor[i] === 'center') {
                resp = true;
                break;
            }
        }
    } else {
        valor = null;
    }
    return resp;

}


function obtenFuenteetk(val) {
    var valor = val || null
    var resp = null;
    if (valor.length > 0) {
        for (var i = valor.length - 1; i >= 0; i--) {
            if (valor[i].split('=')[0] === 'font') {
                resp = valor[i].split('=')[1];
                break;
            }
        }
    } else {
        valor = null;
    }
    return resp;
}


function hexToRgb(hex) {
    var hex = hex || null

    if (hex !== null) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    } else { return null }

}



function obtenColoretk(val) {
    var valor = val || null
    var resp = null;
    if (valor.length > 0) {
        for (var i = valor.length - 1; i >= 0; i--) {
            if (valor[i].split('=')[0] === 'color') {
                resp = valor[i].split('=')[1];
                break;
            }
        }
    } else {
        valor = null;
    }
    return resp;
}




function getNombreArch(val) {
    var valor = val || null
    if (valor !== null) {
        var valores = valor.split('\\');
        var i = valores.length
        valor = valores[i - 1];

    }

    return valor;
}


function seteadraggable(element) {
    $('#' + element).draggable({
        start: function () {
            coordinates('#' + element);
        },
        stop: function () {
            coordinates('#' + element);
        }
    });
}

function seteaTextArea(element) {
    var textarea = document.getElementById(element + "canvasTextarea");

    sceditor.create(textarea, {
        plugins: 'undo',
        format: 'bbcode',
        //toolbar: 'font|color|center|justify',
        toolbar: 'font|color',
        locale: 'no-NB',
        //    resizeEnabled:false,
        resizeWidth: true,
        resizeMaxHeight: 100,
        resizeMinHeight: 100,
        resizeMaxWidth: 900,
        resizeMinWidth: 300
    });

    sceditor.instance(textarea).selectionChanged(function (e) {
        getJsonsTextarea();

    });
}





function encuentraEtiquetas(val) {
    var valores = val || null

    if (valores !== null) {
        var arrvalores = [];
        arrvalores = valores.split(/(^[^\[])*(\[[^\]]*])/g);
        valores = [];
        valores = arrvalores.filter(function (el) {
            if (el !== undefined && (el.match(/\[(.*\=.*)\]/g))) {
                return true;
            } else {
                if (el !== undefined && el.match(/\[(.*)\]/g) && !el.match(/\//g)) {
                    return true;
                } else {
                    return false;
                }
            }
        });

        if (valores.length > 0) {
            $.each(valores, function (i, l) {
                valores[i] = l.replace(/(\]|\[)/g, '');
            });
        }
    }
    return valores
}


function obtenTexto(val) {
    var valores = val || null
    if (valores !== null) {
        if (valores.length > 0) {
            valores = valores.replace(/(\]|\[)/g, '');
        } else {
            valores = null;
        }
    }
    return valores
}


function quitaImgEditar() {
    var img = $("[id*='form17:editImagePreview']");
    if (img !== null && img !== undefined) {
        //			$("[id*='form17:editImagePreview']").attr('style','display:none');
        $("[id*='form17:editImagePreview']").remove();
    }
}

function seteaLoopBotones(el) {
    var timeout, clicker = $('#' + el + ' > div.elim > div.fontChange');
    var timeout2, clicker2 = $('#' + el + ' > div.elim > div.fontChange2');

    clicker.mousedown(function () {
        timeout = setInterval(function () {
            subefont($('#' + el));
        }, 50);
        return false;
    });


    clicker2.mousedown(function () {
        timeout2 = setInterval(function () {
            bajafont($('#' + el));
        }, 50);
        return false;
    });


    $(document).mouseup(function () {
        clearInterval(timeout);
        clearInterval(timeout2);
        return false;
    });
}


function repitaCajas() {
    //var str = $('textarea[id*="jsonEsc"]').val();
    var str = $('#jsonEsc').val();
    var val = str || null

    if (val !== null && val !== undefined && val.length > 0) {
        var json = JSON.parse(val);
        if (json.textosPintar !== null && json.textosPintar !== undefined) {
            $.each(Object.keys(json.textosPintar), function (index, value) {
                //					console.log(json.textosPintar[value]);
                var v = json.textosPintar[value];

                creardraggableAnterior(v.texto.replace(/\.|\#/g, ''), v.texto, v.coordX - 12, v.coordY - 65, v.tamanioFuente);

            });
        }
    }
}



function creardraggableAnterior(element, val, posX, posY, tamFuente) {
    var element = 'box' + element;
    if (document.getElementById(element)) {
        var c = parseInt($('#' + element).length);
        c++;
        element = element + '' + c;
        creardraggableAnterior(element, val, posX, posY, tamFuente);
        /*si el textarea ya esiste, create unos con id diferente*/
    } else {
        $('.imagePreview').append('<div fuente="20" class="cajaConfig" value="' + val + '" id="' + element + '">'
            + '<div class="elim"><a class="eliminad" onclick="eliminadraggable(\'' + element.replace(/\s/g, '') + '\')">'
            + '<h4>X</h4></a>'
            + '<div class="fontChange">'
            + '<h4>A &uarr;</h4></div>'
            + '<div class="fontChange2">'
            + '<h4>a &darr;</h4></div>'

            + '<div id="tamFuente" class="fontChange3">20</div>'
            + '</div>'

            + '<textarea class="canvasTextarea" id="' + element + 'canvasTextarea"> ' + element + '</textarea></div>');

        seteadraggable(element);
        seteaTextArea(element);
        seteaLoopBotones(element);


        $('#' + element).attr('style', 'left: ' + posX + 'px;top: ' + posY + 'px;');

        $('#' + element).attr('fuente', tamFuente.toString());
        $('#' + element + ' > div.elim > div#tamFuente').html(tamFuente.toString());

    }
}





function creardraggable(element, val) {


    //	var nomImg= $("input[type='file'][name='form17:archivoCC']").val();
    //	if(nomImg.length>0){

    var element = 'box' + element;
    if (document.getElementById(element)) {
        var c = parseInt($('#' + element).length);
        c++;
        element = element + '' + c;
        creardraggable(element, val);
        /*si el textarea ya esiste, create unos con id diferente*/
    } else {
        $('.imagePreview').append('<div fuente="20" class="cajaConfig" value="' + val + '" id="' + element + '">'
            + '<div class="elim"><a class="eliminad" onclick="eliminadraggable(\'' + element.replace(/\s/g, '') + '\')">'
            + '<h4>X</h4></a>'
            + '<div class="fontChange">'
            + '<h4>A &uarr;</h4></div>'
            + '<div class="fontChange2">'
            + '<h4>a &darr;</h4></div>'

            + '<div id="tamFuente" class="fontChange3">20</div>'
            + '</div>'

            + '<textarea class="canvasTextarea" id="' + element + 'canvasTextarea"> ' + element + '</textarea></div>');

        seteadraggable(element);
        seteaTextArea(element);
        seteaLoopBotones(element)
    }
    //	}else{
    //		alert('no hay ninguna imagen');	
    //	}


}

function subefont(element) {
    var act = parseInt($('#' + element[0].id).attr('fuente'));
    act += 1;
    $('#' + element[0].id).attr('fuente', act);
    $('#' + element[0].id + ' > div.elim > div#tamFuente').html(act);

    //             $('#'+element[0].id+' > div.elim > div#tamFuente > div > iframe > html > body > div').attr("font-size",""+act+"px");
    //             $('#'+textareas[i].id+' > div.elim > div#tamFuente').val(tf);
    //             $('#'+element[0].id).attr('fuente',act);


    getJsonsTextarea();
}

function bajafont(element) {
    var act = parseInt($('#' + element[0].id).attr('fuente'));
    act = ((act - 1) < 0) ? 0 : (act - 1);
    $('#' + element[0].id).attr('fuente', act);
    $('#' + element[0].id + ' > div.elim > div#tamFuente').html(act);

    //            $('#'+element[0].id+' > div.elim > div#tamFuente > div > iframe > html > body > div').attr("font-size",""+act+"px");

    getJsonsTextarea();
}



function eliminadraggable(element) {
    $('#' + element).remove();
    var jsonsTextosPintar = getJsonsTextarea($('.cajaConfig'));
    jsong['textosPintar'] = jsonsTextosPintar;
    $('#jsons').text(JSON.stringify(jsong));
    //$("[id*='form17:jsonEsc']").val(JSON.stringify(jsong));
    $('#jsonEsc').text(JSON.stringify(jsong));
}





function mapDOM(element, json) {
    var treeObject = {};

    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
            parser = new DOMParser();
            docNode = parser.parseFromString(element, "text/xml");
        }
        else // Microsoft strikes again
        {
            docNode = new ActiveXObject("Microsoft.XMLDOM");
            docNode.async = false;
            docNode.loadXML(element);
        }
        element = docNode.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object["type"] = element.nodeName;
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object["content"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        object["content"].push(nodeList[i].nodeValue);
                    } else {
                        object["content"].push({});
                        treeHTML(nodeList[i], object["content"][object["content"].length - 1]);
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
    }
    treeHTML(element, treeObject);

    return (json) ? JSON.stringify(treeObject) : treeObject;
}