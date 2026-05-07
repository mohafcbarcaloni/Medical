import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useLoaderData } from "@tanstack/react-router";
import { logoutFn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, LogOut, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageProvider";

export const Route = createFileRoute("/profile")({
  loader: async ({ context }: any) => {
    const auth = await context.auth;
    if (!auth?.isAuthenticated) throw new Error("Unauthorized");
    return auth;
  },
  errorComponent: () => {
    const navigate = useNavigate();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile.</h2>
        <Button onClick={() => navigate({ to: "/login" })}>Login</Button>
      </div>
    );
  },
  component: ProfilePage,
});

function ProfilePage() {
  const auth = useLoaderData({ from: "/profile" }) as any;
  const navigate = useNavigate();
  const { lang, t } = useLang();

  const handleLogout = async () => {
    await (logoutFn as any)();
    navigate({ to: "/login" });
  };

  const user = auth.user || {};

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container-xl max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl border border-border shadow-elegant overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-primary p-8 text-white relative">
            <div className="absolute right-0 top-0 h-32 w-32 bg-white/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/30">
                {user.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display">{user.name}</h1>
                <p className="text-white/70 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" /> {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Member Since</div>
                    <div className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Account Status</div>
                    <div className="font-semibold">Verified Patient</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold">Account Actions</h3>
              <div className="grid gap-3">
                <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl border-border hover:bg-secondary">
                  <Link to="/">
                    <ArrowLeft className="mr-3 h-4 w-4" /> Back to Home
                  </Link>
                </Button>
                <Button 
                  onClick={handleLogout} 
                  variant="destructive" 
                  className="w-full justify-start h-12 rounded-xl shadow-soft"
                >
                  <LogOut className="mr-3 h-4 w-4" /> Logout from Account
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Need help? <Link to="/contact" className="text-primary font-semibold hover:underline">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}
