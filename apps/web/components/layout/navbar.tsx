"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import Button from "@/components/ui/button";
import {
  BookOpen,
  LayoutDashboard,
  Trophy,
  LogOut,
  User,
  Award,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          Schomora
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-secondary hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-secondary hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <BookOpen size={16} />
            Courses
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-secondary hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Trophy size={16} />
            Leaderboard
          </Link>
          <Link
            href="/certificates"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-secondary hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Award size={16} />
            Certificates
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
            <User size={14} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {user?.name || "Student"}
            </span>
            <span className="text-xs text-secondary">
              {user?.xp_total || 0} XP
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </nav>
  );
}
