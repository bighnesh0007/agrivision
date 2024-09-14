import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  onTextChange: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  lang: string // Add lang prop
}

const translations = {
  en: {
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
  },
  es: {
    startRecording: "रिकॉर्डिंग शुरू करें",
    stopRecording: "रिकॉर्डिंग रोकें",
  },
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTextChange, isRecording, setIsRecording, lang }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const t = translations[lang as keyof typeof translations] || translations.en;


  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        onTextChange(transcript);
      };

      recognitionRef.current.onerror = (event: Event) => {
        console.error('Speech recognition error:', event);
        setIsRecording(false);
      };

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    } else {
      console.error('Speech recognition not supported in this browser');
      // Optional: Provide user feedback here
    }
  }, [onTextChange, setIsRecording]);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex justify-center space-x-4 z-20">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          onClick={startRecording}
          disabled={isRecording}
          className={`bg-green-500 hover:bg-green-600 ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Mic className="mr-2" />
          {t.startRecording}
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          onClick={stopRecording}
          disabled={!isRecording}
          className={`bg-red-500 hover:bg-red-600 ${!isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <MicOff className="mr-2" />
          {t.stopRecording}
        </Button>
      </motion.div>
    </div>
  );
};

export default VoiceRecorder;
