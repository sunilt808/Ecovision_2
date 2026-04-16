// Speech Recognition and Synthesis Service

export const speechService = {
  // Check if browser supports speech recognition
  isSupported: () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SpeechRecognition;
  },

  // Initialize speech recognition
  initializeRecognition: (onResult, onError) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError("Speech Recognition not supported");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.language = "en-US";

    recognition.onstart = () => {
      // Listening has started
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      onError(event.error);
    };

    recognition.onend = () => {
      // Recognition ended
    };

    return recognition;
  },

  // Start listening
  startListening: (recognition) => {
    if (recognition) {
      recognition.start();
    }
  },

  // Stop listening
  stopListening: (recognition) => {
    if (recognition) {
      recognition.stop();
    }
  },

  // Text-to-speech
  speak: (text, rate = 0.9, pitch = 1.0) => {
    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
    if (!SpeechSynthesisUtterance) {
      console.error("Text-to-Speech not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;
    utterance.lang = "en-US";

    window.speechSynthesis.speak(utterance);
  },

  // Stop speech synthesis
  stopSpeech: () => {
    window.speechSynthesis.cancel();
  },
};
