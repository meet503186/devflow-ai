import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-[#0F172A] border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-white">DevFlow AI</span>
          <span className="text-slate-600 text-sm select-none">|</span>
          <span className="text-slate-400 text-xs">AI-Powered Jira Ticket Generator</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle className="text-slate-300 hover:text-white hover:bg-slate-700/60" />
      </div>
    </header>
  );
}
