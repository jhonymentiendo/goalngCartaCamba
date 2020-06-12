(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);

// test basic functionality
docReady(function() {
    /*document.body.appendChild(document.createTextNode("Hello Text 1"));
    // test adding new docReady handler from a docReady callback
    docReady(function() {
        document.body.appendChild(document.createTextNode(", Hello Text 2"));
    });*/
    
    pidecampanas();
    
    //for(var i=1;i<5;i++){
//
    //  //creaTextDraggable(''+i);
    //    console.log('prueba '+i);
    //}
    /*var html = '<div id="box"></div>';
    appendHtml(document.getElementById('cont'), html);
    document.getElementById('cont');

    draggable(document.getElementById('box'));
*/
});


function pidecampanas(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("http://localhost:8080/traelistacampanas", requestOptions)
        //.then(response => response.text())
        //.then(result => console.log(result))
        .then(function(resp){
            return resp.json();
        })
        .then(function(jsonresp){
            console.log(jsonresp);

            for (var i = 0; i < jsonresp.Lcampa.length ; i++){
                var element = document.querySelector("#ligasCampanas");
                var html = '<a onclick="pidepdf('+jsonresp.Lcampa[i]+')">pide pdf campa '+jsonresp.Lcampa[i]+'</a><br>';
                element.insertAdjacentHTML('beforeend', html);
            }

        })
        .catch(error => console.log('error', error));


        /*
        .then(function (resp) {
                    return resp.blob();
                })
                .then(function (blob) {
                    download(blob);
                })
                .catch(error => console.log('error', error));
        
        */
}