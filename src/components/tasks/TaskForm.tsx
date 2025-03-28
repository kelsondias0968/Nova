import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriorityLevel, Task, useTasks } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
  dueDate: z.date().optional().nullable(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  taskToEdit?: Task;
  onClose: () => void;
}

export default function TaskForm({ taskToEdit, onClose }: TaskFormProps) {
  const { addTask, updateTask, addSubtask } = useTasks();
  const [tags, setTags] = useState<string[]>(taskToEdit?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [subtasks, setSubtasks] = useState<
    Array<{
      title: string;
      priority?: PriorityLevel;
      dueDate?: Date | null;
    }>
  >([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtaskPriority, setSubtaskPriority] = useState<PriorityLevel>("medium");
  const [subtaskDueDate, setSubtaskDueDate] = useState<Date | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      priority: taskToEdit?.priority || "medium",
      dueDate: taskToEdit?.dueDate || null,
      category: taskToEdit?.category || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, {
        ...values,
        tags,
      });

      // Add any new subtasks
      for (const subtask of subtasks) {
        await addSubtask(taskToEdit.id, {
          title: subtask.title,
          completed: false,
          priority: subtask.priority,
          dueDate: subtask.dueDate,
        });
      }
    } else {
      await addTask({
        title: values.title,
        description: values.description,
        completed: false,
        priority: values.priority,
        dueDate: values.dueDate,
        category: values.category ? values.category : undefined,
        tags,
        subtasks: subtasks.map((st, index) => ({
          id: `new-${index}`,
          title: st.title,
          completed: false,
          priority: st.priority,
          dueDate: st.dueDate,
        })),
      });
    }

    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addSubtaskItem = () => {
    if (subtaskInput.trim()) {
      setSubtasks([
        ...subtasks,
        {
          title: subtaskInput.trim(),
          priority: subtaskPriority,
          dueDate: subtaskDueDate,
        },
      ]);
      setSubtaskInput("");
      setSubtaskPriority("medium");
      setSubtaskDueDate(null);
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-1 subtle-scroll">
      <h2 className="text-xl font-semibold mb-4">
        {taskToEdit ? "Editar Tarefa" : "Adicionar Nova Tarefa"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Título da tarefa"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Adicione detalhes sobre sua tarefa"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Entrega (opcional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Trabalho, Pessoal, Estudo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Tags (opcional)</FormLabel>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-3 w-3 ml-1 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex mt-2">
              <Input
                placeholder="Adicionar uma tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                className="ml-2"
              >
                Adicionar
              </Button>
            </div>
          </div>

          <div className="pt-2 border-t">
            <FormLabel>Subtarefas</FormLabel>
            <div className="space-y-3 mt-2">
              {subtasks.map((subtask, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/40 rounded-md p-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm">{subtask.title}</span>
                    <div className="flex items-center gap-3 mt-1">
                      {subtask.priority && (
                        <span
                          className={cn("text-xs", {
                            "text-red-500": subtask.priority === "high",
                            "text-yellow-500": subtask.priority === "medium",
                            "text-green-500": subtask.priority === "low",
                          })}
                        >
                          Prioridade {subtask.priority === "high" ? "Alta" : subtask.priority === "medium" ? "Média" : "Baixa"}
                        </span>
                      )}
                      {subtask.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Prazo {format(subtask.dueDate, "d MMM")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubtask(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="space-y-2">
                <Input
                  placeholder="Adicionar uma subtarefa"
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubtaskItem();
                    }
                  }}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={subtaskPriority}
                    onValueChange={(value: PriorityLevel) =>
                      setSubtaskPriority(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !subtaskDueDate && "text-muted-foreground"
                        )}
                      >
                        {subtaskDueDate ? (
                          format(subtaskDueDate, "PPP")
                        ) : (
                          <span>Data de entrega</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={subtaskDueDate || undefined}
                        onSelect={setSubtaskDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubtaskItem}
                  className="w-full"
                  disabled={!subtaskInput.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Subtarefa
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {taskToEdit ? "Atualizar" : "Criar"} Tarefa
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
