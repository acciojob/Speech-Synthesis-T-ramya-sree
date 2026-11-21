const textArea = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");
const rateSlider = document.getElementById("rate");
const pitchSlider = document.getElementById("pitch");
const speakBtn = document.getElementById("speak");
const stopBtn = document.getElementById("stop");

let voices = [];
let utterance = null;
let restartTimer = null;

function populateVoices() {
    voices = window.speechSynthesis.getVoices();
    const previousIndex = voiceSelect.value;

    voiceSelect.innerHTML = "";

    if (!voices || voices.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No voices available";
        option.disabled = true;
        option.selected = true;
        voiceSelect.appendChild(option);
        voiceSelect.disabled = true;
        speakBtn.disabled = true;
        return;
    }

    voiceSelect.disabled = false;
    speakBtn.disabled = false;

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    if (previousIndex !== "" && voices[Number(previousIndex)]) {
        voiceSelect.value = previousIndex;
    }
}

function cleanupUtterance() {
    if (utterance) {
        utterance.onstart = null;
        utterance.onend = null;
        utterance.onerror = null;
        utterance.onboundary = null;
        utterance = null;
    }
}

function stopSpeech() {
    if (restartTimer) {
        clearTimeout(restartTimer);
        restartTimer = null;
    }

    cleanupUtterance();

    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();
}

function startSpeech() {
    const text = textArea.value.trim();
    if (!text || voices.length === 0) return;

    stopSpeech();

    restartTimer = setTimeout(() => {
        restartTimer = null;

        const currentText = textArea.value.trim();
        if (!currentText || voices.length === 0) return;

        const nextUtterance = new SpeechSynthesisUtterance(currentText);
        const selectedVoice = voices[Number(voiceSelect.value)] || voices[0];

        if (selectedVoice) {
            nextUtterance.voice = selectedVoice;
        }

        nextUtterance.rate = parseFloat(rateSlider.value) || 1;
        nextUtterance.pitch = parseFloat(pitchSlider.value) || 1;

        nextUtterance.onend = () => {
            if (utterance === nextUtterance) {
                utterance = null;
            }
        };

        nextUtterance.onerror = () => {
            if (utterance === nextUtterance) {
                utterance = null;
            }
        };

        utterance = nextUtterance;
        window.speechSynthesis.speak(nextUtterance);
    }, 50);
}

populateVoices();

if ("onvoiceschanged" in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
}

speakBtn.addEventListener("click", startSpeech);

stopBtn.addEventListener("click", stopSpeech);

function handleSettingChange() {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending || utterance) {
        startSpeech();
    }
}

voiceSelect.addEventListener("change", handleSettingChange);
rateSlider.addEventListener("change", handleSettingChange);
pitchSlider.addEventListener("change", handleSettingChange);