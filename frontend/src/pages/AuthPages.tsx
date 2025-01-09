import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus } from "lucide-react";
import LoginForm from "@/components/Login";
import RegisterForm from "@/components/Register";
import { useState } from "react";

const AuthPages = () => {

  const [activeTab, setActiveTab] = useState<string>('login');

  const handleRegisterSuccess = () => {
    setActiveTab('login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md mx-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm  onRegisterSuccess={handleRegisterSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPages;
