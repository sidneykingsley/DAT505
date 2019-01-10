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
var helpCount2 = 0;
var footerWidth;

window.onload = function() {
  smoothLoader();
  styler()
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });         //applies WebGL
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);  //sets thte pixel ratio appropiate for the device
	renderer.setSize(w, h-perc);                                                  //makes the renderer the size of the screen minus an overlap of height (perc)
  renderer.autoClear = true;                                                    //clears the background of the renderer so you can see the css
  renderer.setClearColor(0x000000, 0.0);                                        //sets the background to an opacity of 0
  document.getElementById('canvas').appendChild(renderer.domElement);           //makes the renderer a child of the HTML element id as "canvas"

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

  window.addEventListener('resize', onWindowResize, false);
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
  for (var i=0;i< sphere.length;i++) {
    switch (randomSpinDir[i]) {
      case 0:
        sphere[i].rotation.y += randomSpin(0.001,0.006);
      break;
      case 1:
        sphere[i].rotation.y -= randomSpin(0.001,0.006);
      break;
      case 2:
        sphere[i].rotation.x += randomSpin(0.001,0.006);
      break;
      case 3:
        sphere[i].rotation.x -= randomSpin(0.001,0.006);
      break;
      default:
    	sphere[i].rotation.y += 0.002;
    }
  }
  controls.update();
  renderer.clear();
	renderer.render(scene, camera);
}

function createSphere(radius, segments, planetCount) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map:         THREE.ImageUtils.loadTexture(`assets/textures/albedo${planetCount}.jpg`),
		  specularMap: THREE.ImageUtils.loadTexture(`assets/textures/specular${planetCount}.jpg`),
			specular:    new THREE.Color('grey')
		})
	);
}

function randomSpin(min,max){
  return Math.random() * (max-min) + min ;
}

function smoothLoader() {
  var dots = window.setInterval( function() {
      var wait = document.getElementById("earlyText");
      if ( wait.innerHTML.length > 2 ) wait.innerHTML = ".";
      else wait.innerHTML += ".";
  }, 500);
  setTimeout(function () {
    document.getElementById("earlyText").style.opacity = "0";
  }, 3000);
  setTimeout(function () {
    document.getElementById("early").style.opacity = "0";
        clearInterval(dots);
  }, 4000);
  setTimeout(function () {
    document.getElementById("early").style.zIndex = "0";
  }, 7000);
  setTimeout(function () {
    init();
    animate();
    styler();
  }, 3000);
}

function rightClick() {
  clickCount = clickCount + 1;
  if (clickCount < sphere.length) {
    for (var i=0;i<sphere.length;i++) {
      sphere[i].position.x = sphere[i].position.x-2;
    }
  }
  if (clickCount > 0) document.getElementById("leftButton").style.display = "flex";
  else document.getElementById("leftButton").style.display = "none";
  if (clickCount < sphere.length-1) document.getElementById("rightButton").style.display = "flex";
  else document.getElementById("rightButton").style.display = "none";
  switch (clickCount) {
    case 0:
      document.getElementById("planetTitle").innerHTML = "EARTH";
      break;
    case 1:
      document.getElementById("planetTitle").innerHTML = "ALIEN PLANET";
      break;
    case 2:
      document.getElementById("planetTitle").innerHTML = "BLUE JUPITER";
      break;
    default:
    document.getElementById("planetTitle").innerHTML = "EARTH";
  }
}

function leftClick() {
  clickCount = clickCount - 1;
  if (clickCount < sphere.length) {
    for (var i=0;i<sphere.length;i++) {
      sphere[i].position.x = sphere[i].position.x+2;
    }
  }
  if (clickCount > 0) document.getElementById("leftButton").style.display = "flex";
  else document.getElementById("leftButton").style.display = "none";
  if (clickCount < sphere.length-1) document.getElementById("rightButton").style.display = "flex";
  else document.getElementById("rightButton").style.display = "none";
  switch (clickCount) {
    case 0:
      document.getElementById("planetTitle").innerHTML = "EARTH";
      break;
    case 1:
      document.getElementById("planetTitle").innerHTML = "ALIEN PLANET";
      break;
    case 2:
      document.getElementById("planetTitle").innerHTML = "BLUE JUPITER";
      break;
    default:
    document.getElementById("planetTitle").innerHTML = "NONE";
  }
}

function planetRedirect() {
  switch (clickCount) {
    case 0:
      window.location.replace("earth.html");
      break;
    case 1:
      window.location.replace("alien.html");
      break;
    case 2:
      window.location.replace("blue.html");
      break;
    default:
      window.location.replace("earth.html");
  }
}

function styler() {
  footerWidth = document.getElementById("footerTag").offsetWidth;
  document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;
}

function helpClick() {
  var checker = oddEvenCheck(helpCount2);
  if (checker === true) {
    document.getElementById("helpLink").src = "assets/icons/help2.png"
    document.getElementById("footerTag").style.right = `10px`;
  }
  else {
    document.getElementById("helpLink").src = "assets/icons/help.png"
    document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;
  }
  helpCount2 = helpCount2 + 1;
}

function oddEvenCheck(x) {
  if (x % 2 == 0) {
    return true;
  }
  else {
    return false;
  }
}
