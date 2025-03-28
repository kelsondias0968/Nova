import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/config";
import { Task, useTasks } from "@/context/TaskContext";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks, loading } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };
  
  const allCategories = Array.from(
    new Set(tasks.map((task) => task.category).filter(Boolean))
  );
  
  const getFilteredTasks = (isCompleted: boolean = false) => {
    return tasks
      .filter(task => {
        if (task.completed !== isCompleted) return false;
        
        if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        if (categoryFilter && task.category !== categoryFilter) {
          return false;
        }
        
        if (priorityFilter && task.priority !== priorityFilter) {
          return false;
        }
        
        return true;
      });
  };
  
  const filteredActiveTasks = getFilteredTasks(false);
  const filteredCompletedTasks = getFilteredTasks(true);
  
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
    setPriorityFilter(null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto py-6 px-4 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
            <p className="text-muted-foreground mt-1">
              Organize, priorize e divida suas tarefas
            </p>
          </div>
          
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <TaskForm onClose={() => setIsAddTaskOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col xl:flex-row gap-4 mb-6">
          <div className="w-full xl:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
              <div className="relative w-full sm:w-1/2 lg:w-1/3">
                <Input
                  placeholder="Pesquisar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtros</span>
                  {(categoryFilter || priorityFilter) && (
                    <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {
                        (categoryFilter ? 1 : 0) + 
                        (priorityFilter ? 1 : 0)
                      }
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
            
            {filterMenuOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg mb-4 animate-fade-in">
                <div>
                  <label className="text-sm font-medium block mb-2">Categoria</label>
                  <Select
                    value={categoryFilter || ""}
                    onValueChange={(value) => setCategoryFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as categorias</SelectItem>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category!}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Prioridade</label>
                  <Select
                    value={priorityFilter || ""}
                    onValueChange={(value) => setPriorityFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as prioridades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as prioridades</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end sm:col-span-2 md:col-span-1">
                  <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
                    Limpar filtros
                  </Button>
                </div>
              </div>
            )}
            
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="active">
                  Tarefas Ativas ({filteredActiveTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Concluídas ({filteredCompletedTasks.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-0">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex gap-2 mt-2">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredActiveTasks.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">
                      {searchTerm || categoryFilter || priorityFilter
                        ? "Nenhuma tarefa corresponde aos seus filtros"
                        : "Nenhuma tarefa ativa. Crie uma nova tarefa para começar!"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (searchTerm || categoryFilter || priorityFilter) {
                          resetFilters();
                        } else {
                          setIsAddTaskOpen(true);
                        }
                      }}
                      className="mt-4"
                    >
                      {searchTerm || categoryFilter || priorityFilter
                        ? "Limpar filtros"
                        : "Criar sua primeira tarefa"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredActiveTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredCompletedTasks.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">
                      Nenhuma tarefa concluída ainda.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCompletedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full xl:w-1/4 space-y-6 xl:pl-4">
            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Resumo das Tarefas
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Tarefas Ativas</span>
                    <span className="font-medium">{tasks.filter(t => !t.completed).length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${(tasks.filter(t => !t.completed).length / Math.max(tasks.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Concluídas</span>
                    <span className="font-medium">{tasks.filter(t => t.completed).length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Prioridade Alta</span>
                    <span className="font-medium">{tasks.filter(t => t.priority === 'high' && !t.completed).length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${(tasks.filter(t => t.priority === 'high' && !t.completed).length / Math.max(tasks.filter(t => !t.completed).length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t mt-4 pt-4">
                <h4 className="font-medium text-sm mb-3">Categorias</h4>
                <div className="flex flex-wrap gap-2">
                  {allCategories.length > 0 ? (
                    allCategories.map(category => (
                      <Badge
                        key={category}
                        variant={categoryFilter === category ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => setCategoryFilter(category === categoryFilter ? null : category)}
                      >
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma categoria ainda</p>
                  )}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => setIsAddTaskOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Nova Tarefa
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent className="max-w-md">
          {selectedTask && (
            <TaskForm
              taskToEdit={selectedTask}
              onClose={() => setIsEditTaskOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
