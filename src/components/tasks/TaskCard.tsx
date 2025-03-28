import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, CheckCircle2, Circle, Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { Task, useTasks } from "@/context/TaskContext";
import SubtaskItem from "./SubtaskItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskComplete, deleteTask } = useTasks();
  const [expanded, setExpanded] = useState(false);
  
  const priorityColors = {
    high: "text-red-500 dark:text-red-400",
    medium: "text-yellow-500 dark:text-yellow-400",
    low: "text-green-500 dark:text-green-400",
  };
  
  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      deleteTask(task.id);
    }
  };
  
  const handleToggleComplete = () => {
    toggleTaskComplete(task.id);
  };
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  
  return (
    <div
      className={cn(
        "bg-card rounded-lg shadow-sm border p-4 transition-all duration-300 animate-scale-in",
        {
          "opacity-60": task.completed,
        }
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Button
            variant="ghost" 
            size="icon"
            className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleToggleComplete}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex-1">
            <h3
              className={cn("font-medium text-lg", {
                "line-through text-muted-foreground": task.completed,
              })}
            >
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-muted-foreground text-sm mt-1">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {task.category && (
                <Badge variant="outline" className="font-normal">
                  {task.category}
                </Badge>
              )}
              
              {task.priority && (
                <span className={cn("text-xs", priorityColors[task.priority])}>
                  Prioridade {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                </span>
              )}
              
              {task.dueDate && (
                <span className="text-xs text-muted-foreground">
                  Prazo {format(task.dueDate, "d MMM, yyyy")}
                </span>
              )}
            </div>
            
            {totalSubtasks > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Progresso: {completedSubtasks}/{totalSubtasks}
                  </span>
                  <span className="text-xs font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {task.subtasks.length > 0 && (
        <>
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs w-full justify-between"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Ocultar" : "Mostrar"} Subtarefas ({completedSubtasks}/{totalSubtasks})
              {expanded ? (
                <ChevronUp className="h-3 w-3 ml-2" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-2" />
              )}
            </Button>
          </div>
          
          {expanded && (
            <div className="mt-2 space-y-2 pl-8 border-l">
              {task.subtasks.map((subtask) => (
                <SubtaskItem
                  key={subtask.id}
                  taskId={task.id}
                  subtask={subtask}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
