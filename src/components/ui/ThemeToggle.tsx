
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch by rendering only client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full transition-colors duration-500"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {theme === "light" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-100 transition-all duration-300" />
        )}
      </div>
    </Button>
  );
}
