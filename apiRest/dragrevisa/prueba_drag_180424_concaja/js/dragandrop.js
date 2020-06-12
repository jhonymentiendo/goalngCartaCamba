
//var JsonG= {"datosImagen":{"nombreImagen":null,"idPais":null},"textosPintar":[{"colorR":"0","colorG":"0","colorB":"0","tipoFuente":"Verdana","estiloFuente":"1","tamanioFuente":"20","texto":"tcUsuario.nombreCompleto","coordX":"380","coordY":"850","centrado":"true","width":"146"},]}
var jsong= {"datosImagen":{"nombreImagen":null,"idPais":null},"textosPintar":[]}

$(document).ready(function(){
});


var coordinates = function(element) {
    getJsonsTextarea();


    //var jsonsTextosPintar = getJsonsTextarea();
    //jsong['textosPintar']= jsonsTextosPintar;
    
     
}


function getJsonsTextarea(){
    var textareas= ($('.caja')[0]===undefined? []: $('.caja'));
    var msg=[];

    var nombreArch= getNombreArch($("input[type='file'][name='imagefile']").val());
    jsong['datosImagen']['nombreImagen']= nombreArch;


        for (var i = textareas.length - 1; i >= 0; i--) {

            var element= $('#'+textareas[i].id);

            var jsn={
                colorR:null, //YA
                colorG:null, //YA
                colorB:null, //YA
                tipoFuente:null, //YA
                estiloFuente:null, //ya lo obtengo aun no lo seteo
                tamanioFuente:null, //ya lo obtengo aun no lo seteo
                texto:null, //debo distinguir si son fijos o es el libre
                coordX:null, //YA
                coordY:null, //YA
                centrado:null, //ya lo obtengo aun no lo seteo
                width:null //no se de donde lo calculan
            }

            /*posiciones lo obtengo de .caja*/
            jsn['coordX']= element.position()==undefined?0:(element.position().top);
            jsn['coordY']= element.position()==undefined?0:(element.position().left);



            /*color,fuente,estilo,tamanio,texto...centrado y width(no los tengo,será duro) 
             lo obtengo de .texarea dentro de .caja*/
              var textarea = document.getElementById(textareas[i].id+'canvasTextarea');
              var instance = sceditor.instance(textarea);
              
              var val = instance.val();/*de aqui puedo sacar color,texto,alineación*/
              /*se puede modificar el valor de una caja de esta forma*/
              //var val = instance.val("[center]boxt[color=#4cea5e]cC[/color]liente[/center]");
              var css = instance.css();

              var etik=encuentraEtiquetas(val);

              var colorHex= obtenColoretk(etik)
              var rgb= hexToRgb(colorHex);
              jsn['colorR']= rgb===null?0:rgb.r;
              jsn['colorG']= rgb===null?0:rgb.g;
              jsn['colorB']= rgb===null?0:rgb.b;
              
              var tpf= obtenFuenteetk(etik)

              jsn['tipoFuente']= tpf===null?'Verdana':tpf;
              jsn['estiloFuente']= 1;
              jsn['width']= 146;
              jsn['tamanioFuente']= 20;
              var cent = obtenerCentrado(etik);
              jsn['centrado']= cent;


              var body = instance.getBody();

              console.log(body);


             msg.push(jsn);

        }
    jsong['textosPintar']= msg;
    $('#jsons').text(JSON.stringify(jsong));        
    return msg;
}


function obtenerCentrado(etik){
var valor= etik || null
    var resp=false;
        if (valor.length>0) {
            for (var i = valor.length - 1; i >= 0; i--) {
                if(valor[i]==='center'){
                    resp=true;
                    break;
                }
            }
        }else{
            valor=null;
        }
    return resp;

}

function obtenFuenteetk(val){
    var valor= val || null
    var resp=null;
        if (valor.length>0) {
            for (var i = valor.length - 1; i >= 0; i--) {
                if(valor[i].split('=')[0]==='font'){
                    resp=valor[i].split('=')[1];
                    break;
                }
            }
        }else{
            valor=null;
        }
    return resp;
}


