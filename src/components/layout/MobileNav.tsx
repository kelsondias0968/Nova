
import { User } from "firebase/auth";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavLink {
  name: string;
  href: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  user: User | null;
  onSignOut: () => void;
}

export default function MobileNav({
  isOpen,
  onClose,
  navLinks,
  user,
  onSignOut,
}: MobileNavProps) {
  return (
    <div
      className={`fixed inset-0 bg-background z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-xl"
          onClick={onClose}
        >
          <span className="bg-primary text-primary-foreground font-black px-2 py-1 rounded">
            Pro
          </span>
          <span>crastinotize</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Fechar menu</span>
        </Button>
      </div>

      <nav className="flex flex-col p-4 space-y-4">
        {user && navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className="px-4 py-3 rounded-md text-lg font-medium hover:bg-accent transition-colors"
            onClick={onClose}
          >
            {link.name === "Dashboard" ? "Painel" : 
             link.name === "Analytics" ? "Análises" : 
             link.name === "Settings" ? "Configurações" : link.name}
          </Link>
        ))}

        {user ? (
          <div className="pt-4 border-t flex flex-col space-y-3">
            <Button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              variant="outline"
              className="w-full"
            >
              Sair
            </Button>
            <Link to="/dashboard" onClick={onClose} className="w-full">
              <Button className="w-full">Painel</Button>
            </Link>
          </div>
        ) : (
          <div className="pt-4 border-t flex flex-col space-y-3">
            <Link to="/login" onClick={onClose} className="w-full">
              <Button variant="outline" className="w-full">
                Entrar
              </Button>
            </Link>
            <Link to="/register" onClick={onClose} className="w-full">
              <Button className="w-full">Cadastrar</Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
