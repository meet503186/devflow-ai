import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-card border-b border-border">
      <span className="text-sm font-semibold">DevFlow AI</span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
