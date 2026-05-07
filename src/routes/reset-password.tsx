import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Stethoscope, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Scene3D } from "@/components/Scene3D";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — Dr. Abdellatif Tarek" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || "",
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // In a real app, you'd call a resetPasswordFn with the token and new password
      await new Promise(r => setTimeout(r, 1000)); 
      toast.success("Password reset successfully! You can now log in.");
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 text-center">
        <div className="glass-dark p-10 rounded-3xl border border-white/10 max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h1>
          <p className="text-white/50 mb-6">The password reset link is invalid or has expired.</p>
          <Button asChild className="rounded-xl bg-gradient-primary">
            <Link to="/forgot-password">Request new link</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] flex items-center justify-center p-6">
      <Scene3D className="absolute inset-0 z-0 opacity-30 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-dark rounded-[2.5rem] border border-white/10 p-10 shadow-elegant backdrop-blur-3xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary shadow-elegant relative">
            <Stethoscope className="h-10 w-10 text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Set new password</h1>
          <p className="text-white/50 mb-10 text-lg leading-relaxed">
            Please enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/60 ml-1">New Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-accent transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-13 pl-11 pr-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10"
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/60 ml-1">Confirm New Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-accent transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-13 pl-11 pr-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-primary text-white shadow-elegant rounded-2xl font-bold text-lg"
            >
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
