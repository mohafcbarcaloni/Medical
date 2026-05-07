import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Stethoscope, ArrowRight, Chrome as Google, Github, Facebook } from "lucide-react";
import { toast } from "sonner";
import { loginFn, socialLoginFn } from "@/lib/auth";
import { Scene3D } from "@/components/Scene3D";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login — Dr. Abdellatif Tarek" }],
  }),
  component: Login,
});

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminMode && !form.email) {
      toast.error("Please enter your email.");
      return;
    }
    if (!form.password) {
      toast.error("Please enter your password.");
      return;
    }
    setLoading(true);
    try {
      const data = isAdminMode ? { password: form.password } : form;
      const res = await (loginFn as any)({ data });
      toast.success(res.role === "admin" ? "Welcome back, Doctor!" : "Welcome back!");
      navigate({ to: res.role === "admin" ? "/admin" : "/" });
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    const email = window.prompt(`Enter your ${provider} email to simulate login:`);
    if (!email) return;

    setLoading(true);
    try {
      await (socialLoginFn as any)({ data: { provider, email, name: email.split("@")[0] } });
      toast.success(`Welcome! Logged in with ${provider}`);
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(`Social login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] flex items-center justify-center p-6">
      {/* 3D Background */}
      <Scene3D className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
      
      {/* Dynamic Glows */}
      <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px] animate-float pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-dark rounded-[2.5rem] border border-white/10 p-10 md:p-12 shadow-elegant backdrop-blur-3xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary shadow-elegant relative group"
            >
              <div className="absolute inset-0 rounded-3xl bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <Stethoscope className="h-10 w-10 text-white relative z-10" />
            </motion.div>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight text-gradient">
              {isAdminMode ? "Admin Portal" : "Welcome Back"}
            </h1>
            <p className="mt-3 text-white/50 text-lg">
              {isAdminMode ? "Authorized access only." : "Sign in to manage your practice."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {!isAdminMode && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <Label className="text-sm font-medium text-white/60 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-accent transition-colors" />
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="h-13 pl-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10 transition-all"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-sm font-medium text-white/60">
                  {isAdminMode ? "Master Password" : "Password"}
                </Label>
                {!isAdminMode && (
                  <Link to="/forgot-password" size="sm" className="text-xs text-accent/70 hover:text-accent transition-colors">
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-accent transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={isAdminMode ? "Enter master password" : "••••••••"}
                  className="h-13 pl-11 pr-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-primary text-white shadow-elegant rounded-2xl font-bold text-lg group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {isAdminMode ? "Verifying..." : "Authenticating..."}
                  </>
                ) : (
                  <>
                    {isAdminMode ? "Access Admin" : "Sign In"} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              {isAdminMode ? "Switch to Regular Login" : "Are you an Administrator?"}
            </button>
          </div>

          {!isAdminMode && (
            <>
              {/* Social Auth */}
              <div className="mt-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#121620] px-4 text-white/40 tracking-widest">Or sign in with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialLogin("Google")}
                    className="h-12 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
                  >
                    <Google className="mr-2 h-5 w-5 text-rose-500" /> Google
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialLogin("Facebook")}
                    className="h-12 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
                  >
                    <Facebook className="mr-2 h-5 w-5 text-blue-500" /> Facebook
                  </Button>
                </div>
              </div>

              <p className="mt-8 text-center text-white/40 text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-accent font-semibold hover:underline decoration-accent/30 underline-offset-4">
                  Create one now
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
