var renderer, scene, camera;
var cubes = [];
var generator = new Simple1DNoise();
var controls;
var sizerX1,sizerX2;
var sizerY1,sizerY2;

function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth, H = window.innerHeight;
  camera = new THREE.PerspectiveCamera(100, W / H, .1, 1000);
  camera.position.set(0, 100, 0);
  camera.lookAt(scene.position);
  controls = new THREE.OrbitControls(camera);
  window.addEventListener( 'resize', onWindowResize, false );

  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(0, 1000, 0);
  scene.add(spotLight);

  var spotLight2 = new THREE.SpotLight(0xFFFFFF);
  spotLight2.position.set(0, -1000, 0);
  scene.add(spotLight2);

  renderer = new THREE.WebGLRenderer({antialias:true});
  // renderer.setClearColor(0x000);
  renderer.setSize(W, H);
  renderer.autoClear = false;
  renderer.setClearColor(0xFFFFFF, 0.0);

    sizerX1 = -5;
    sizerX2 = 5;
    sizerY1 = -5;
    sizerY2 = 5;

    var cylGeometry = new THREE.CylinderGeometry(1, 1, 3, 15);
    var cylMaterial = new THREE.MeshNormalMaterial({color: 0xFFFFFF});
    var cyl = new THREE.Mesh(cylGeometry, cylMaterial);
    cyl.position.x = 0;
    cyl.position.z = 0;
    cyl.scale.y = 0.5;
    scene.add(cyl);
    cubes.push(cyl);
  setInterval(function () {
    if (sizerX2 < 40) {
      for (var x = sizerX1; x <= sizerX2; x += 5) {
       for (var y = sizerY1; y <= sizerY2; y += 5) {
        var cylGeometry = new THREE.CylinderGeometry(1, 1, 3, 15);
        var cylMaterial = new THREE.MeshNormalMaterial({color: 0xFFFFFF});
        var cyl = new THREE.Mesh(cylGeometry, cylMaterial);
        cyl.position.x = x;
        cyl.position.z = y;
        cyl.scale.y = 0.5;
        scene.add(cyl);
        cubes.push(cyl);
       }
     }
       sizerX1= sizerX1 -5;
       sizerX2= sizerX2 +5;
       sizerY1= sizerY1 -5;
       sizerY2= sizerY2 +5;
    }

  }, 1000);
  // for (var x = sizerX1; x <= sizerX2; x += 5) {
  //    for (var y = -5; y <= 5; y += 5) {
  //     var cylGeometry = new THREE.CylinderGeometry(1, 1, 3, 15);
  //     var cylMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
  //     var cyl = new THREE.Mesh(cylGeometry, cylMaterial);
  //     cyl.position.x = x;
  //     cyl.position.z = y;
  //     cyl.scale.y = 0.5;
  //
  //     scene.add(cyl);
  //     cubes.push(cyl);
  //    }
  // }

  document.body.appendChild(renderer.domElement);
}

var rot = 0;

function drawFrame(ts){
  requestAnimationFrame(drawFrame);

  cubes.forEach(function(c, i) {
    c.rotation.x = rot;
    c.rotation.y = rot;
    c.scale.y = Math.cos(ts/600*Math.PI + c.position.x*5 + c.position.z/10) + 1;
  });
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
drawFrame();
