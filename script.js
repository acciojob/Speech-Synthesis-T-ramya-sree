const text = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");
const speakBtn = document.getElementById("speak");
const stopBtn = document.getElementById("stop");
const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");

let voices = [];
let utterance = null;

function loadVoices() {
  voices = window.speechSynthesis.getVoices();

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
   