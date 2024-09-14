interface SpeechRecognitionResult {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {}

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: Event) => void;
  }

  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
