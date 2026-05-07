import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordFn } from "@/lib/auth";
import { Scene3D } from "@/components/Scene3D";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Reset Password — Dr. Abdellatif Tarek" }],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await (forgotPasswordFn as any)({ data: { email } });
      setSent(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] flex items-center justify-center p-6">
      <Scene3D className="absolute inset-0 z-0 opacity-30 pointer-events-none" />
      
      <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-dark rounded-[2.5rem] border border-white/10 p-10 shadow-elegant backdrop-blur-3xl text-center">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Check your inbox</h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                If an account exists for <strong className="text-white">{email}</strong>, we've sent instructions to reset your password.
              </p>
              <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white bg-white/5 hover:bg-white/10">
                <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Link>
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary shadow-elegant relative">
                <Stethoscope className="h-10 w-10 text-white relative z-10" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Forgot password?</h1>
              <p className="text-white/50 mb-10 text-lg leading-relaxed">
                No worries, we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-left">
                  <Label className="text-sm font-medium text-white/60 ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-accent transition-colors" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="h-13 pl-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-primary text-white shadow-elegant rounded-2xl font-bold text-lg"
                >
                  {loading ? "Sending link..." : "Reset password"}
                </Button>
              </form>

              <p className="mt-10">
                <Link to="/login" className="inline-flex items-center text-white/40 hover:text-white transition-colors text-sm font-medium">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
