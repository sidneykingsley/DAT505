var camera, scene, renderer, object, loader, controls;
var w = window.innerWidth;
var h = window.innerHeight;
var footerWidth;
var birdsYes = false;
var objCount = 1;
var helpCount3 = 0;
var runningCount = 0;

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
  var url = "earth.mtl";
  mtlLoader.load( url, function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( 'assets/models/environments/' );
    objLoader.load( 'earth.obj', function ( object ) {
        object.rotation.y = 1.565;
        object.rotation.x = 0.3;
        object.scale.x = object.scale.y = object.scale.z = 0.25;
        scene.add( object );
    });
  });

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 3;

  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add(light);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 30, 50, 50 );
  scene.add(light);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 10, 10, 10 );
  scene.add(light);

  window.addEventListener('resize', onWindowResize, false);
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
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

function styler() {
  footerWidth = document.getElementById("footerTag").offsetWidth;
  document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;
}

function helpClick() {
  var checker = oddEvenCheck(helpCount3);
  if (checker === true) {
    document.getElementById("helpLink").src = "assets/icons/help2.png"
    document.getElementById("footerTag").style.right = `10px`;
  }
  else {
    document.getElementById("helpLink").src = "assets/icons/help.png"
    document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;
  }
  helpCount3 = helpCount3 + 1;
}

function oddEvenCheck(x) {
  if (x % 2 == 0) {
    return true;
  }
  else {
    return false;
  }
}

function birdButtonClick() {
  if (birdsYes === true){
    birdsYes = false;
    document.getElementById("birdButton").innerHTML = "turn birds on";
  }
  else {
    birdsYes = true;
    reloader();
    document.getElementById("birdButton").innerHTML = "turn birds off";
  }
}

function soundLoader() {
  document.getElementById("earthSound").play();
  console.log("played");
}
