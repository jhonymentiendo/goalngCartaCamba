//Pagination
function pagina(el){
	pageSize = 20;
	
	
	
	
	/*agregarle el el*/
	var pageCount =  $("#myDropdown"+el+" > .line-content."+el).length / pageSize;
     for(var i=0 ; i<pageCount;i++){
    	 $("#pagin"+el).append('<div val="'+el+'" class="page">'+(i+1)+'</div> ');
     }
    
     
     /*esta funciÃ³n no esta jalando como se debe   cambiar por $("#pagin"+el+" div")[0]*/
     
     	
     
//        $("#pagin"+el).first().find("div").addClass("current");
//     	  $("#pagin"+el+" > div")[0].addClass("current");
     	  $("#pagin"+el+" > div").first().addClass("current");
     	  
        
        
        
    showPage = function(page,val) {
    	
    	/*agregarle el el*/
    	
    	if(val==null){
    	
    		$(".line-content."+el).hide();
    	    $(".line-content."+el).each(function(n,l) {
    	        if (n >= pageSize * (page - 1) && n < pageSize * page ){
    	        	$(this).show();
    	        }
    	    });
    		
    		
    	}else{
    		
    		
    		$(".line-content."+val).hide();
    	    $(".line-content."+val).each(function(n,l) {
    	        if (n >= pageSize * (page - 1) && n < pageSize * page ){
    	        	$(this).show();
    	        }
    	    });
    		
    	    
    	}
    	    
	}
    
    
    
	showPage(1,null);
	
	
	
	$("#pagin"+el+" div").click(function() {
	    $("#pagin"+el+" div").removeClass("current");
	    $(this).addClass("current");
	    showPage(parseInt($(this).text()),$(this).attr('val')) 
	});
}



