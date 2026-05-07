"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, FileUp, ListVideo, MonitorPlay, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const teacherLinks = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/upload", label: "Upload Content", icon: FileUp },
    { href: "/teacher/my-content", label: "My Content", icon: ListVideo },
  ];

  const principalLinks = [
    { href: "/principal/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/principal/approvals", label: "Approvals", icon: ClipboardCheck },
    { href: "/principal/all-content", label: "All Content", icon: ListVideo },
  ];

  const links = user.role === "TEACHER" ? teacherLinks : principalLinks;

  return (
    <div 
      className={cn(
        "w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h1 className="font-bold text-xl text-slate-800 tracking-tight">EduCast</h1>
      </div>
      
      <div className="px-4 py-6 flex-1 flex flex-col gap-2">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </p>
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen && setIsOpen(false)}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                {link.label}
              </div>
            </Link>
          );
        })}
        {user.role === "TEACHER" && (
           <Link href={`/live/${user.id}`} target="_blank" onClick={() => setIsOpen && setIsOpen(false)}>
             <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors mt-2">
               <MonitorPlay className="w-5 h-5 text-slate-400" />
               Public Live Page
             </div>
           </Link>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-2">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
        </div>
        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
