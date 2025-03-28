
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, CheckCircle, Clock, ListTodo } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Seção Hero */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Pare de Procrastinar.
                </span>
                <br />
                Comece a Realizar.
              </h1>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
              <p className="text-xl text-muted-foreground mt-4 mb-8 max-w-3xl">
                Procrastinotize te ajuda a dividir tarefas complexas em etapas gerenciáveis. 
                Mantenha-se organizado, defina prioridades e alcance seus objetivos.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <Button size="lg" onClick={() => navigate("/register")} className="rounded-full">
                Começar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/login")} className="rounded-full">
                Entrar
              </Button>
            </div>
          </div>
        </section>
        
        {/* Seção de Recursos */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Por que Procrastinotize?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center animate-fade-in hover:shadow-lg transition-shadow" style={{ animationDelay: "100ms" }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dividir Tarefas</h3>
                <p className="text-muted-foreground">
                  Divida tarefas complexas em etapas menores e gerenciáveis para reduzir a sobrecarga.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center animate-fade-in hover:shadow-lg transition-shadow" style={{ animationDelay: "200ms" }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Acompanhe Progresso</h3>
                <p className="text-muted-foreground">
                  Monitore suas taxas de conclusão e celebre o progresso em direção aos seus objetivos.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center animate-fade-in hover:shadow-lg transition-shadow" style={{ animationDelay: "300ms" }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Priorize Efetivamente</h3>
                <p className="text-muted-foreground">
                  Defina prioridades e prazos para se concentrar no que é mais importante.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Seção CTA */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para superar a procrastinação?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a milhares de usuários que conquistaram suas listas de tarefas com o Procrastinotize.
            </p>
            <Button size="lg" onClick={() => navigate("/register")} className="rounded-full">
              Criar Conta Gratuita
            </Button>
          </div>
        </section>
      </main>
      
      {/* Rodapé */}
      <footer className="bg-muted/30 py-12 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 font-bold text-xl">
            <span className="bg-primary text-primary-foreground font-black px-2 py-1 rounded">
              Pro
            </span>
            <span>crastinotize</span>
          </div>
          
          <div className="mt-6 md:mt-0 text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Procrastinotize. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
