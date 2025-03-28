
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [user, setUser] = useState(auth.currentUser);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Desconectado com sucesso");
    } catch (error) {
      console.error("Erro ao sair: ", error);
      toast.error("Falha ao sair");
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" },
  ];

  const getTranslatedNavName = (name: string) => {
    switch(name) {
      case "Dashboard": return "Painel";
      case "Analytics": return "Análises";
      case "Settings": return "Configurações";
      default: return name;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-xl transition-opacity duration-200 hover:opacity-80"
          >
            <span className="bg-primary text-primary-foreground font-black px-2 py-1 rounded">
              Pro
            </span>
            <span>crastinotize</span>
          </Link>

          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {user && navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary/10"
                >
                  {getTranslatedNavName(link.name)}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="text-sm"
                >
                  Sair
                </Button>
                <Link to="/dashboard">
                  <Button className="text-sm">Painel</Button>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" className="text-sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="text-sm">Cadastrar</Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </div>
        </div>
      </header>

      <MobileNav 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Espaço para evitar que o conteúdo fique escondido sob a navbar fixa */}
      <div className="h-16" />
    </>
  );
}
