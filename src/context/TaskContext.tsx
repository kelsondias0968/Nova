import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority?: PriorityLevel;
  dueDate?: Date | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: PriorityLevel;
  dueDate?: Date | null;
  category?: string;
  tags?: string[];
  subtasks: Subtask[];
  createdAt: Date;
  userId: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addSubtask: (taskId: string, subtask: Omit<Subtask, 'id'>) => Promise<void>;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user?.uid || null);
    });
    
    return unsubscribe;
  }, []);

  // Fetch tasks when user changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) {
        setTasks([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const q = query(collection(db, 'tasks'), where('userId', '==', currentUser));
        const querySnapshot = await getDocs(q);
        
        const fetchedTasks = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            dueDate: data.dueDate?.toDate() || null,
            subtasks: data.subtasks || [],
          } as Task;
        });
        
        // Sort by due date and priority
        fetchedTasks.sort((a, b) => {
          // First by completion status
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          
          // Then by due date if available
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
          } else if (a.dueDate) {
            return -1;
          } else if (b.dueDate) {
            return 1;
          }
          
          // Then by priority
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [currentUser]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para adicionar tarefas');
      return;
    }
    
    try {
      const newTask = {
        ...taskData,
        createdAt: new Date(),
        userId: currentUser,
      };
      
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      
      setTasks(prev => [
        ...prev, 
        { ...newTask, id: docRef.id } as Task
      ]);
      
      toast.success('Tarefa adicionada com sucesso');
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Falha ao adicionar tarefa');
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, updates);
      
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
      
      toast.success('Tarefa atualizada');
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Falha ao atualizar tarefa');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast.success('Tarefa excluída');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Falha ao excluir tarefa');
    }
  };

  const addSubtask = async (taskId: string, subtaskData: Omit<Subtask, 'id'>) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      const subtaskId = Math.random().toString(36).substr(2, 9);
      const newSubtask: Subtask = { ...subtaskData, id: subtaskId };
      
      const updatedSubtasks = [...task.subtasks, newSubtask];
      
      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: updatedSubtasks
      });
      
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, subtasks: updatedSubtasks } 
            : task
        )
      );
      
      toast.success('Subtarefa excluída');
    } catch (err) {
      console.error('Error adding subtask:', err);
      toast.error('Falha ao adicionar subtarefa');
    }
  };

  const updateSubtask = async (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      const updatedSubtasks = task.subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, ...updates } 
          : subtask
      );
      
      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: updatedSubtasks
      });
      
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, subtasks: updatedSubtasks } 
            : task
        )
      );
    } catch (err) {
      console.error('Error updating subtask:', err);
      toast.error('Falha ao atualizar subtarefa');
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      const updatedSubtasks = task.subtasks.filter(
        subtask => subtask.id !== subtaskId
      );
      
      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: updatedSubtasks
      });
      
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, subtasks: updatedSubtasks } 
            : task
        )
      );
      
      toast.success('Subtarefa excluída');
    } catch (err) {
      console.error('Error deleting subtask:', err);
      toast.error('Falha ao excluir subtarefa');
    }
  };

  const toggleSubtaskComplete = async (taskId: string, subtaskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      const subtask = task.subtasks.find(s => s.id === subtaskId);
      
      if (!subtask) {
        throw new Error('Subtask not found');
      }
      
      await updateSubtask(taskId, subtaskId, { 
        completed: !subtask.completed 
      });
    } catch (err) {
      console.error('Error toggling subtask:', err);
      toast.error('Falha ao atualizar subtarefa');
    }
  };

  const toggleTaskComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      await updateTask(taskId, { completed: !task.completed });
    } catch (err) {
      console.error('Error toggling task completion:', err);
      toast.error('Falha ao atualizar tarefa');
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      addTask,
      updateTask,
      deleteTask,
      addSubtask,
      updateSubtask,
      deleteSubtask,
      toggleSubtaskComplete,
      toggleTaskComplete
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
