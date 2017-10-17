
var container, stats;

var camera, scene, renderer;

var rocks, geometry;

var cubeCamera;

var sunLight, pointLight, ambientLight;

var mixer;

var clock = new THREE.Clock();

var shadowCameraHelper, shadowConfig = {

  shadowCameraVisible: false,
  shadowCameraNear: 750,
  shadowCameraFar: 4000,
  shadowCameraFov: 30,
  shadowBias: -0.0002

};


window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if (!mobilecheck()) {
  var playScript = document.createElement('script');
  playScript.src = './lib/play.js';
  document.body.appendChild(playScript)
}
init();
animate();

function init() {
  container = document.querySelector('#container');

  // CAMERA

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 2, 1000 );
  if (mobilecheck()) camera.position.set( 50, 0, 200 )

  // SCENE

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0, 1000, 10000 );

  // MORPHS

  var loader = new THREE.JSONLoader();

  loader.load( "/models/sittingBox.js", function( geometry ) {

    var morphMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xffffff, shininess: 50, morphTargets: true, side: THREE.DoubleSide, shading: THREE.FlatShading } );

    var mesh = new THREE.Mesh( geometry, morphMaterial );

    mixer = new THREE.AnimationMixer( mesh );

    mixer.clipAction( geometry.animations[0] ).setDuration( 10 ).play();

    var s = 40;
    mesh.scale.set( s, s, s );
    mesh.position.set(100, -50, -250);

    //morph.duration = 8000;
    //morph.mirroredLoop = true;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add( mesh );

  } );
  
  //rocks
  var rocksMaterial = new THREE.MeshLambertMaterial({
    color: '#0a0a0a',
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  });

  loader.load('/models/rocks.js', function (geometry) {
    rocks = new THREE.Mesh(geometry, rocksMaterial);
    rocks.name = "platform";
    var s = 2.7;
    rocks.scale.set(s, s, s);
    rocks.position.set(-100, -50, -100);
    scene.add(rocks);
  })

  scene.add(getSphere())
  // LIGHTS

  pointLight = new THREE.PointLight( 0xffffff, 1, 500 );
  pointLight.position.set(0, 400, -100);
  scene.add( pointLight );

  sunLight = new THREE.SpotLight( 0xffffff, 0.3, 0, Math.PI/2 );
  sunLight.position.set( 1000, 2000, -2000 );

  sunLight.castShadow = true;

  sunLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( shadowConfig.shadowCameraFov, 1, shadowConfig.shadowCameraNear, shadowConfig.shadowCameraFar ) );
  sunLight.shadow.bias = shadowConfig.shadowBias;

  scene.add( sunLight );

  // RENDERER

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  //

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  // EVENTS

  window.addEventListener( 'resize', onWindowResize, false );

}

// moon
function getSphere() {
  var material = new THREE.MeshBasicMaterial({ color: '#ffffff', fog: false });
  var geometry = new THREE.SphereGeometry(40, 20, 20);
  var mesh = new THREE.Mesh(geometry, material);

  mobilecheck() ? mesh.position.set(-50, 260, -800) : mesh.position.set(-250, 120, -600);

  return mesh;
};
//

function onWindowResize( event ) {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  //phone
  //if (window.innerWidth)

}

//

function animate() {

  requestAnimationFrame( animate );
  render();

}

function render() {

  // update

  var delta = clock.getDelta();

  if ( mixer ) {

    mixer.update( delta );

  }

  // render scene

  renderer.render( scene, camera );

}