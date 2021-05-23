import * as THREE from 'https://unpkg.com/three@0.120.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.120.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.120.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://unpkg.com/three@0.120.0/examples/jsm/loaders/RGBELoader.js';

let container, controls, camera, scene, renderer, animating, animation, points, curvePath;

init();


// start/stop animation with Space bar
document.addEventListener("keydown", function(e) {
    if (e.keyCode == 32) {
        animating = !animating;
        console.log("animating ", animating);

        if (animating) {
            animate();
        } else {
            cancelAnimationFrame(animation);
        }
    }
});

function init() {
    container = document.getElementById('main');

    scene = new THREE.Scene();
    scene.background = new THREE.Color (0xe5e5e5);


    // create camera
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.5;
    const far = 10000;
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 5, 35 ); 
    camera.lookAt(scene.position);

    
    // pre-load
    const loadingManager = new THREE.LoadingManager( () => {
        const loadingScreen = document.getElementById( 'loading-screen' );
        loadingScreen.classList.add( 'fade-out' );
        loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    } );

    var plane = new THREE.GridHelper(1000, 1000);
    plane.material.color = new THREE.Color('white');
    scene.add(plane);

    // load environment
    // new RGBELoader( loadingManager )
    //     .setDataType( THREE.UnsignedByteType )
    //     .setPath( './assets/' )
    //     .load( 'clear_2k.hdr', function ( texture ) {
    //         const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
    //         scene.background = envMap;
    //         scene.environment = envMap;
    //         texture.dispose();
    //         pmremGenerator.dispose();
    //         render();
    //     } );

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


    /******* CAMERA SPLINE PATH TO CURVE *******/
    // camera spline path of curve.obj
    points = [
        [-7.8368770389125206, -5.5921710185001299, -12.424691196094749],
        [-3.3722313435066651, -0.48069695202322105, -9.9016240676821035],
        [0.30444937194192034, 4.3927464033032937, -5.3246573688645],
        [3.0744452999023304, -3.5639012614165462, -0.43594777140955621],
        [4.6018090297980025, 3.82005824798871, 4.2379416258610405],
        [9.5361043607426303, 1.2050376158445908, 8.4588065839097109],
        [15.815309624805316, -4.253848652305229, 6.390485237885942],
        [16.641977263032516, 3.3154610639417252, 2.0034314709805154],
        [17.241766169284681, 8.6254366685932702, -2.9010649840056639],
        [9.239188244370073, 7.7703105673069608, -4.9501391257569853],
        [6.5476492582751273, 2.0784404063061999, -7.2926604862776028],
        [-0.98646919261547605, -3.9928781723256481, -7.1996174111352147],
        [-5.3336614075002107, 2.5840557348028037, -5.324291651554856],
        [-11.551560810930553, 2.592140757673242, -2.0510702779073409],
        [-13.116424984228814, -3.5294456548853903, 1.0874738150715371],
        [-13.740155728215255, -0.1130522854787781, 7.0025609392324633],
        [-8.240950871524678, 3.6833169589187555, 8.6669504521467822],
        [-3.8027692319839637, -2.2168819959338735, 6.7574035250235136],
        [-0.048027777811617378, 2.1263742178128, 2.907849977163508],
        [4.6509022106330038, 5.5067262522481304, -2.4516283675682402],
        [7.1203518656779092, -2.8420314690425137, -4.8361503451234595],
        [10.438556045012231, -0.58000714948425958, -11.185820339097452],
        [15.104516813255898, 4.3417612422062, -9.5495871351730166],
        [18.248584550884246, -0.032695349963131726, -6.6425135204112324],
        [16.812682086023905, -4.3046477571364896, -1.5782330084978267],
        [12.25792484754427, 3.0483638701073383, 0.33044080978279866],
        [9.2248704508961428, -3.7966524177487608, 2.1232466082620594],
        [3.7900467096681245, -4.3209027453050819, 6.9506707762538085],
        [1.1751233488464128, 4.0459472266632606, 7.3270341520604312],
        [-5.8142520144230332, 2.1705015159640078, 3.5984661509749096],
        [-7.9167895269300104, -3.3221295226582002, 0.88112404337076211],
        [-8.4980334244305471, -2.5030031587663024, -6.4086069978319271],
        [-7.5220692786297256, 4.3745044063245109, -8.7492458866593594],
        [-2.1177948899743781, 2.6675279013027753, -13.045965480547508],
        [2.8144801832509776, 0.36828781267355359, -14.661016885970387],
        [8.7547830289571369, -1.126391000261143, -13.487715420393959],
        [13.13659217432426, -4.5412324043138632, -11.238873704125526],
        [14.185772959548132, -8.4417503536237088, -6.8583657578298762],
        [13.134478794215049, -7.1422684762240509, -1.0623389232114611],
        [13.612363583942543, -2.8026581179670358, 2.9537051560446406],
        [11.968767841050928, 4.0278702768430374, 6.5090695881549152],
        [10.955421931774818, 0.95538301426229788, 12.933331997844018],
        [5.9155516127264054, 0.099122408920293975, 15.376191065411078],
        [0.27010806398744625, -0.59525708013582357, 15.25101449275852],
        [-4.2468388662121024, -3.3892652648907386, 12.734868706073977],
        [-9.0513087802482612, -4.9705121006179667, 7.4873318673845732],
        [-11.140144133102769, 0.62656360113088483, 4.0323697894645951],
        [-15.308516351948274, 4.8224031521105237, -0.52150294150138143],
        [-15.355760136615935, 0.80552527819005726, -5.9059371471669921],
        [-13.671364998859115, -1.6712894652860817, -10.306831924069559]
    ];

    const scale = 1.03;

    // =========== Convert the array of points into vertices
    for (var i = 0; i < points.length; i++) {
        var x = points[i][0] * scale;
        var y = points[i][1] * scale;
        var z = points[i][2] * scale;
        points[i] = new THREE.Vector3(x, y, z);
    }

    //============== Create a path from the points
    curvePath = new THREE.CatmullRomCurve3(points);
    const radius = .25;

    //============== Create a tube geometry that represents our curve
    const geometry = new THREE.TubeGeometry(curvePath, 800, radius, 8, true);


    //============= random face color for the tube.
    for (var i = 0, j = geometry.faces.length; i < j; i++) {
        geometry.faces[i].color = new THREE.Color("hsl(" + Math.floor(Math.random() * 290) + ",50%,50%)");
    }

    const material = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        vertexColors: THREE.FaceColors,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });

    //============= Create tube for path, hide visibility
    const tube = new THREE.Mesh(geometry, material);
    tube.visible = false;
    scene.add(tube);



    // add light
	const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( -1, -1, 0 );
	scene.add( directionalLight );

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

    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxPolarAngle = Math.PI / 2.1;

    // use if there is no animation loop
    // controls.addEventListener( 'change', render ); 
    // controls.minDistance = 0;
    // controls.maxDistance = 45;
    // controls.target.set( 0, 0, 0 );
    // controls.update();

    // window resize listener
    window.addEventListener( 'resize', onWindowResize, false );
}

// primary rendering
function render() {
    renderer.render( scene, camera );
}


// re-render on window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

function onTransitionEnd( event ) {
	event.target.remove();
}

  //===================================================== Animate camera on the curve
  var percentage = 0;
  var prevTime = Date.now();
  
  function MoveCamera() {
    percentage += 0.0001;
    var p1 = curvePath.getPointAt(percentage % 1);
    var p2 = curvePath.getPointAt((percentage + 0.01) % 1);
  
    camera.position.x = p1.x + 1.5;
    camera.position.y = p1.y + 1.5;
    camera.position.z = p1.z - 4;
    camera.lookAt(p2.x, p2.y, p2.z);
  }

  //===================================================== Animate
  function animate() {
    renderer.render(scene, camera);
    animation = requestAnimationFrame(animate);
    controls.update();
    MoveCamera();
  }