import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/config";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Configurações</h1>
        
        <Tabs defaultValue="general" className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Aparência</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-base">Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Alternar entre temas claro e escuro
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Informações da Conta</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{auth.currentUser?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Conta Criada</p>
                  <p className="font-medium">
                    {auth.currentUser?.metadata.creationTime ? 
                      new Date(auth.currentUser.metadata.creationTime).toLocaleDateString() : 
                      'N/A'}
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      if (window.confirm("Tem certeza que deseja sair?")) {
                        auth.signOut().then(() => navigate("/"));
                      }
                    }}
                  >
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Configurações de Notificações</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="due-date" className="text-base">Lembretes de Prazo</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando as tarefas estiverem próximas do prazo
                    </p>
                  </div>
                  <Switch
                    id="due-date"
                    defaultChecked
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="task-complete" className="text-base">Conclusão de Tarefas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando uma tarefa for marcada como concluída
                    </p>
                  </div>
                  <Switch
                    id="task-complete"
                    defaultChecked={false}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-summary" className="text-base">Resumo Semanal</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba um relatório semanal da sua produtividade
                    </p>
                  </div>
                  <Switch
                    id="weekly-summary"
                    defaultChecked
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
