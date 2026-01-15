"use client";

import Navbar from "@/components/Navbar";
import { courses } from "@/lib/courses-data";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#0f1014] text-white overflow-hidden relative">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <BookOpen className="w-12 h-12 text-blue-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 font-mono uppercase tracking-widest">
            Explore Learning Paths
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Choose your domain and start your gamified journey to mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#1a1b26] border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all">
                {course.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                {course.description}
              </p>
              
              <div className="mt-auto flex justify-end">
                <Link 
                  href={`/courses/${course.id}`}
                  className="inline-flex items-center gap-2 text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors"
                >
                  Start Path <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
