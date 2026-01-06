"use client";

export default function VoiceButton() {
  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = (e: any) => {
      alert("You said: " + e.results[0][0].transcript);
    };
  }

  return (
    <button
      onClick={startListening}
      className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl text-xl"
    >
      🎤
    </button>
  );
}
