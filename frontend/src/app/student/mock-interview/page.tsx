"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Webcam from "react-webcam";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic, MicOff, Video, Play, Loader2, ArrowLeft,
  Volume2, CheckCircle2, AlertCircle,
} from "lucide-react";

const FIRST_QUESTION =
  "Tell me about a challenging project you've built and how you handled technical complexity.";

export default function MockInterviewPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [question, setQuestion] = useState(FIRST_QUESTION);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("placement_iq_token")) {
      router.push("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const speakQuestion = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startInterview = async () => {
    try {
      const token = localStorage.getItem("placement_iq_token");
      const res = await fetch("http://localhost:8000/v1/interview/start", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Backend unreachable");
      const data = await res.json();
      setQuestion(data.question);
      speakQuestion(data.question);
    } catch {
      // Fallback to local question if backend is down
      speakQuestion(FIRST_QUESTION);
    }
    setSessionStarted(true);
    setFeedback(null);
    setRoundNumber(1);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "video/webm" });
        await analyzeAudio(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setFeedback(null);
    } catch {
      alert("Microphone access is required. Please allow camera/mic and try again.");
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setFeedback(data);
      setIsProcessing(false);

      if (data.next_question) {
        setQuestion(data.next_question);
        setRoundNumber((r) => r + 1);
        speakQuestion(data.next_question);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setIsProcessing(false);
      alert("Analysis failed. Please ensure the backend is running with a valid GROQ_API_KEY.");
    }
  };

  const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{score}/100</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${score > 70 ? "bg-green-500" : score > 50 ? "bg-amber-500" : "bg-red-500"}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex h-14 items-center border-b bg-white dark:bg-slate-900 px-6 gap-4 shrink-0">
        <Link
          href="/student"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portal
        </Link>
        <div className="flex-1" />
        {sessionStarted && (
          <Badge variant="outline" className="gap-1.5 text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Round {roundNumber}
          </Badge>
        )}
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          {/* Page header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">AI Mock Interviewer</h2>
              <p className="text-muted-foreground mt-1">
                Practice technical communication — scored by voice AI and computer vision.
              </p>
            </div>
            <Button
              onClick={startInterview}
              className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
            >
              <Play className="mr-2 h-4 w-4" />
              {sessionStarted ? "New Session" : "Start Session"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Video panel */}
            <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-700">
              <div className="relative bg-black aspect-video flex items-center justify-center">
                <Webcam
                  audio={false}
                  mirrored={true}
                  className="w-full h-full object-cover"
                />
                {isRecording && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    REC
                  </div>
                )}
                {!sessionStarted && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-3">
                    <Video className="h-12 w-12 opacity-50" />
                    <p className="text-sm opacity-70">Click "Start Session" to begin</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Video className="w-4 h-4" />
                  {sessionStarted ? "Camera Active" : "Waiting to Start"}
                </div>
                {sessionStarted && (
                  <>
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        <Mic className="mr-1.5 h-4 w-4" />
                        Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <MicOff className="mr-1.5 h-4 w-4" />
                        Stop & Submit
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* AI Interaction panel */}
            <div className="space-y-4">
              {/* Current question */}
              <Card className={sessionStarted ? "border-indigo-200 dark:border-indigo-800" : ""}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>AI Interviewer Question</span>
                    {sessionStarted && (
                      <button
                        onClick={() => speakQuestion(question)}
                        className="text-muted-foreground hover:text-indigo-600 transition-colors p-1"
                        title="Read question aloud"
                      >
                        <Volume2 className={`h-4 w-4 ${isSpeaking ? "text-indigo-600 animate-pulse" : ""}`} />
                      </button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-base font-medium leading-relaxed ${!sessionStarted ? "text-muted-foreground italic" : ""}`}>
                    {sessionStarted ? `"${question}"` : "Start a session to receive your first question."}
                  </p>
                </CardContent>
              </Card>

              {/* Processing state */}
              {isProcessing && (
                <Card className="border-dashed animate-pulse">
                  <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <div className="text-center">
                      <p className="font-medium text-sm">Analyzing your response...</p>
                      <p className="text-xs mt-1">Groq Whisper is transcribing. Llama 3.1 is scoring.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Feedback card */}
              {feedback && !isProcessing && (
                <Card className="border-green-200 dark:border-green-900 bg-green-50/30 dark:bg-green-900/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Round {roundNumber - 1} Feedback
                    </CardTitle>
                    <CardDescription>Groq Whisper + Llama 3.1 + MediaPipe CV analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Transcript */}
                    <div className="bg-white dark:bg-black/30 p-3 rounded-lg border text-sm italic text-muted-foreground">
                      <strong className="not-italic text-slate-700 dark:text-slate-300">You said: </strong>
                      {feedback.transcript || "No transcript available."}
                    </div>

                    {/* Score bars */}
                    <div className="space-y-3">
                      <ScoreBar label="Body Language" score={feedback.body_language_score ?? 0} color={feedback.body_language_score > 70 ? "text-green-600" : "text-amber-600"} />
                      <ScoreBar label="Confidence" score={feedback.confidence_score ?? 0} color={feedback.confidence_score > 70 ? "text-green-600" : "text-amber-600"} />
                      <ScoreBar label="Clarity" score={feedback.clarity_score ?? 0} color={feedback.clarity_score > 70 ? "text-green-600" : "text-amber-600"} />
                      <ScoreBar label="Tech Accuracy" score={feedback.tech_accuracy_score ?? 0} color={feedback.tech_accuracy_score > 70 ? "text-green-600" : "text-amber-600"} />
                    </div>

                    {/* AI Feedback */}
                    {feedback.feedback && (
                      <div className="pt-1">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground leading-relaxed">{feedback.feedback}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
