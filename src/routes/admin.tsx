import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MessageSquare,
  LogOut,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  Send,
  X,
  RefreshCw,
  Activity,
  TrendingUp,
  Bell,
} from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { checkAuthFn, logoutFn } from "@/lib/auth";
import { toast } from "sonner";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

export const getAdminDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDb();
  const bookings = [...db.bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const messages = [...db.messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const users = [...db.users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return { bookings, messages, users };
});

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  text: z.string(),
});

export const sendEmailAdminFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const auth = await (checkAuthFn as any)();
    if (!auth.isAuthenticated || auth.role !== "admin") throw new Error("Unauthorized");

    const data = ctx.data as z.infer<typeof sendEmailSchema>;
    const parsed = sendEmailSchema.safeParse(data);
    if (!parsed.success) throw new Error("Invalid email data");

    return await sendEmail(parsed.data);
  });

export const deleteItemFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const auth = await (checkAuthFn as any)();
    if (!auth.isAuthenticated || auth.role !== "admin") throw new Error("Unauthorized");

    const { type, id } = ctx.data as { type: "booking" | "message" | "user"; id: string | number };
    const db = await getDb();

    if (type === "booking") {
      db.bookings = db.bookings.filter((b) => b.id !== id);
    } else if (type === "message") {
      db.messages = db.messages.filter((m) => m.id !== id);
    } else if (type === "user") {
      db.users = db.users.filter((u) => u.id !== id);
    }

    const { saveDb } = await import("@/lib/db");
    await saveDb(db);
    return { success: true };
  });

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — Dr. Abdellatif Tarek" }],
  }),
  loader: async () => {
    const auth = await (checkAuthFn as any)();
    if (!auth.isAuthenticated || auth.role !== "admin") throw new Error("Unauthorized");
    return await (getAdminDataFn as any)();
  },
  errorComponent: () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/login", replace: true });
    }, [navigate]);
    return null;
  },
  component: AdminDashboard,
});

type ReplyModal = {
  type: "booking" | "message";
  id: number;
  toEmail: string;
  toName: string;
  detail: string;
} | null;

