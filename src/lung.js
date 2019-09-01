import { GLTFLoader } from '../vendor/gltfloader.js';
import { Stats } from '../vendor/stats.js';
import { Vector3, Object3D } from '../vendor/three.module.js';




var renderer = new THREE.WebGLRenderer({
    alpha: true
});

renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild(renderer.domElement);
var onRenderFcts = [];
var scene = new THREE.Scene();


var camera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerWidth, 0.1, 50);

camera.rotation.set(0, 0, THREE.Math.degToRad(-180));
scene.add(camera);




var arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam', 
});
arToolkitSource.init(function onReady() {
    onResize();
})

// handle resize
window.addEventListener('resize', function () {
    onResize();
})
function onResize() {
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
}

var arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: '../models/markers/camera_para.dat',
    detectionMode: 'mono',
    maxDetectionRate: 30,
    canvasWidth: 80 * 3,// window.innerWidth, //80*3,
    canvasHeight: 60 * 3// window.innerHeight, //60*3,
});

// initialize it
arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

onRenderFcts.push(function () {
    if (arToolkitSource.ready === false) return;
    arToolkitContext.update(arToolkitSource.domElement);
});

var markerRoot = new THREE.Group();
scene.add(markerRoot);

var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: '../models/markers/patt.hiro'
});

var smoothedRoot = new THREE.Group();
scene.add(smoothedRoot);
var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot,
    {
        lerpPosition: 0.4,
        lerpQuaternion: 0.3,
        lerpScale: 1,
    }
);
onRenderFcts.push(function (delta) {
    smoothedControls.update(markerRoot);
});

var arWorldRoot = smoothedRoot;

let loader = new GLTFLoader();

loader.load('/models/lung.glb', function (glb) {
    //scene.add(glb.cameras[0]);
    //glb.scene.position.setX(-0.04); //  = new THREE.Vector3(0.011, -1.903, -0.788);
    //glb.scene.position.setY(5.027);
    //glb.scene.position.setZ(-1);
    //glb.scene.scale.addScalar(1.00); // = new THREE.Vector3(2.088, 2.088, 2.088);
    //scene.add(glb.scene);
    glb.scene.rotateX(THREE.Math.degToRad(90));
    var light = new THREE.DirectionalLight(new THREE.Color(0xFFFFFF));
    light.target = glb.scene;
    scene.add(light);

    glb.scene.scale.multiplyScalar(5);
    arWorldRoot.add(glb.scene);

}, undefined, function (err) { console.log(err); }
);


onRenderFcts.push(function () {
    renderer.render(scene, camera);
});

var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
    requestAnimationFrame(animate);
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000);
    });
});