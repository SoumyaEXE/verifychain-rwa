"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { courses } from "@/lib/courses-data";
import { X, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, lessonId } = params;

  // Find data
  const course = courses.find((c) => c.id === courseId);
  const lesson = course?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === lessonId);

  // Demo: Use 10 seconds for completion instead of full duration for better UX testing
  const [timeLeft, setTimeLeft] = useState(10); 
  const [isCompleted, setIsCompleted] = useState(false);

  // Check Local Storage for completion status
  useEffect(() => {
    if (!lesson) return;
    const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
    if (completed.includes(lesson.id)) {
        // Use timeout to avoid synchronous setState in effect
        const timeoutId = setTimeout(() => {
          setIsCompleted(true);
          setTimeLeft(0);
        }, 0);
        return () => clearTimeout(timeoutId);
    }
  }, [lesson]);

  // Handle completion
  useEffect(() => {
    if (isCompleted && lesson) {
        const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
        if (!completed.includes(lesson.id)) {
            completed.push(lesson.id);
            localStorage.setItem("completedLessons", JSON.stringify(completed));
            
            // Add Aura points
            const currentAura = parseInt(localStorage.getItem("userAura") || "0");
            localStorage.setItem("userAura", (currentAura + lesson.aura).toString());
            
            // Trigger storage event for other components to update
            window.dispatchEvent(new Event("storage"));
        }
    }
  }, [isCompleted, lesson]);

  useEffect(() => {
    if (!lesson) return;
    
    // Timer logic
    if (timeLeft > 0 && !isCompleted) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft, isCompleted, lesson]);

  if (!lesson || !course) {
    return (
      <div className="min-h-screen bg-[#0f1014] text-white flex items-center justify-center">
        <p>Lesson not found.</p>
        <button onClick={() => router.back()} className="ml-4 text-cyan-400">Go Back</button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0f1014] text-white flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-gray-800 p-4 flex items-center justify-between bg-[#1a1b26] relative z-20 shadow-md">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 truncate max-w-md">
            {lesson.title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
            {!isCompleted ? (
              <div className="flex items-center text-orange-400 gap-2 bg-orange-400/10 px-3 py-1 rounded-full text-sm font-mono border border-orange-400/20">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>Time remaining: {formatTime(timeLeft)}</span>
              </div>
            ) : (
                <div className="flex items-center text-green-400 gap-2 bg-green-400/10 px-3 py-1 rounded-full text-sm font-bold border border-green-400/20">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed!</span>
                </div>
            )}
           <Link 
            href={`/courses/${courseId}`}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 relative">
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="prose prose-invert prose-lg max-w-none"
            >
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                
                {/* Completion Status Area */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    {isCompleted ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex items-center gap-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div>
                                <h4 className="text-xl font-bold text-green-400">Lesson Completed!</h4>
                                <p className="text-green-300/60">You&apos;ve earned {lesson.aura} Aura points.</p>
                            </div>
                        </div>
                    ) : (
                          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 flex items-center gap-4 text-gray-400">
                            <Clock className="w-6 h-6" />
                            <p>Read through the material to complete this lesson.</p>
                        </div>
                    )}
                </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
