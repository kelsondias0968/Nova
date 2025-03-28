
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";

export default function Register() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <AuthForm mode="register" />
        </div>
      </main>
    </div>
  );
}
