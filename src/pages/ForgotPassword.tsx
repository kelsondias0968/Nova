
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      setIsEmailSent(true);
      toast.success("Email de recuperação enviado");
    } catch (error: any) {
      console.error("Erro ao recuperar senha:", error);
      
      let errorMessage = "Falha ao enviar email de recuperação";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Nenhuma conta encontrada com este email";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md p-6 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Recuperar Senha</h1>
            <p className="text-muted-foreground mt-2">
              {isEmailSent
                ? "Verifique seu email para um link de recuperação de senha"
                : "Digite seu email para receber um link de recuperação de senha"}
            </p>
          </div>

          {isEmailSent ? (
            <div className="text-center">
              <div className="mb-6 p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="mb-6">
                Enviamos um link de recuperação para seu email. Por favor, verifique sua caixa de entrada e siga as instruções.
              </p>
              <Button onClick={() => navigate("/login")} className="w-full">
                Voltar para Login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu email"
                          type="email"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="px-0 text-sm"
                  >
                    Voltar para Login
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </main>
    </div>
  );
}
