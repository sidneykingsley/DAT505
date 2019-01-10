var camera, camera2, astri, stars, scene, renderer, geometry, material, mesh;
var sphere = [];
var controls;
var perc = window.innerHeight*0.01;
var w = window.innerWidth;
var h = window.innerHeight;
var lockedSwitch = true;
var planetCount;
var spherePosCount = 0;
var randomSpinDir = [];
var clickCount = 0;
var helpCount = 0;
var footerWidth;

window.onload = function() {                                                    //this calls the functions below when the page is loaded
  smoothLoader();
  styler()
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });         //applies WebGL
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);  //sets thte pixel ratio appropiate for the device
	renderer.setSize(w, h-perc);                                                  //makes the renderer canvas the size of the screen minus an overlap of height (perc)
  renderer.autoClear = true;                                                    //clears the background of the renderer canvas so you can see the css
  renderer.setClearColor(0x000000, 0.0);                                        //sets the background to an opacity of 0
  document.getElementById('canvas').appendChild(renderer.domElement);           //makes the renderer canvas a child of the HTML element id as "canvas"

	scene = new THREE.Scene();                                                    //creates a THREE scene

	var radius  = 0.6, segments	= 32, rotation	= 6;                              //sets attributes for the sphere
  for (var i=0;i<=2;i++) {                                                      //for loop which will repeat 3 times
    sphere[i] = createSphere(radius, segments, i);                              //creates a sphere using the createSphere function with the pre-set attributes as part of an array
  	sphere[i].rotation.y = rotation;                                            //sets the rotation of the sphere
    sphere[i].position.x = spherePosCount;                                      //sets the postion of each sphere differently
    spherePosCount = spherePosCount + 2;                                        //a counter that means that each sphere will be 2 points to the left
  	scene.add(sphere[i])                                                        //adds each sphere to the scene
  }

  for (var i=0;i<sphere.length;i++) {                                           //another for loop which runs for as long as the sphere array is
    randomSpinDir[i] = Math.floor(Math.random() * 3) + 0 ;                      //randomly generates a spin direction for the spheres
  }

  var sGeo = new THREE.IcosahedronGeometry(1, 0);                               //sets the geometry for the icosahedron stars
  var sMat = new THREE.MeshPhongMaterial({                                      //sets the material to phong
    color: 0xffffff,                                                            //sets the colour to white
    flatShading: THREE.FlatShading                                              //flat shading
  });
  for (var i = 0; i < 1000; i++) {                                              //for a thousand iterations
    stars = new THREE.Mesh(sGeo, sMat);                                         //creates a mesh with the pre-set geometry and material
    stars.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();  //randomises the position
    stars.position.multiplyScalar(90 + (Math.random() * 700));                  //randomises the position
    stars.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);  //randomises the rotation
    stars.scale.x = stars.scale.y = stars.scale.z = 0.5;                        //sets the scale to half the size
    scene.add(stars);                                                           //adds the mesh to the scene
  }

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); //adds a camera
	camera.position.z = 3;                                                        //sets the camera postion
  controls = new THREE.OrbitControls(camera);                                   //uses OrbitControls.js to make the camera orbit and zoom from the center of the canvas by dragging and scrolling
  controls.minDistance = 0.7;                                                   //sets the minimum zoom distance
  controls.maxDistance = 500;                                                   //sets the maximum zoom distance

	var light = new THREE.DirectionalLight(0xffffff, 1);                          //defines a new white directional light
	light.position.set(5,3,5);                                                    //sets the position
	scene.add(light);                                                             //adds the light to the scene

  var ambientLight = new THREE.AmbientLight(0x999999, 0.5);                     //defines a new light grey ambient light
  scene.add(ambientLight);                                                      //adds the light to the scene

  window.addEventListener('resize', onWindowResize, false);                     //calls a function when the window is resized
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;                       //changes the camera aspect so the content is still sized and centered
  camera.updateProjectionMatrix();                                              //updates the project matrix
  renderer.setSize(window.innerWidth, window.innerHeight);                      //resizes the canvas
}

