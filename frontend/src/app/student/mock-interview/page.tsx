"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, Play, Loader2 } from "lucide-react";

export default function MockInterviewPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("Tell me about a challenging distributed systems project you've worked on.");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  
  useEffect(() => {
    if (!localStorage.getItem("placement_iq_token")) {
      router.push("/login");
    }
  }, [router]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Function to make the browser speak the question
  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startInterview = async () => {
    try {
      const token = localStorage.getItem("placement_iq_token");
      const res = await fetch("http://localhost:8000/v1/interview/start", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setQuestion(data.question);
      speakQuestion(data.question);
    } catch (err) {
      console.error(err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'video/webm' });
        await analyzeAudio(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setFeedback(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for the mock interview.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    try {
      const token = localStorage.getItem("placement_iq_token");
      
      const formData = new FormData();
      formData.append("audio", audioBlob, "answer.webm");
      formData.append("question", question);

      const res = await fetch("http://localhost:8000/v1/interview/analyze", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`
          // Do NOT set Content-Type header manually when using FormData, the browser sets it with boundary
        },
        body: formData
      });

      const data = await res.json();
      setFeedback(data);
      setIsProcessing(false);
      
      if (data.next_question) {
        setQuestion(data.next_question);
        speakQuestion(data.next_question);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Mock Interviewer</h2>
          <p className="text-muted-foreground mt-1">
            Practice your technical communication. The AI will listen, transcribe, and grade your confidence and clarity.
          </p>
        </div>
        <Button onClick={startInterview}>
          <Play className="mr-2 h-4 w-4" /> Start Session
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Video Feed Column */}
        <Card className="overflow-hidden border-2 border-primary/20">
          <div className="relative bg-black aspect-video flex items-center justify-center">
            <Webcam 
              audio={false} 
              mirrored={true}
              className="w-full h-full object-cover"
            />
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                Recording Answer
              </div>
            )}
          </div>
          <div className="p-4 bg-muted/30 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Video className="w-4 h-4" /> Camera Active
            </div>
            
            {!isRecording ? (
              <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700 text-white">
                <Mic className="mr-2 h-4 w-4" /> Answer Question
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <MicOff className="mr-2 h-4 w-4" /> Stop & Submit
              </Button>
            )}
          </div>
        </Card>

        {/* AI Interaction Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                AI Interviewer Question
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg font-medium leading-relaxed">
                "{question}"
              </p>
            </CardContent>
          </Card>

          {isProcessing && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>AI is transcribing and analyzing your voice...</p>
              </CardContent>
            </Card>
          )}

          {feedback && !isProcessing && (
            <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Instant Feedback</CardTitle>
                <CardDescription>Based on Groq Whisper Speech-to-Text & Llama 3.1 analysis.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white dark:bg-black/40 p-3 rounded border text-sm italic">
                  <strong>You said:</strong> "{feedback.transcript}"
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center p-3 bg-white dark:bg-black/40 rounded border">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 text-center">Body Language</span>
                    <span className={`text-2xl font-bold ${feedback.body_language_score > 70 ? 'text-green-600' : 'text-amber-600'}`}>
                      {feedback.body_language_score}/100
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white dark:bg-black/40 rounded border">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Confidence</span>
                    <span className={`text-2xl font-bold ${feedback.confidence_score > 70 ? 'text-green-600' : 'text-amber-600'}`}>
                      {feedback.confidence_score}/100
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white dark:bg-black/40 rounded border">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Clarity</span>
                    <span className={`text-2xl font-bold ${feedback.clarity_score > 70 ? 'text-green-600' : 'text-amber-600'}`}>
                      {feedback.clarity_score}/100
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white dark:bg-black/40 rounded border">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 text-center">Tech Accuracy</span>
                    <span className={`text-2xl font-bold ${feedback.tech_accuracy_score > 70 ? 'text-green-600' : 'text-amber-600'}`}>
                      {feedback.tech_accuracy_score}/100
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-medium">Constructive Criticism:</p>
                  <p className="text-sm text-muted-foreground mt-1">{feedback.feedback}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
