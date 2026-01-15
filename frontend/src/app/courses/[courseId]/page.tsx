"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { courses } from "@/lib/courses-data";
import { Zap, Book } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function CourseDetailPage() {
  const params = useParams();
  const { courseId } = params;
  
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0f1014] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link href="/courses" className="text-cyan-400 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1014] text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 font-mono tracking-wider">
            {course.title}
          </h1>
          <p className="text-gray-400 max-w-3xl text-lg mb-8">
            {course.description}
          </p>
          
          <div className="flex gap-8 border-b border-gray-800 w-full justify-center">
            <button className="pb-4 px-4 text-cyan-400 border-b-2 border-cyan-400 font-medium">
              Lessons ({course.modules.reduce((acc, m) => acc + m.lessons.length, 0)})
            </button>
            <button className="pb-4 px-4 text-gray-500 hover:text-gray-300 font-medium transition-colors">
              Materials
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-12">
          {course.modules.length === 0 && (
             <div className="text-center text-gray-500 py-10">
                No modules available for this course yet.
             </div>
          )}
          
          {course.modules.map((module) => (
            <div key={module.id} className="space-y-6">
              <h2 className="text-2xl font-bold text-indigo-400 pl-2 border-l-4 border-indigo-500">
                {module.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {module.lessons.map((lesson, idx) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#1a1b26] border border-gray-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-cyan-100 mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-800">
                      <div className="flex items-center text-cyan-400 text-sm font-bold">
                        <Zap className="w-4 h-4 mr-1" />
                        {lesson.aura} Aura
                      </div>
                      <Link 
                        href={`/courses/${course.id}/lesson/${lesson.id}`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Book className="w-4 h-4 mr-2" />
                        Review
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
