import { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, User, Lock, Shield, AlertCircle, ArrowRight, Mail, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import MonkeyPasswordAnimation from "@/components/ui/MonkeyPasswordAnimation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [appearAnimation, setAppearAnimation] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const { signIn, user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setHasPasswordError(false);
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setLoginError(result.error || "Falha na autenticação. Verifique suas credenciais.");
        setHasPasswordError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (user && !loading) {
    const from = location.state?.from || "/area-membro";
    return <Navigate to={from} replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back Button */}
      <motion.div
        className="absolute top-6 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl px-4 py-2 hover:bg-zinc-800/50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Link>
      </motion.div>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center justify-center mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src="https://i.postimg.cc/sf0yGXBJ/2.png" 
              alt="CYRUS Logo" 
              className="h-16 w-auto"
            />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            CYRUS
          </h1>
          <p className="text-zinc-400 text-lg font-medium">Central de Pagamentos Unificada</p>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)"
          }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h2>
            <p className="text-zinc-400">Acesse sua conta para continuar</p>
          </div>

          {/* Monkey Animation - Positioned prominently */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
              <MonkeyPasswordAnimation 
                isPasswordVisible={showPassword}
                isPasswordError={hasPasswordError}
                className={`relative ${isPasswordFocused ? 'focused' : ''}`}
              />
            </div>
          </motion.div>
          
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="bg-red-950/50 border-red-800/50 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label className="text-sm font-medium text-zinc-300">Email de Acesso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <Input 
                  type="email" 
                  placeholder="Email fornecido pelo suporte" 
                  className={`bg-zinc-800/50 border-2 ${emailError ? 'border-red-500/50' : 'border-zinc-700/50 focus:border-purple-500/50'} text-white pl-12 h-12 rounded-xl transition-all duration-300 focus:bg-zinc-800/70 placeholder:text-zinc-500`}
                  value={email} 
                  onChange={e => {
                    setEmail(e.target.value);
                    if (e.target.value) validateEmail(e.target.value);
                  }}
                />
              </div>
              {emailError && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {emailError}
                </motion.p>
              )}
            </motion.div>
            
            {/* Password Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label className="text-sm font-medium text-zinc-300">Senha de Acesso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Senha fornecida pelo suporte" 
                  className={`bg-zinc-800/50 border-2 ${passwordError ? 'border-red-500/50' : 'border-zinc-700/50 focus:border-purple-500/50'} text-white pl-12 pr-12 h-12 rounded-xl transition-all duration-300 focus:bg-zinc-800/70 placeholder:text-zinc-500`}
                  value={password} 
                  onChange={e => {
                    setPassword(e.target.value);
                    if (e.target.value) validatePassword(e.target.value);
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {passwordError}
                </motion.p>
              )}
            </motion.div>
            
            {/* Remember Checkbox */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Checkbox 
                id="remember" 
                className="border-zinc-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" 
              />
              <label htmlFor="remember" className="text-sm text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors">
                Manter-me conectado neste dispositivo
              </label>
            </motion.div>
            
            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-purple-500/25 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Acessar Plataforma</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
          
          {/* Security Notice */}
          <motion.div 
            className="flex items-center justify-center mt-6 text-zinc-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Shield className="w-4 h-4 mr-2" />
            <span>Acesso protegido com autenticação segura</span>
          </motion.div>
        </motion.div>

        {/* Credential Notice - Moved below the form */}
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-purple-200 font-medium mb-1">Acesso Seguro</p>
              <p className="text-zinc-300 leading-relaxed">
                Suas credenciais são fornecidas após a confirmação da compra. Entre em contato com nosso suporte para receber seu email e senha de acesso.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Support Contact */}
        <motion.div 
          className="text-center mt-6 p-6 bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p className="text-zinc-400 mb-4">Ainda não possui acesso à plataforma?</p>
          <div className="space-y-3">
            <div className="border-t border-zinc-700/50 pt-4">
              <p className="text-zinc-500 text-sm mb-3">Para receber suas credenciais de acesso:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/suporte" 
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-all duration-300 text-sm"
                >
                  <Mail className="h-4 w-4" />
                  Contatar Suporte
                </Link>
                <span className="hidden sm:inline text-zinc-600">•</span>
                <a 
                  href="https://wa.me/5511999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-all duration-300 text-sm"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer Links */}
        <motion.div 
          className="text-center mt-6 text-xs text-zinc-500 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <p>Sistema protegido por autenticação avançada</p>
          <div className="flex justify-center space-x-4">
            <Link to="/termos" className="hover:text-purple-400 transition-colors">Termos de Uso</Link>
            <span>•</span>
            <Link to="/privacidade" className="hover:text-purple-400 transition-colors">Política de Privacidade</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
