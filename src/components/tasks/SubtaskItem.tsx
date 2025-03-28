
import { Subtask, useTasks } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle2, Circle, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubtaskItemProps {
  taskId: string;
  subtask: Subtask;
}

export default function SubtaskItem({ taskId, subtask }: SubtaskItemProps) {
  const { toggleSubtaskComplete, deleteSubtask } = useTasks();
  
  const priorityColors = {
    high: "text-red-500 dark:text-red-400",
    medium: "text-yellow-500 dark:text-yellow-400",
    low: "text-green-500 dark:text-green-400",
  };

  const priorityNames = {
    high: "Alta",
    medium: "Média",
    low: "Baixa"
  };
  
  const handleToggleComplete = () => {
    toggleSubtaskComplete(taskId, subtask.id);
  };
  
  const handleDelete = () => {
    deleteSubtask(taskId, subtask.id);
  };
  
  return (
    <div
      className={cn(
        "flex items-start justify-between rounded-md py-2 px-1 -mx-1 animate-fade-in",
        {
          "opacity-60": subtask.completed,
        }
      )}
    >
      <div className="flex items-start gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleToggleComplete}
        >
          {subtask.completed ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </Button>
        
        <div>
          <p
            className={cn("text-sm", {
              "line-through text-muted-foreground": subtask.completed,
            })}
          >
            {subtask.title}
          </p>
          
          <div className="flex items-center gap-2 mt-0.5">
            {subtask.priority && (
              <span className={cn("text-xs", priorityColors[subtask.priority])}>
                {priorityNames[subtask.priority]}
              </span>
            )}
            
            {subtask.dueDate && (
              <span className="text-xs text-muted-foreground">
                Prazo {format(subtask.dueDate, "d MMM")}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