function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var hex = hex || null

    if(hex!==null){
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}else{return null}

}



function obtenColoretk(val){
     var valor = val || null
     var resp=null;
        if (valor.length>0) {
            for (var i = valor.length - 1; i >= 0; i--) {
                if(valor[i].split('=')[0]==='color'){
                    resp=valor[i].split('=')[1];
                    break;
                }
            }
        }else{
            valor=null;
        }





     return resp;
}




function getNombreArch(val){
    var valor = val || null
        if(valor!==null){
            var valores=valor.split('\\');
            var i= valores.length
            valor=valores[i-1];

        }

    return valor;
}


function seteadraggable(element){
    $('#'+element).draggable({
                    start: function() {
                        coordinates('#'+element);
                    },
                    stop: function() {
                        coordinates('#'+element);
                    }
                });

    //console.log($('#'+element));
}

function seteaTextArea(element){
//var textarea = $('#'+element+"canvasTextarea");//document.getElementById(element+"canvasTextarea");
var textarea = document.getElementById(element+"canvasTextarea");

    sceditor.create(textarea, {
    plugins: 'undo',
    format: 'bbcode',
    toolbar: 'size|font|color|center|justify',
    locale: 'no-NB'
    });

    //sceditor.instance(textarea).nodeChanged(function(e) {
    //alert('Current node has changed');
    //()});

    sceditor.instance(textarea).selectionChanged(function(e) {
    //console.log('al momento de cambiar ');
    /*busca las etiquetas*/
    //var etik=encuentraEtiquetas(this.val());
    getJsonsTextarea();




    });



console.log($('#'+element+"canvasTextarea"));

}





function encuentraEtiquetas(val){
    var valores = val || null

    if(valores !== null ){
        var arrvalores=[];
        arrvalores=valores.split(/(^[^\[])*(\[[^\]]*])/g);
        

        valores=[];
        valores =arrvalores.filter(function(el){
            console.log(el);
            if(el!==undefined && (el.match(/\[(.*\=.*)\]/g))){
                return true;
            }else{
                if(el!==undefined && el.match(/\[(.*)\]/g) && !el.match(/\//g)){
                    return true;
                }else{
                 return false; 
                }
                
            }
        });

        if(valores.length>0){
            $.each(valores, function( i, l ){
                console.log( "Index #" + i + ": " + l.replace(/(\]|\[)/g,'') );
                valores[i]=l.replace(/(\]|\[)/g,'');
            });

        }




    }




    return valores
}






function creardraggable(element){
     var element='box'+element;
        if(document.getElementById(element)){
            console.log('textarea ya existe');
        }else{
            $('.imagePreview').append('<div class="caja" id="'+element+'"><div class="elim" ><a class="eliminad" onclick="eliminadraggable("'+element.trim()+'")"><h4>X</h4></a> </div> <textarea class="canvasTextarea" id="'+element+'canvasTextarea"> '+element+'</textarea></div>');
            $('#coords').append('<div id="'+element+'results"></div>');
                seteadraggable(element);
                seteaTextArea(element);
        }
}


function eliminadraggable(element){
    $('#'+element).remove();
    $('#'+element+'results').remove();

    var jsonsTextosPintar = getJsonsTextarea($('.caja'));
    jsong['textosPintar']= jsonsTextosPintar;
    $('#jsons').text(JSON.stringify(jsong));
}





/*
var initElement = document.getElementsByTagName("html")[0];
var json = mapDOM(initElement, true);
console.log(json);

initElement = "<div><span>text</span>Text2</div>";
json = mapDOM(initElement, true);
console.log(json);*/

function mapDOM(element, json) {
    var treeObject = {};
    
    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser)
        {
              parser = new DOMParser();
              docNode = parser.parseFromString(element,"text/xml");
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
                        treeHTML(nodeList[i], object["content"][object["content"].length -1]);
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