function animate() {                                                            //this is the animation function which is called at a constant frame rate
	requestAnimationFrame(animate);                                               //this line causes the function to be re-called
  for (var i=0;i<sphere.length;i++) {                                           //another for loop which runs for as long as the sphere array is
    switch (randomSpinDir[i]) {                                                 //case function on the array randomSpinDir
      case 0:                                                                   //if the value is 0
        sphere[i].rotation.y += randomSpin(0.001,0.006);                        //then spin on the x axis by a random postitive increment between the parameters, sends these parameters to a randomise function to generate a value
      break;                                                                    //then break the case function
      case 1:                                                                   //if the value is 1
        sphere[i].rotation.y -= randomSpin(0.001,0.006);                        //then spin on the y axis by a random negative increment between the parameters, sends these parameters to a randomise function to generate a value
      break;                                                                    //then break the case function
      case 2:                                                                   //if the value is 2
        sphere[i].rotation.x += randomSpin(0.001,0.006);                        //then spin on the x axis by a random postitive increment between the parameters, sends these parameters to a randomise function to generate a value
      break;                                                                    //then break the case function
      case 3:                                                                   //if the value is 3
        sphere[i].rotation.x -= randomSpin(0.001,0.006);                        //then spin on the y axis by a random negative increment between the parameters, sends these parameters to a randomise function to generate a value
      break;                                                                    //then break the case function
      default:                                                                  //this is the default if the value is none of the above
    	sphere[i].rotation.y += 0.002;                                            //spins on the y axis by a postive increment of 0.002
    }
  }
  controls.update();                                                            //udates the controls each frame
  renderer.clear();                                                             //clears the canvas each frame
	renderer.render(scene, camera);                                               //renders the new frame
}

function createSphere(radius, segments, planetCount) {                          //the function which creates the spheres (or planets) and inputs the given values
	return new THREE.Mesh(                                                        //defines what the function will return and renders it as a mesh
		new THREE.SphereGeometry(radius, segments, segments),                       //creates the sphere with the pre-set values
		new THREE.MeshPhongMaterial({                                               //sets the material for the object
			map: THREE.ImageUtils.loadTexture(`assets/textures/albedo${planetCount}.jpg`), //sets the texture of the sphere to a JPG image depending on which iteration of the for loop is being called
		  specularMap: THREE.ImageUtils.loadTexture(`assets/textures/specular${planetCount}.jpg`),  //does the same for the specular map (makes the light only shine off certain parts of the texture)
			specular: new THREE.Color('grey')                                         //sets the colour of the specular
		})
	);
}

function randomSpin(min,max){                                                   //the randomising function, inports parameters
  return Math.random() * (max-min) + min ;                                      //uses math.random and the preset parameters to create a random value and returns it
}

function smoothLoader() {                                                       //this function is called on page load, it is a loading page
  var dots = window.setInterval( function() {                                   //creats a 0.5s interval and gives it a varible so it can be broken
      var wait = document.getElementById("earlyText");                          //gets the text value of the HTML element
      if ( wait.innerHTML.length > 2 ) wait.innerHTML = ".";                    //if the text continues more than three characters (bc numbers start at 0) then set text to "."
      else wait.innerHTML += ".";                                               //if it has less than two characters then add a "." to the end
  }, 500);                                                                      //sets the interval
  setTimeout(function () {                                                      //creates a timeout function of 3s
    document.getElementById("earlyText").style.opacity = "0";                   //makes the html element disappear
  }, 3000);                                                                     //sets the timout length
  setTimeout(function () {                                                      //creates a timeout function of 4s
    document.getElementById("early").style.opacity = "0";                       //makes the html element disappear
        clearInterval(dots);                                                    //clears the earlier interval (dots) so it doesn't run anymore
  }, 4000);                                                                     //sets the timout length
  setTimeout(function () {                                                      //creates a timeout function of 7s
    document.getElementById("early").style.zIndex = "0";                        //makes the html element go to the back of the scene so it doesn't interfere
  }, 7000);                                                                     //sets the timout length
  setTimeout(function () {                                                      //creates a timeout function of 3s
    init();                                                                     //calls the init function
    animate();                                                                  //calls the animate function
    styler();                                                                   //calls the styler function
  }, 3000);                                                                     //sets the timout length
}

function rightClick() {                                                         //function which is called when the HTML button is clicked
  clickCount = clickCount + 1;                                                  //count varible which increments on every click
  if (clickCount < sphere.length) {                                             //runs if the button has been clicked less than the amount of planets (so it doesn't go off the screen)
    for (var i=0;i<sphere.length;i++) {                                         //for loop, runs as many times as there are planets in the array
      sphere[i].position.x = sphere[i].position.x-2;                            //changes the position of all the planets (so the page appears to move to the next planet)
    }
  }
  if (clickCount > 0) document.getElementById("leftButton").style.display = "flex"; //if clicked off the first planet then displays the left HTML button
  else document.getElementById("leftButton").style.display = "none";            //if on the first planet then hide the left HTML button
  if (clickCount < sphere.length-1) document.getElementById("rightButton").style.display = "flex"; //displays the right HTML button if you haven't clicked to the end of the array
  else document.getElementById("rightButton").style.display = "none";           //hides the right HTML button when you've clicked to the end
  switch (clickCount) {                                                         //case conditional function on the clickCount varible
    case 0:                                                                     //if the value is 0
      document.getElementById("planetTitle").innerHTML = "EARTH";               //change the text value of the HTML element
      break;                                                                    //then break the case function
    case 1:                                                                     //if the value is 1
      document.getElementById("planetTitle").innerHTML = "ALIEN PLANET";        //change the text value of the HTML element
      break;                                                                    //then break the case function
    case 2:                                                                     //if the value is 2
      document.getElementById("planetTitle").innerHTML = "BLUE JUPITER";        //change the text value of the HTML element
      break;                                                                    //then break the case function
    default:                                                                    //if the value is none of the above
    document.getElementById("planetTitle").innerHTML = "NONE";                 //change the text value of the HTML element
  }
}

