const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext('2d');

const audioInput = document.getElementById("audioInput");
const audioPlayer = document.getElementById("audioPlayer");
const linearGradientCheckbox = document.getElementById('linearGradientCheckbox');
const radialGradientCheckbox = document.getElementById('radialGradientCheckbox');
const radioButtons = document.getElementsByName('options');
let radioButton = 'Standard';
let selectedFile = '';
let audioContext = null;
let analyser = null;
let source = null;

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

linearGradientCheckbox.addEventListener("change", function () {
  if (linearGradientCheckbox.checked) {
    radialGradientCheckbox.checked = false;
    colorPicker2.style.visibility = "visible";
    colorPicker3.style.visibility = "visible";
  } else {
    colorPicker2.style.visibility = "hidden";
    colorPicker3.style.visibility = "hidden";
  }
});

radialGradientCheckbox.addEventListener("change", function () {
  if (radialGradientCheckbox.checked) {
    linearGradientCheckbox.checked = false;
    colorPicker2.style.visibility = "visible";
    colorPicker3.style.visibility = "visible";
  } else {
    colorPicker2.style.visibility = "hidden";
    colorPicker3.style.visibility = "hidden";
  }
});

radioButtons.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      radioButton = radio.value;
    }
    if (radioButton == '3d') {
      window.location.href = "./3d/index.html";
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
  } else {
    alert("Please select an audio file.");
  }
});

function visualize() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gradients
  if (linearGradientCheckbox.checked) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, visualizerColor3);
    gradient.addColorStop(0.5, visualizerColor2);
    gradient.addColorStop(1, visualizerColor);
    ctx.fillStyle = gradient;
  } else if (radialGradientCheckbox.checked) {
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height/15, canvas.width/2, canvas.height/2, canvas.height*1.2);
    gradient.addColorStop(0, visualizerColor);
    gradient.addColorStop(0.5, visualizerColor2);
    gradient.addColorStop(1, visualizerColor3);
    ctx.fillStyle = gradient;
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI * 2);
  } else {
    ctx.fillStyle = visualizerColor;
  }

  // standard
  if (radioButton == 'Standard') {
    const barWidth = (canvas.width / bufferLength) * 10;
    let x = 0;

    dataArray.forEach(value => {
      const barHeight = value / 2;
      ctx.fillRect(x, (canvas.height - barHeight) / 2 , barWidth, barHeight);

      x += barWidth + 1;
    })
  };
  

  // bars
  if (radioButton == 'Bars') {
    const barWidth = (canvas.width / bufferLength) * 10;
    let x = 0;

    dataArray.forEach(value => {
      const barHeight = value / 2;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    })
  };

  // circles
  if (radioButton == 'Circles') {

    dataArray.forEach(value => {
      const circleRadius = (value / 255) * 5;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
      ctx.fill();
    })
  };
  
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
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});
