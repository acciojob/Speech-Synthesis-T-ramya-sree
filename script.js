const textArea = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");
const rateSlider = document.getElementById("rate");
const pitchSlider = document.getElementById("pitch");
const speakBtn = document.getElementById("speak");
const stopBtn = document.getElementById("stop");

let voices = [];
let utterance = null;

function populateVoices() {
    voices = window.speechSynthesis.getVoices();

    voiceSelect.innerHTML = "";

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

populateVoices();

window.speechSynthesis.onvoiceschanged = populateVoices;

speakBtn.addEventListener("click", () => {
    const text = textArea.value.trim();

    if (!text) return;

    window.speechSynthesis.cancel();

    utterance = new SpeechSynthesisUtterance(text);

    if (voices.length > 0) {
        utterance.voice = voices[voiceSelect.value];
    }

    utterance.rate = parseFloat(rateSlider.value);
    utterance.pitch = parseFloat(pitchSlider.value);

    window.speechSynthesis.speak(utterance);
});

stopBtn.addEventListener("click", () => {
    window.speechSynthesis.cancel();
});

voiceSelect.addEventListener("change", () => {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();

        const text = textArea.value.trim();

        if (!text) return;

        utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices[voiceSelect.value];
        utterance.rate = parseFloat(rateSlider.value);
        utterance.pitch = parseFloat(pitchSlider.value);

        window.speechSynthesis.speak(utterance);
    }
});