// THREE.JS VIEWER

const WIDTH = viewer.offsetWidth;
const HEIGHT = viewer.offsetHeight;

const camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 0.1, 1000 );
camera.position.set( 10, 1, 10 );
camera.lookAt( 0, 1.5, 0 );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x222222 );

const controls = new THREE.OrbitControls( camera );

const clock = new THREE.Clock();
let mixer;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( WIDTH, HEIGHT );
viewer.appendChild( renderer.domElement );

function animate() {

  const time = performance.now() / 5000;

  // camera.position.x = Math.sin( time ) * 5;
  // camera.position.z = Math.cos( time ) * 5;
  camera.lookAt( 0, 1.5, 0 );
  controls.update();

  render()
  requestAnimationFrame( animate );

}

requestAnimationFrame( animate );

// LIGHTS
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );

hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
scene.add( hemiLightHelper );

//
const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -1, 1.75, 1 );
dirLight.position.multiplyScalar( 30 );
scene.add( dirLight );

// dirLight.castShadow = true;
// dirLight.shadow.mapSize.width = 2048;
// dirLight.shadow.mapSize.height = 2048;

// const d = 50;
// dirLight.shadow.camera.left = -d;
// dirLight.shadow.camera.right = d;
// dirLight.shadow.camera.top = d;
// dirLight.shadow.camera.bottom = -d;
// dirLight.shadow.camera.far = 3500;
// dirLight.shadow.bias = -0.0001;
// dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 ) 
// scene.add( dirLightHeper );

// POLY REST API

const API_KEY = 'AIzaSyDA-gZYybzoSjtuF9WhphZ89mcvXNUKqC0';

function loadPolyAsset( id ) {

  const url = `https://poly.googleapis.com/v1/assets/${id}/?key=${API_KEY}`;

  const request = new XMLHttpRequest();
  request.open( 'GET', url, true );
  request.addEventListener( 'load', function ( event ) {

    const asset = JSON.parse( event.target.response );

    asset_name.textContent = asset.displayName;
    asset_author.textContent = asset.authorName;
    asset_name_url.href = `https://poly.google.com/view/${id}`;

    const format = asset.formats.find( format => { return format.formatType === 'GLTF'; } );

    if ( format !== undefined ) {

      const url = format.root.url;

      const loader = new THREE.LegacyGLTFLoader();
      loader.load( url, function ( response ) {

        scene.add( response.scene );
      } );

    }

  } );
  request.send( null );

}

loadPolyAsset( '2AoABqMjQih' );

// iron box
const loader = new THREE.JSONLoader();

loader.load( "src/assets/sittingBox.js", function( geometry ) {
  const morphMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xffffff, shininess: 50, morphTargets: true, side: THREE.DoubleSide, flatShading: true } );
  const mesh = new THREE.Mesh( geometry, morphMaterial );
  mixer = new THREE.AnimationMixer( mesh );
  mixer.clipAction( geometry.animations[0] ).setDuration( 10 ).play();
  const s = 0.7;
  mesh.scale.set( s, s, s );
  mesh.position.set(4.5, -0.3, 5.5);
  //morph.duration = 8000;
  //morph.mirroredLoop = true;
  // mesh.castShadow = true;
  // mesh.receiveShadow = true;
  scene.add( mesh );
} );

function render() {
  const delta = clock.getDelta();
  controls.update();

  if ( mixer ) {
    mixer.update( delta );
  }

  renderer.render( scene, camera );
  
}

function onWindowResize( event ) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  controls.handleResize();
}
