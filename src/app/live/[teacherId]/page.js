"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { contentService } from "@/services/content.service";
import { Loader2, MonitorPlay, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LivePublicPage() {
  const { teacherId } = useParams();
  const [activeContentList, setActiveContentList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveContent = async () => {
      try {
        const data = await contentService.getTeacherContentById(teacherId);
        const now = new Date().getTime();
        
        // Filter approved and currently active content
        const active = data.filter(item => {
          if (item.status !== 'APPROVED') return false;
          const start = new Date(item.startTime).getTime();
          const end = new Date(item.endTime).getTime();
          return now >= start && now <= end;
        });
        
        setActiveContentList(active);
      } catch (error) {
        console.error("Failed to load content", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveContent();
    
    // Auto-refresh every 30 seconds to check for newly active/expired content
    const refreshInterval = setInterval(fetchActiveContent, 30000);
    return () => clearInterval(refreshInterval);
  }, [teacherId]);

  useEffect(() => {
    if (activeContentList.length <= 1) return;

    const currentContent = activeContentList[currentIndex];
    // rotationDuration is in seconds, convert to ms
    const durationMs = (currentContent?.rotationDuration || 10) * 1000;
    
    if (durationMs <= 0) return;

    const rotationInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeContentList.length);
    }, durationMs);

    return () => clearInterval(rotationInterval);
  }, [activeContentList, currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-400 mb-4" />
        <p className="text-xl font-medium">Loading Broadcast...</p>
      </div>
    );
  }

  if (activeContentList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 p-4">
        <MonitorPlay className="h-20 w-20 text-slate-700 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">No content available</h1>
        <p className="text-lg text-slate-400 text-center max-w-md">
          There is currently no active broadcast. Please wait or check back later.
        </p>
      </div>
    );
  }

  const currentContent = activeContentList[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <h1 className="font-bold text-xl tracking-tight">EduCast Live</h1>
        </div>
        <div className="text-slate-400 text-sm font-medium">
          {activeContentList.length > 1 && (
            <span>Showing {currentIndex + 1} of {activeContentList.length}</span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600 blur-[120px]"></div>
            <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col animate-in fade-in zoom-in duration-500">
          <Card className="bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold mb-6 border border-indigo-500/30">
                {currentContent.subject}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                {currentContent.title}
              </h2>
              {currentContent.description && (
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  {currentContent.description}
                </p>
              )}
            </div>
            
            {/* Visual placeholder for file/media preview */}
            <div className="bg-slate-950/50 border-t border-slate-800 p-12 flex flex-col items-center justify-center min-h-[300px]">
              <div className="p-6 rounded-full bg-slate-800/50 mb-4">
                <MonitorPlay className="w-16 h-16 text-indigo-400" />
              </div>
              <p className="text-slate-400 font-medium">
                {currentContent.file?.name ? `Displaying: ${currentContent.file.name}` : "Visual Presentation Mode"}
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      {/* Footer Progress Bar (if rotating) */}
      {activeContentList.length > 1 && currentContent.rotationDuration > 0 && (
        <div className="h-1 bg-slate-800 w-full">
          <div 
            className="h-full bg-indigo-500" 
            style={{ 
              animation: `progress ${currentContent.rotationDuration}s linear infinite`,
            }}
          ></div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
