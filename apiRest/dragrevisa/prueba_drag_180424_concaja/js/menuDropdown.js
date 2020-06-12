
function muestraDrop(valbtn) {
    document.getElementById("myDropdown"+valbtn).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropdownContent') & !e.target.matches('.dropbtn') & !e.target.matches('.myInput') & !e.target.matches('.page')) {
    var myDropdowns = $('.dropdownContent');//document.getElementsByClassName("dropbtn");
    
    
    $.each(myDropdowns, function( i, l ){
    	
    	if (l.classList.contains('show')) {
            l.classList.remove('show');
          }	
    });
    
  }
}


function filterFunction(el) {
    //var input, filter, ul, li, a, i;
    
    console.log(el);
    console.log($('#'+el.id).parent());
    
    var input = el;//document.getElementById("myInput");
    var out= $('#'+el.id).parent()
    console.log(out);
    var filter = input.value.toUpperCase();
//    div = document.getElementById("myDropdown");
    var a = $('#'+out[0].id+' > .tablinks')//div.getElementsByTagName("div");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}



//function escondeDrop(valbtn) {
//	var myDropdown=document.getElementById("myDropdown"+valbtn).classList.toggle("show");
//    
//    if (myDropdown.classList.contains('show')) {
//        myDropdown.classList.remove('show');
//      }
//    
//}
