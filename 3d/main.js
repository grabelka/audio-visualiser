const audioInput = document.getElementById("audioInput");
const audioPlayer = document.getElementById("audioPlayer");
const radioButtons = document.getElementsByName('options');
let selectedFile = '';
let audioContext = null;
let analyser = null;
let source = null;

const scene = new THREE.Scene();
scene.background = new THREE.Color('white');
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
let min = Math.min((Math.min(window.innerWidth, window.innerHeight) * 0.7), 400);
renderer.setSize(min, min);
document.getElementById('scene-container').appendChild(renderer.domElement);
const geometry1 = new THREE.BoxGeometry(6, 1, 1);
const geometry2 = new THREE.BoxGeometry(1, 6, 1);
const geometry3 = new THREE.BoxGeometry(1, 1, 6);
let material1 = null;
let cube1 = null;
let material2 = null;
let cube2 = null;
let material3 = null;
let cube3 = null;
camera.position.z = 6;
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 5, 7);
scene.add(pointLight);
renderer.render(scene, camera);

const colorPicker = document.getElementById('colorPicker');
let visualizerColor = colorPicker.value;
colorPicker.addEventListener('input', () => {
  visualizerColor = colorPicker.value;
});
const colorPicker2 = document.getElementById('colorPicker2');
let visualizerColor2 = colorPicker2.value;
colorPicker2.addEventListener('input', () => {
  visualizerColor2 = colorPicker2.value;
});
const colorPicker3 = document.getElementById('colorPicker3');
let visualizerColor3 = colorPicker3.value;
colorPicker3.addEventListener('input', () => {
  visualizerColor3 = colorPicker3.value;
});
colorPicker2.style.visibility = "visible";
colorPicker3.style.visibility = "visible";

radioButtons.forEach(radio => {
  radio.addEventListener('change', () => {
    console.log(radio)
    if (radio.value != '3d') {
      window.location.href = "../index.html";
    }
  });
});

audioInput.addEventListener("change", function () {
  selectedFile = audioInput.files[0];

  if (selectedFile) {
    if (source && source.mediaElement !== null) {
      source.disconnect(); 
    }
    source = null; 
    audioPlayer.src = "";
    const objectURL = URL.createObjectURL(selectedFile);
    audioPlayer.src = objectURL;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    material1 = new THREE.MeshBasicMaterial({ color: visualizerColor });
    cube1 = new THREE.Mesh(geometry1, material1);
    cube1.receiveShadow = true;
    scene.add(cube1);
    material2 = new THREE.MeshBasicMaterial({ color: visualizerColor2 });
    cube2 = new THREE.Mesh(geometry2, material2);
    cube2.receiveShadow = true;
    scene.add(cube2);
    material3 = new THREE.MeshBasicMaterial({ color: visualizerColor3 });
    cube3 = new THREE.Mesh(geometry3, material3);
    cube3.receiveShadow = true;
    scene.add(cube3);
  } else {
    alert("Please select an audio file.");
  }
});

function visualize() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  const scale = (dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length) / 100;

  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;
  cube1.scale.set(scale, scale, scale);
  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;
  cube2.scale.set(scale, scale, scale);
  cube3.rotation.x += 0.01;
  cube3.rotation.y += 0.01;
  cube3.scale.set(scale, scale, scale);

  renderer.render(scene, camera);

  requestAnimationFrame(visualize);
}

audioPlayer.addEventListener('pause', () => {
  cancelAnimationFrame(visualize);
});

audioPlayer.addEventListener('ended', () => {
  cancelAnimationFrame(visualize);
});

audioPlayer.addEventListener("play", function() {
  visualize();
});

const animate = () => {
  requestAnimationFrame(animate);
  
};
animate();

window.addEventListener('resize', () => {
  min = Math.min((Math.min(window.innerWidth, window.innerHeight) * 0.7), 400);

  camera.aspect = 1;
  camera.updateProjectionMatrix();

  renderer.setSize(min, min);
});
