var img=null;

function buttonController(evt) {
			// console.log ("Touched button-  "+evt.target.id);
			switch(evt.target.id){
				/////////////////////////
				//
				// Pick Button Handler
				// Picks an image
				//
				////////////////////////
				case 'pick':
				console.log("pick");
				var pick = new MozActivity({
					name: "pick",
					data: {
						type: ["image/png", "image/jpg", "image/jpeg"]
					}
				});
				pick.onsuccess = function () {
					    // Create image and set the returned blob as the src
					    img = document.createElement("img");
					    img.src = window.URL.createObjectURL(this.result.blob);

						/*
						Deal with the canvas
						*/
						var canvas=document.getElementById("myCanvas");
						
						// Get context
						var context = canvas.getContext('2d');
						var width = parseFloat(window.getComputedStyle(canvas).width);
						var height = parseFloat(window.getComputedStyle(canvas).height);
						// Lo flipo: es un error al calcular las dimensiones. Hay que meterlas a capón.
						canvas.width=width;
						canvas.height=height;
						

						img.onload = function() {								
							context.drawImage(img, 0, 0, canvas.width, img.height * (canvas.width/img.width));

							console.log(canvas.height/img.height);
						};
						document.getElementById("share").classList.remove("unclicked");
						document.getElementById("share").disabled = false; 
						document.getElementById("poster").classList.remove("unclicked");
						document.getElementById("poster").disabled = false;
					};

					pick.onerror = function () {
					    // alert("Can't view the image!");
					};
					break;
				/////////////////////////
				//
				// Poster Button Handler
				// Posterizes an image
				//
				////////////////////////
				case 'poster':				  				
				var opts = {
						  lines: 13, // The number of lines to draw
						  length: 20, // The length of each line
						  width: 10, // The line thickness
						  radius: 30, // The radius of the inner circle
						  corners: 1, // Corner roundness (0..1)
						  rotate: 0, // The rotation offset
						  direction: 1, // 1: clockwise, -1: counterclockwise
						  color: '#000', // #rgb or #rrggbb or array of colors
						  speed: 1, // Rounds per second
						  trail: 60, // Afterglow percentage
						  shadow: false, // Whether to render a shadow
						  hwaccel: false, // Whether to use hardware acceleration
						  className: 'spinner', // The CSS class to assign to the spinner
						  zIndex: 2e9, // The z-index (defaults to 2000000000)
						  top: 'auto', // Top position relative to parent in px
						  left: 'auto' // Left position relative to parent in px
						};
						var target = document.getElementById('main');
						var spinner = new Spinner(opts).spin(target);

						document.getElementById("myCanvas").style.opacity = 0.2;
						document.getElementById("poster").classList.add("unclicked");
						document.getElementById("poster").disabled = true;
						document.getElementById("help").style.opacity = 0.0;
						setTimeout(function(){
	 						if (img.complete) {	// make sure the image is fully loaded
	 							var canvas=document.getElementById("myCanvas");
								// Get context
								var context = canvas.getContext('2d');	

								img=Pixastic.process(img, "pointillize", {radius:5, density:1.5, noise:1.0, transparent:false});
								// context.drawImage(img, 0, 0, img.width, img.height,0,0, canvas.width, img.height * (canvas.width/img.width));
								context.drawImage(img, 0, 0, canvas.width, img.height * (canvas.width/img.width));
								spinner.stop();
								document.getElementById("myCanvas").style.opacity = 1.0;
							}	
						},500);

						break;			
				/////////////////////////
				//
				// Share Button Handler
				// Shares the image
				//
				////////////////////////
				case 'share':				  
				cv = document.getElementById("myCanvas");
				cv.toBlob(function(myBlob) {
					var blobs = [];
					blobs.push(myBlob);
					var share = new MozActivity({
						name:"share",
						data:{
							type: "image/*",
							number: 1,
							blobs: blobs,
							filenames: "image",
							fullpaths: "image"
						}
					});

					share.onerror = function(e) {
						console.error('share activity error:', share.error.name);};
					});				
				break;			
			}
		}

function init() {
	var buttons = document.getElementsByClassName("button");
	
	console.log(buttons);
	for (i=0;i<buttons.length;i++){				
		buttons[i].addEventListener("click", buttonController, false);
	}
}