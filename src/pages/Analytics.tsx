
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/config";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTasks } from "@/context/TaskContext";

export default function Analytics() {
  const navigate = useNavigate();
  const { tasks } = useTasks();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  // Data for pie chart: Tasks by status
  const statusData = [
    { name: 'Completed', value: tasks.filter(t => t.completed).length },
    { name: 'Active', value: tasks.filter(t => !t.completed).length },
  ];
  
  // Data for bar chart: Tasks by priority
  const priorityData = [
    { 
      name: 'High', 
      active: tasks.filter(t => t.priority === 'high' && !t.completed).length,
      completed: tasks.filter(t => t.priority === 'high' && t.completed).length,
    },
    { 
      name: 'Medium', 
      active: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
      completed: tasks.filter(t => t.priority === 'medium' && t.completed).length,
    },
    { 
      name: 'Low', 
      active: tasks.filter(t => t.priority === 'low' && !t.completed).length,
      completed: tasks.filter(t => t.priority === 'low' && t.completed).length,
    },
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Task Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tasks by Priority</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" stackId="a" fill="#8884d8" name="Active" />
                  <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {tasks.length === 0 && (
          <div className="bg-card border rounded-lg p-8 text-center mt-8">
            <h3 className="text-lg font-medium mb-2">No Data Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start creating tasks to see your productivity analytics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
