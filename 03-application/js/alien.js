var camera, scene, renderer, controls, object;
var w = window.innerWidth;
var h = window.innerHeight;
var footerWidth;
var clickCount = 0;
var helpCount = 0;
var i = 0;
var mouseX = 0;
var mouseY = 0;
var rocketCount = 0;
var rocketSwitch = false;
var rocketButton = false;
var launchRockets = false;
var rocket = new THREE.Object3D();

window.onload = function() {
  smoothLoader();
  soundLoader();
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
	renderer.setSize(w, h);
  renderer.autoClear = true;
  renderer.setClearColor(0xffffff, 0);
  document.getElementById('canvas').appendChild(renderer.domElement);
	scene = new THREE.Scene();

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath( 'assets/models/environments/' );
  var url = "alien.mtl";
  mtlLoader.load( url, function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( 'assets/models/environments/' );
    objLoader.load( 'alien.obj', function ( object ) {
        object.rotation.x = 0.3;
        object.scale.x = object.scale.y = object.scale.z = 0.25;
        scene.add( object );
    });
  });

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath( 'assets/models/movers/' );
  var url = "rocket.mtl";
  mtlLoader.load( url, function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( 'assets/models/movers/' );
    objLoader.load( 'rocket.obj', function ( object ) {
        object.rotation.x = 0.3;
        object.scale.x = object.scale.y = object.scale.z = 0.25;
        rocket.add( object );
    });
  });
  scene.add(rocket);

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
  scene.add(light);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 30, 50, 50 );
  scene.add(light);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 10, 10, 10 );
  scene.add(light);

  window.setTimeout(function() {
    launchRockets = true;
  }, 8000);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
  if (launchRockets === true) {
    if (rocketCount > 2) rocketSwitch = true;
    else if (rocketCount < 0) rocketSwitch = false;
    if (rocketSwitch === true) rocketCount = rocketCount - 0.005;
    else if (rocketSwitch === false) rocketCount = rocketCount + 0.005;
    rocket.position.y = rocketCount;
  }
  camera.position.x += (mouseX - camera.position.x) *0.02;
  controls.update();
  renderer.clear();
	renderer.render(scene, camera);
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
  }, 6000);
  setTimeout(function () {
    document.getElementById("early").style.zIndex = "0";
  }, 7000);
  setTimeout(function () {
    init();
    animate();
    styler();
  }, 3000);
}

function movClick() {
  if (rocketButton === true){
    rocketButton = false;
    scene.add(rocket);
    document.getElementById("movButton").innerHTML = "turn rocket on";
  }
  else {
    rocketButton = true;
    scene.remove(rocket);
    document.getElementById("movButton").innerHTML = "turn rocket off";
  }
}

function styler() {
  footerWidth = document.getElementById("footerTag").offsetWidth;
  document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;
}

function helpClick() {
  var checker = oddEvenCheck(helpCount);
  if (checker === true) {
    document.getElementById("helpLink").src = "assets/icons/help2.png";
    document.getElementById("footerTag").style.right = `10px`;
  }
  else {
    document.getElementById("helpLink").src = "assets/icons/help.png";
    document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;
  }
  helpCount = helpCount + 1;
}

function oddEvenCheck(x) {
  if (x % 2 == 0) {
    return true;
  }
  else {
    return false;
  }
}

function soundLoader() {
  document.getElementById("alienSound").play();
  console.log("played");
}
