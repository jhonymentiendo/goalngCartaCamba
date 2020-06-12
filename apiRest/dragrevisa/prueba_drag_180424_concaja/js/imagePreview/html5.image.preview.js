/*
 * Estructura HTML:
 *	<div>
 *		<input type="file" name="imagefile" onchange="previewImage(this,{256,128,64},5)">
 *		<div class="imagePreview"></div>
 *	</div>
 *
 */

function previewImage(el,limit){
	var files = el.files;
	//var wrap = el.parentNode;
	//var output = wrap.getElementsByClassName('imagePreview')[0];
	var output = document.getElementsByClassName('imagePreview')[0];
	var allowedTypes = ['JPG','JPEG','GIF','PNG','SVG','WEBP'];
	output.innerHTML='Loading...';
	var file = files[0];
	var imageType = /image.*/;
	// detect device
	var device = detectDevice();
	if (!device.android){ // Since android doesn't handle file types right, do not do this check for phones
		if (!file.type.match(imageType)) {
			var description = document.createElement('p');
			output.innerHTML='';
			description.innerHTML='This is not valid Image file';
			output.appendChild(description);
			return false;
		}
	}
	var img='';
	var reader = new FileReader();
	reader.onload = (function(aImg) {
		return function(e) {
			output.innerHTML='';
			var format = e.target.result.split(';');
			format = format[0].split('/');
    		format = format[1].split('+');
			format = format[0].toUpperCase();
			// We will change this for an android
			if (device.android){
				format = file.name.split('.');
        		format = format[format.length-1].split('+');
				format = format[0].toUpperCase();
			}
			
			var description = document.createElement('p');
			description.innerHTML = '<br />This is a <b>'+format+'</b> image, size of <b>'+(e.total/1024).toFixed(2)+'</b> KB.';
			if (allowedTypes.indexOf(format)>=0 && e.total<(limit*1024*1024)){
				var image = document.createElement('img');
					var src = e.target.result;
					image.src = src;
					image.title = 'Image preview '+image.width+'px X '+image.height+'px';
					output.appendChild(image);

				description.innerHTML += '<br /><span style="color:green;">Picture seems to be fine for upload.</span>';
			} else {
			    description.innerHTML += '<br /><span style="color:red;">Which is wrong format / size! Accepted formats: '+allowedTypes.join(', ')+'. Size limit is: '+limit+'MB</span>';
			}						
			output.appendChild(description);
		};
	})(img);
	reader.readAsDataURL(file);
}

// Detect client's device
function detectDevice(){
	var ua = navigator.userAgent;
	var brand = {
		apple: ua.match(/(iPhone|iPod|iPad)/),
		blackberry: ua.match(/BlackBerry/),
		android: ua.match(/Android/),
		microsoft: ua.match(/Windows Phone/),
		zune: ua.match(/ZuneWP7/)
	}

	return brand;
}
