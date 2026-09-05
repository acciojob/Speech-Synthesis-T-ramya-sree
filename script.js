const text = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");
const speakBtn = document.getElementById("speak");
const stopBtn = document.getElementById("stop");
const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");

let voices = [];
let utterance;

function loadVoices() {
  voices = speechSynthesis.getVoices();

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

loadVoices();

speechSynthesis.onvoiceschanged = loadVoices;

function speakText() {
  const message = text.value.trim();

  if (!message) return;

  speechSynthesis.cancel();

  utterance = new SpeechSynthesisUtterance(message);

  if (voices.length > 0) {
    utterance.voice = voices[voiceSelect.value];
  }

  utterance.rate = parseFloat(rate.value);
  utterance.pitch = parseFloat(pitch.value);

  speechSynthesis.speak(utterance);
}

speakBtn.addEventListener("click", speakText);

stopBtn.addEventListener("click", () => {
  speechSynthesis.cancel();
});

voiceSelect.addEventListener("change", () => {
  if (speechSynthesis.speaking) {
    speakText();
  }
});

rate.addEventListener("input", () => {
  if (speechSynthesis.speaking) {
    speakText();
  }
});

pitch.addEventListener("input", () => {
  if (speechSynthesis.speaking) {
    speakText();
  }
});