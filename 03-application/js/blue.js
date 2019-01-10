var camera, scene, renderer, controls, object;
var w = window.innerWidth;
var h = window.innerHeight;
var footerWidth;
var i = 0;
var clickCount = 0;
var helpCount = 0;
var mouseX = 0;
var mouseY = 0;
var cloudCount = 0;
var cloudButton = false;
var cloudSwitch = false;
var clouds = new THREE.Object3D();

window.onload = function() {                                                    //this calls the functions below when the page is loaded
  smoothLoader();
  soundLoader();
}

function init() {                                                               //this calls the functions below when the page is loaded
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });         //applies WebGL
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);  //sets the pixel ratio appropiate for the device
	renderer.setSize(w, h);                                                       //makes the renderer canvas the size of the screen minus an overlap of height (perc)
  renderer.autoClear = true;                                                    //clears the background of the renderer canvas so you can see the css
  renderer.setClearColor(0xffffff, 0);                                          //sets the background to an opacity of 0
  document.getElementById('canvas').appendChild(renderer.domElement);           //makes the renderer canvas a child of the HTML element id as "canvas"
	scene = new THREE.Scene();                                                    //creates a THREE scene

  var mtlLoader = new THREE.MTLLoader();                                        //creates a THREE texture using the MTLLoader.js script
  mtlLoader.setPath( 'assets/models/environments/' );                           //sets the path for the texture
  var url = "blue.mtl";                                                        //assigns the material file to be loaded
  mtlLoader.load( url, function( materials ) {                                  //loads the texture using the preset values
    materials.preload();                                                        //sets the texture up for the objLoader
    var objLoader = new THREE.OBJLoader();                                      //creates a THREE object using the OBJLoader.js script
    objLoader.setMaterials( materials );                                        //applies the materials
    objLoader.setPath( 'assets/models/environments/' );                         //sets the path for the .obj file
    objLoader.load( 'blue.obj', function ( object ) {                          //loads the obj file
        object.rotation.x = 0.3;                                                //changes the rotation of the object on a y axis
        object.scale.x = object.scale.y = object.scale.z = 0.25;                //changes the rotation of the object on a y axis
        scene.add( object );                                                    //changes the scale of the object evenly
    });
  });

  var mtlLoader = new THREE.MTLLoader();                                        //adds the object to the scene
  mtlLoader.setPath( 'assets/models/movers/' );                                 //creates a THREE texture using the MTLLoader.js script
  var url = "clouds.mtl";                                                       //sets the path for the texture
  mtlLoader.load( url, function( materials ) {                                  //assigns the material file to be loaded
    materials.preload();                                                        //loads the texture using the preset values
    var objLoader = new THREE.OBJLoader();                                      //sets the texture up for the objLoader
    objLoader.setMaterials( materials );                                        //creates a THREE object using the OBJLoader.js script
    objLoader.setPath( 'assets/models/movers/' );                               //applies the materials
    objLoader.load( 'clouds.obj', function ( object ) {                         //sets the path for the .obj file
        object.rotation.x = 0.3;                                                //loads the obj file
        object.scale.x = object.scale.y = object.scale.z = 0.25;;                //changes the rotation of the object on a y axis
        clouds.add( object );                                                   //changes the scale of the object evenly
    });
  });

  scene.add(clouds);                                                            //adds the object to the clouds THREE object defined globaly

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 3;
  controls = new THREE.OrbitControls(camera);                                   //uses OrbitControls.js to make the camera orbit and zoom from the center of the canvas by dragging and scrolling
  controls.minDistance = 0.7;                                                   //sets the minimum zoom distance
  controls.maxDistance = 500;                                                   //sets the maximum zoom distance
  controls.enabled = false;                                                     //stops the controls from working but doesn't remove them incase you need them for development

  document.addEventListener("mousemove", onDocumentMouseMove, false);
  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 700;
    mouseY = (event.clientY - window.innerHeight / 2) / 10;
  }

  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( light );

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 30, 50, 50 );
  scene.add( light );

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 10, 10, 10 );
  scene.add( light );

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
  console.log(cloudCount);
  if (cloudCount > 14) cloudSwitch = true;
  else if (cloudCount < 0) cloudSwitch = false;
  if (cloudSwitch === true) cloudCount = cloudCount - 0.001;
  else if (cloudSwitch === false) cloudCount = cloudCount + 0.001;
  clouds.position.x = cloudCount;
  camera.position.x += (mouseX - camera.position.x) *0.02;
  controls.update();
  renderer.clear();
	renderer.render(scene, camera);
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

function movClick() {                                                           //function which is called upon "turn moving elements off/on" HTML button click
  if (cloudButton === true){                                                     //checks if the button is on or off if it is off then
    cloudButton = false;                                                         //change the checker to false (on)
    scene.add(clouds);                                                           //add the clouds THREE object
    document.getElementById("movButton").innerHTML = "turn clouds on";           //change the HTML button text to on
  }
  else {
    cloudButton = true;                                                          //change the checker to true (off)
    scene.remove(clouds);                                                        //remove the clouds THREE object
    document.getElementById("movButton").innerHTML = "turn clouds off";          //change the HTML button text to off
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

function soundLoader() {                                                        //called on page load
  document.getElementById("blueSound").play();                                  //gets the HTML element and plays the audio
}
