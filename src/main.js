
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

// shader uniforms are here so the time can be changed / accessed globally
var sUniforms = {
      image: { // used for height color
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./gradient2.jpg')
      },
      blinnimage: { // used for specular highlight
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./gradspec.jpg')
      },

      gradients: {type: "v2v", value: [new THREE.Vector2(1.0, 0), new THREE.Vector2(-1.0, 0),
      new THREE.Vector2(0, 1.0), new THREE.Vector2(0, -1.0),
      new THREE.Vector2(0.7071, 0.7071), new THREE.Vector2(-0.7071, 0.7071),
      new THREE.Vector2(0.7071, -0.7071), new THREE.Vector2(-0.7071, -0.7071)]},

      gradients3d: {type: "v3v", value: [
      new THREE.Vector3(0.7071, 0.7071, 0), new THREE.Vector3(-0.7071, 0.7071, 0), new THREE.Vector3(0.7071, -0.7071, 0),
      new THREE.Vector3(-0.7071, -0.7071, 0), new THREE.Vector3(0.7071, 0, 0.7071), new THREE.Vector3(-0.7071, 0, 0.7071),
      new THREE.Vector3(0.7071, 0, -0.7071),new THREE.Vector3(-0.7071, 0, -0.7071), new THREE.Vector3(0, 0.7071, 0.7071),
      new THREE.Vector3(0, -0.7071, 0.7071),new THREE.Vector3(0 ,0.7071, -0.7071),new THREE.Vector3(0, -0.7071, -0.7071)]},

      table: {
        type: "iv1",
        value: [151,160,137,91,90,15,
   131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
   190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
   88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
   77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
   102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
   135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
   5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
   223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
   129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
   251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
   49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
   138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]},
      time: {
        type: "i",
        value: 0
      },

      seed: {
        type: "i",
        value: 97
      },


      minOctave: {
        type: "i",
        value: 2
      },

      maxOctave: {
        type: "i",
        value: 7
      },

      light: {
        type: "v3",
        value: new THREE.Vector3(1, 1, 1)
      }
    }
var baseTime = Date.now();
var settings = {
  time: true,
  yaw: Math.PI / 4.0,
  pitch: Math.PI / 4.0
};


// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // LOOK: the line below is synyatic sugar for the code above. Optional, but I sort of recommend it.
  // var {scene, camera, renderer, gui, stats} = framework; 

  // initialize a simple box and material
  var box = new THREE.IcosahedronBufferGeometry(1, 6);

  var mat = new THREE.ShaderMaterial({
    uniforms: sUniforms,
    vertexShader: require('./shaders/adam-vert.glsl'),
    fragmentShader: require('./shaders/adam-frag.glsl')
  });
  var adamCube = new THREE.Mesh(box, mat);

  // set camera position
  camera.position.set(0, 0, 4);
  camera.lookAt(new THREE.Vector3(0,0,0));

  scene.add(adamCube);

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
  gui.add(settings, "time");
  gui.add(settings, 'yaw', -Math.PI, Math.PI);
  gui.add(settings, 'pitch', -Math.PI / 2.0, Math.PI / 2.0);

}

// called on frame updates
function onUpdate(framework) {
  console.log(`the time is ${new Date()}`);
  if (settings.time) {
    sUniforms.time.value = (Date.now() - baseTime);
  }
  sUniforms.light.value = new THREE.Vector3(Math.sin(settings.yaw) * Math.cos(settings.pitch)
    , Math.sin(settings.pitch), Math.cos(settings.yaw)  * Math.cos(settings.pitch));
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);