function ReplyDialog({
  modal,
  onClose,
}: {
  modal: ReplyModal;
  onClose: () => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const defaultReply =
    modal?.type === "booking"
      ? `Dear ${modal.toName},\n\nThank you for booking an appointment at Dr. Abdellatif Tarek's Clinic.\n\nWe are pleased to confirm your appointment.\n${modal.detail}\n\nPlease arrive 10 minutes early and bring your insurance card.\n\nBest regards,\nDr. Abdellatif Tarek's Clinic\nPhone: +213 699 693 509`
      : `Dear ${modal?.toName},\n\nThank you for reaching out to Dr. Abdellatif Tarek's Clinic.\n\n[Write your response here]\n\nBest regards,\nDr. Abdellatif Tarek's Clinic`;

  useEffect(() => {
    if (modal) setReplyText(defaultReply);
  }, [modal?.id]);

  const sendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please write a reply before sending.");
      return;
    }
    setSending(true);
    
    try {
      const subject = modal?.type === "booking" 
        ? "Confirmation of your Appointment - Dr. Abdellatif Tarek"
        : "Reply to your message - Dr. Abdellatif Tarek";

      const res = await (sendEmailAdminFn as any)({
        data: {
          to: modal?.toEmail,
          subject,
          text: replyText,
        }
      });

      if (res.simulated) {
        toast.warning("Email simulated! You must configure EMAIL_USER and EMAIL_PASS in your .env file to send real emails.");
      } else {
        toast.success(`Reply sent to ${modal?.toEmail}`);
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card shadow-elegant overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-7 py-5">
          <div>
            <div className="font-display text-xl font-bold">
              {modal.type === "booking" ? "Confirm Appointment" : "Reply to Message"}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              Sending to: <span className="font-medium text-foreground">{modal.toEmail}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 space-y-4">
          <div className="rounded-xl border border-border bg-background p-1">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={12}
              className="w-full bg-transparent px-4 py-3 text-sm text-foreground resize-none focus:outline-none font-mono leading-relaxed"
              placeholder="Write your reply..."
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ⚠️ To send real emails, connect a service like <strong>Resend</strong> or <strong>Nodemailer</strong> in <code>src/lib/email.ts</code>. This simulates the send action.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-7 py-5">
          <Button variant="outline" onClick={onClose} className="rounded-xl px-5">Cancel</Button>
          <Button
            onClick={sendReply}
            disabled={sending}
            className="bg-gradient-primary rounded-xl px-6 shadow-elegant text-white font-semibold"
          >
            {sending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Send Email
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const data = Route.useLoaderData() as any;
  const navigate = useNavigate();
  const [modal, setModal] = useState<ReplyModal>(null);
  const [bookings, setBookings] = useState(data.bookings);
  const [messages, setMessages] = useState(data.messages);
  const [users, setUsers] = useState(data.users || []);

  const handleLogout = async () => {
    await (logoutFn as any)();
    navigate({ to: "/login" });
  };

  const handleDelete = async (type: "booking" | "message" | "user", id: any) => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;
    
    try {
      await (deleteItemFn as any)({ data: { type, id } });
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      
      if (type === "booking") setBookings(bookings.filter((b: any) => b.id !== id));
      if (type === "message") setMessages(messages.filter((m: any) => m.id !== id));
      if (type === "user") setUsers(users.filter((u: any) => u.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item");
    }
  };

  const pendingCount = bookings.filter((b: any) => b.status === "pending").length;
  const unreadCount = messages.filter((m: any) => m.status === "unread").length;

  const openBookingReply = (b: any) => {
    setModal({
      type: "booking",
      id: b.id,
      toEmail: b.email,
      toName: b.name,
      detail: `Appointment Date: ${b.date}\nTime: ${b.time}${b.service ? `\nService: ${b.service}` : ""}`,
    });
  };

  const openMessageReply = (m: any) => {
    setModal({
      type: "message",
      id: m.id,
      toEmail: m.email,
      toName: m.name,
      detail: `Original message:\n"${m.message}"`,
    });
  };

  const statCards = [
    { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "from-blue-600 to-indigo-600", sub: `${pendingCount} pending` },
    { label: "Total Messages", value: messages.length, icon: MessageSquare, color: "from-teal-500 to-cyan-600", sub: `${unreadCount} unread` },
    { label: "Registered Users", value: users.length, icon: User, color: "from-violet-500 to-purple-600", sub: "Patient accounts" },
    { label: "This Week", value: bookings.filter((b: any) => new Date(b.createdAt) > new Date(Date.now() - 7 * 86400000)).length, icon: TrendingUp, color: "from-emerald-500 to-green-600", sub: "new bookings" },
  ];

  return (
    <>
      <ReplyDialog modal={modal} onClose={() => setModal(null)} />

      <div className="min-h-screen bg-background">
        {/* Top admin bar */}
        <div className="border-b border-border bg-card shadow-sm">
          <div className="container-xl flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">Admin Dashboard</div>
                <div className="text-xs text-muted-foreground">Dr. Abdellatif Tarek's Clinic</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(pendingCount > 0 || unreadCount > 0) && (
                <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                  <Bell className="h-3.5 w-3.5" />
                  {pendingCount + unreadCount} new
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="container-xl py-10">
          {/* Stat cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                    <div className="font-display text-4xl font-bold mt-1">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
                  </div>
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-soft`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="mb-6 rounded-xl border border-border bg-card p-1 h-auto gap-1">
              <TabsTrigger value="bookings" className="rounded-lg px-5 py-2.5 font-medium data-[state=active]:bg-primary data-[state=active]:text-white">
                <Calendar className="mr-2 h-4 w-4" />
                Bookings
                {pendingCount > 0 && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-lg px-5 py-2.5 font-medium data-[state=active]:bg-primary data-[state=active]:text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
                {unreadCount > 0 && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg px-5 py-2.5 font-medium data-[state=active]:bg-primary data-[state=active]:text-white">
                <User className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            {/* BOOKINGS TAB */}
            <TabsContent value="bookings">
              <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <div className="font-semibold text-muted-foreground">No bookings yet</div>
                    <div className="text-sm text-muted-foreground mt-1">Appointments will appear here once patients book online.</div>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {bookings.map((b: any) => (
                      <div key={b.id} className="p-6 hover:bg-secondary/30 transition-colors">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
                              {b.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground text-lg">{b.name}</div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{b.phone}</span>
                                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{b.email}</span>
                              </div>
                              {b.service && (
                                <div className="mt-2">
                                  <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
                                    {b.service}
                                  </span>
                                </div>
                              )}
                              {b.reason && (
                                <div className="mt-2 text-sm text-muted-foreground italic max-w-sm">
                                  "{b.reason}"
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3 sm:shrink-0">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 font-medium">
                                <Calendar className="h-4 w-4 text-primary" />
                                {b.date}
                              </div>
                              <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 font-medium">
                                <Clock className="h-4 w-4 text-primary" />
                                {b.time}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <span className={`badge-pill text-xs ${b.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}`}>
                                {b.status === "pending" ? "⏳ Pending" : "✅ Confirmed"}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => openBookingReply(b)}
                                className="bg-gradient-primary text-white rounded-lg text-xs px-4 shadow-soft"
                              >
                                <Send className="mr-1.5 h-3.5 w-3.5" /> Confirm & Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete("booking", b.id)}
                                className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(b.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* MESSAGES TAB */}
            <TabsContent value="messages">
              <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <div className="font-semibold text-muted-foreground">No messages yet</div>
                    <div className="text-sm text-muted-foreground mt-1">Messages from the Contact page will appear here.</div>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {messages.map((m: any) => (
                      <div key={m.id} className="p-6 hover:bg-secondary/30 transition-colors">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-teal flex items-center justify-center text-white font-bold text-lg shrink-0">
                              {m.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground text-lg">{m.name}</div>
                              <div className="flex items-center gap-1 mt-0.5 text-sm text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" />{m.email}
                              </div>
                              <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-4 text-sm text-foreground max-w-xl">
                                {m.message}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3 sm:shrink-0">
                            <div className="text-xs text-muted-foreground">
                              {new Date(m.createdAt).toLocaleString()}
                            </div>
                            <span className={`badge-pill text-xs ${m.status === "unread" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800" : "bg-secondary text-muted-foreground border border-border"}`}>
                              {m.status === "unread" ? "🔵 Unread" : "✓ Read"}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => openMessageReply(m)}
                              className="bg-gradient-primary text-white rounded-lg text-xs px-4 shadow-soft"
                            >
                              <Send className="mr-1.5 h-3.5 w-3.5" /> Reply
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete("message", m.id)}
                              className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* USERS TAB */}
            <TabsContent value="users">
              <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                {users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <User className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <div className="font-semibold text-muted-foreground">No registered users yet</div>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {users.map((u: any) => (
                      <div key={u.id} className="p-6 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                              {u.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground text-lg">{u.name}</div>
                              <div className="text-sm text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Joined on</div>
                            <div className="text-sm font-medium">{new Date(u.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete("user", u.id)}
                              className="h-9 w-9 p-0 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
