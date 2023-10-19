const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext('2d');

const audioInput = document.getElementById("audioInput");
const audioPlayer = document.getElementById("audioPlayer");
let selectedFile = '';
let audioContext = null;
let analyser = null;
let source = null;

const colorPicker = document.getElementById('colorPicker');
let visualizerColor = colorPicker.value;
colorPicker.addEventListener('input', () => {
  visualizerColor = colorPicker.value;
});

audioInput.addEventListener("change", function () {

  selectedFile = audioInput.files[0];

  if (selectedFile) {
    if (source) {
      source.disconnect(); 
    }
    const objectURL = URL.createObjectURL(selectedFile);
    audioPlayer.src = objectURL;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

  const barWidth = (canvas.width / bufferLength) * 10;
  let x = 0;

  dataArray.forEach(value => {
    const barHeight = value;

    ctx.fillStyle = visualizerColor; 
    ctx.fillRect(x, canvas.height - barHeight / 1.5, barWidth, barHeight / 1.5);

    x += barWidth + 0.1;
  });

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