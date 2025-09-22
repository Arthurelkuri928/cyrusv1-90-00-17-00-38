
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [appearAnimation, setAppearAnimation] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    // Trigger appearance animation after component mount
    setTimeout(() => {
      setAppearAnimation(true);
    }, 100);
  }, []);

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email é obrigatório");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email inválido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateUsername = (username: string) => {
    if (!username) {
      setUsernameError("Nome de usuário é obrigatório");
      return false;
    } else if (username.length < 3) {
      setUsernameError("Nome de usuário deve ter pelo menos 3 caracteres");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Senha é obrigatória");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("As senhas não coincidem");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isUsernameValid = validateUsername(username);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isUsernameValid) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (error) {
        throw error;
      }

      // Se o registro for bem-sucedido
      toast.success("Registro realizado com sucesso! Verifique seu email para confirmar sua conta.");
      localStorage.setItem("username", username);
      
    } catch (error: any) {
      console.error('Erro ao registrar:', error.message);
      
      if (error.message.includes('already registered')) {
        toast.error('Este email já está registrado.');
      } else {
        toast.error(`Erro ao registrar: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirecionamento se o usuário já estiver autenticado
  if (user && !loading) {
    return <Navigate to="/area-membro" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] flex flex-col items-center justify-center p-4">
      <div 
        className={`mb-8 text-center transition-all duration-700 transform ${
          appearAnimation ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h1 className="text-[#A259FF] text-5xl font-bold tracking-wider uppercase mb-2">CYRUS</h1>
        <p className="text-white/50 text-lg">Sua Central de Pagamentos Unificada</p>
      </div>

      <div 
        className={`w-full max-w-md bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#A259FF]/10 overflow-hidden transition-all duration-700 transform ${
          appearAnimation ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{
          boxShadow: "0 10px 30px rgba(162, 89, 255, 0.15)"
        }}
      >
        <div className="p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Criar uma nova conta
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#A259FF] transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <Input 
                    type="text" 
                    placeholder="Nome de usuário" 
                    className={`bg-[#1A1A1A] border ${usernameError ? 'border-red-500' : 'border-gray-700 focus:border-[#A259FF]'} text-white pl-10 h-12 transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(162,89,255,0.3)]`}
                    value={username} 
                    onChange={e => {
                      setUsername(e.target.value);
                      if (e.target.value) validateUsername(e.target.value);
                    }}
                  />
                </div>
                {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
              </div>
              
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#A259FF] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    className={`bg-[#1A1A1A] border ${emailError ? 'border-red-500' : 'border-gray-700 focus:border-[#A259FF]'} text-white pl-10 h-12 transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(162,89,255,0.3)]`}
                    value={email} 
                    onChange={e => {
                      setEmail(e.target.value);
                      if (e.target.value) validateEmail(e.target.value);
                    }}
                  />
                </div>
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>
              
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#A259FF] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Senha" 
                    className={`bg-[#1A1A1A] border ${passwordError ? 'border-red-500' : 'border-gray-700 focus:border-[#A259FF]'} text-white pl-10 h-12 transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(162,89,255,0.3)]`}
                    value={password} 
                    onChange={e => {
                      setPassword(e.target.value);
                      if (e.target.value) {
                        validatePassword(e.target.value);
                        if (confirmPassword) validateConfirmPassword(confirmPassword);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              </div>
              
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#A259FF] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Confirme sua senha" 
                    className={`bg-[#1A1A1A] border ${confirmPasswordError ? 'border-red-500' : 'border-gray-700 focus:border-[#A259FF]'} text-white pl-10 h-12 transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(162,89,255,0.3)]`}
                    value={confirmPassword} 
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      if (e.target.value) validateConfirmPassword(e.target.value);
                    }}
                  />
                </div>
                {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#A259FF] hover:bg-[#C084FC] text-white font-bold py-6 h-12 rounded-lg transition-all duration-300 transform hover:-translate-y-[2px] hover:shadow-[0_5px_15px_rgba(162,89,255,0.4)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </div>
                ) : "Criar Conta"}
              </Button>
            </div>
          </form>
          
          <div className="flex items-center justify-center mt-6 text-gray-400 text-sm">
            <Shield className="w-4 h-4 mr-2 text-gray-500" />
            <span>Seus dados estão protegidos com criptografia de ponta.</span>
          </div>
        </div>
        
        <div className="bg-[#141414] p-6 border-t border-gray-800">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Já possui uma conta?</p>
            <Link to="/entrar" className="text-[#A259FF] hover:text-[#C084FC] hover:underline font-medium transition-all">
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
