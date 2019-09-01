import './styles/main.css';
//import 'aframe';
//import '../models/arjs.glb';

import * as THREE from 'threear/node_modules/three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREEAR from 'threear';


//import { Object3D as obj3d } from 'threear/node_modules/three/src/core/Object3D';

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.25, 20);
// camera.position.set( - 1.8, 0.9, 4 );

// //var light = new THREE.DirectionalLight(new THREE.Color(0xFFFFFF));
// //scene.add(light);

// var renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.gammaOutput = true;
// document.body.appendChild(renderer.domElement);
// //scene.background = new THREE.Color(0xFFFFFF);


// var controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set( 0, - 0.2, - 0.2 );
// controls.update();

// var source = new THREEAR.Source({ renderer, camera});


// // var geometry = new THREE.BoxGeometry(1,1,1);
// // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// // var cube = new THREE.Mesh(geometry, material);
// // scene.add(cube);
// // camera.position.z = 5;


var loader = new GLTFLoader();

loader.load('/models/arjs.glb', function (glb) {

    console.log(glb.scene.getWorldPosition);

    glb.cameras[0]
    glb.scene.position.setX(0.011); //  = new THREE.Vector3(0.011, -1.903, -0.788);
    glb.scene.position.setY(-18.00);
    glb.scene.position.setZ(-0.788);
    glb.scene.scale.addScalar(14.088); // = new THREE.Vector3(2.088, 2.088, 2.088);
    //scene.add(glb.scene);
   //glb.scene.scale.multiplyScalar(1);
    scene.add( glb.scene );

}, undefined, function(err) { console.log(err); } 
);



// function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
//     //cube.rotation.x += 0.01;
//     //cube.rotation.y += 0.01;
// }
// animate();


var renderer = new THREE.WebGLRenderer({
    // antialias	: true,
    alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild( renderer.domElement );

// init scene and camera
var scene = new THREE.Scene();
var camera = new THREE.Camera();
scene.add(camera);
var markerGroup = new THREE.Group();
scene.add(markerGroup);

var source = new THREEAR.Source({ renderer, camera });
THREEAR.initialize({ source: source }).then((controller) => {
    // add a torus knot		
    var geometry = new THREE.TorusKnotGeometry(0.3,0.1,64,16);
    var material = new THREE.MeshNormalMaterial(); 
    var torus = new THREE.Mesh( geometry, material );
    torus.position.y = 0.5
    markerGroup.add(torus);
    var boxgeometry = new THREE.BoxGeometry(1,1,1);
    var boxmaterial = new THREE.MeshNormalMaterial({
        transparent : true,
        opacity: 0.5,
        side: THREE.DoubleSide
    }); 
    var cube = new THREE.Mesh( boxgeometry, boxmaterial );
    cube.position.y	= boxgeometry.parameters.height / 2;
    markerGroup.add(cube)
    var patternMarker = new THREEAR.PatternMarker({
        patternUrl: '/models/patt.hiro',
        markerObject: (markerGroup)
    });

    controller.trackMarker(patternMarker);
    // run the rendering loop
    var lastTimeMsec = 0;
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec-1000/60;
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        // call each update function
        controller.update( source.domElement );
        // cube.rotation.x += deltaMsec/10000 * Math.PI
        torus.rotation.y += deltaMsec/1000 * Math.PI
        torus.rotation.z += deltaMsec/1000 * Math.PI
        renderer.render( scene, camera );
    });
});