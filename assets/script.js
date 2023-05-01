import * as THREE from 'https://unpkg.com/three@0.120.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.120.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.120.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://unpkg.com/three@0.120.0/examples/jsm/loaders/RGBELoader.js';

var container, controls, camera, scene, renderer;

init();
animate();

// document.body.onkeyup = function(e) {
//     if (e.keyCode == 32) {
//         animating = !animating;
//     }
// }

function init() {
    container = document.getElementById('main');

    // create camera and scene
    scene = new THREE.Scene();

    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.5;
    const far = 100;
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 3, 24 );
    camera.lookAt(scene.position);

    
    // pre-load
    const loadingManager = new THREE.LoadingManager( () => {
        const loadingScreen = document.getElementById( 'loading-screen' );
        loadingScreen.classList.add( 'fade-out' );
        loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    } );

    // load environment
    new RGBELoader( loadingManager )
        .setDataType( THREE.UnsignedByteType )
        .setPath( './assets/' )
        .load( 'sunset.hdr', function ( texture ) {
            var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
            scene.background = envMap;
            scene.environment = envMap;
            texture.dispose();
            pmremGenerator.dispose();
            render();
        } );

    // load model
    new GLTFLoader( loadingManager )
        .setPath( './assets/' )
        .load( 'knot.glb', function ( gltf ) {
            gltf.scene.traverse( function ( child ) {
                if ( child.isMesh ) {
                }
            } );
            scene.add( gltf.scene );
            render();
        } );

    // const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
	// scene.add( ambientLight );

	// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	// directionalLight.position.set( 1, 1, - 1 );
	// scene.add( directionalLight );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 10;
    controls.maxDistance = 40;
    controls.target.set( 0, 0, 0 );
    controls.update();

    // window resize listener
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // render();
}

function animate() {
    requestAnimationFrame( animate );
    
	render();
}

function render() {
    //using timer as animation
    var speed = Date.now() * 0.0001;
    camera.position.x = Math.cos(speed) * -10;
    // camera.position.z = Math.sin(speed) * 10;
  
    camera.lookAt(scene.position); //0,0,0

    renderer.render( scene, camera );
}

function onTransitionEnd( event ) {
	event.target.remove();
}