function leftClick() {                                                          //this function is called when the left HTML button is called
  clickCount = clickCount - 1;                                                  //decrements the count value on every click
  if (clickCount < sphere.length) {                                             //if the count is less than the array
    for (var i=0;i<sphere.length;i++) {                                         //for loop, runs as many times as there are planets in the array
      sphere[i].position.x = sphere[i].position.x+2;                            //changes the position of all the planets (so the page appears to move to the next planet)
    }
  }
  if (clickCount > 0) document.getElementById("leftButton").style.display = "flex"; //if clicked off the first planet then displays the left HTML button
  else document.getElementById("leftButton").style.display = "none";            //if on the first planet then hide the left HTML button
  if (clickCount < sphere.length-1) document.getElementById("rightButton").style.display = "flex"; //displays the right HTML button if you haven't clicked to the end of the array
  else document.getElementById("rightButton").style.display = "none";           //hides the right HTML button when you've clicked to the end
  switch (clickCount) {                                                         //case conditional function on the clickCount varible
    case 0:                                                                     //if the value is 0
      document.getElementById("planetTitle").innerHTML = "EARTH";               //change the text value of the HTML element
      break;                                                                    //then break the case function
    case 1:                                                                     //if the value is 1
      document.getElementById("planetTitle").innerHTML = "ALIEN PLANET";        //change the text value of the HTML element
      break;                                                                    //then break the case function
    case 2:                                                                     //if the value is 2
      document.getElementById("planetTitle").innerHTML = "BLUE JUPITER";        //change the text value of the HTML element
      break;                                                                    //then break the case function
    default:                                                                    //if the value is none of the above
    document.getElementById("planetTitle").innerHTML = "NONE";                  //change the text value of the HTML element
  }
}

function planetRedirect() {                                                     //function called when the planet name HTML button is clicked
  switch (clickCount) {                                                         //case conditional function on the clickCount varible
    case 0:                                                                     //if the value is 0
      window.location.replace("earth.html");                                    //change the url to the chose planet's page
      break;                                                                    //then break the case function
    case 1:                                                                     //if the value is 1
      window.location.replace("alien.html");                                    //change the url to the chose planet's page
      break;                                                                    //then break the case function
    case 2:                                                                     //if the value is 2
      window.location.replace("blue.html");                                     //change the url to the chose planet's page
      break;                                                                    //then break the case function
    default:                                                                    //if the value is none of the above
      window.location.replace("earth.html");                                    //change the url to the chose planet's page
  }
}

function styler() {                                                             //this is a function which was called all the page load
  footerWidth = document.getElementById("footerTag").offsetWidth;               //this returns the width of the HTML element with the id of "footerTag" and assigns it to the varible
  document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;    //this moves the element to off the page to the right by its width minus 15px
}

function helpClick() {                                                          //this function is called when the help button is clicked
  var checker = oddEvenCheck(helpCount);                                        //checks whether the user wants to open or close the help section by counting each click and checking if it's odd or even
  if (checker === true) {                                                       //if it's closed it
    document.getElementById("helpLink").src = "assets/icons/help2.png"          //changes the button to a close symbol
    document.getElementById("footerTag").style.right = `10px`;                  //moves it back onto the screen
  }
  else {                                                                        //if it's open
    document.getElementById("helpLink").src = "assets/icons/help.png"           //changes the button back to saying "help"
    document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;  //moves the element back off the page
  }
  helpCount = helpCount + 1;                                                    //this increments the counter every time the button is clicked
}

function oddEvenCheck(x) {                                                      //this function recieves interegers and checks if they are odd or even
  if (x % 2 == 0) {                                                             //if the integer mod 2 equals 0 then it's even
    return true;                                                                //so return the boolean value of "true"
  }
  else {                                                                        //if not
    return false;                                                               //return "false"
  }
}
