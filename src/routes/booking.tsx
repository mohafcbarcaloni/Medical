import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { addBooking } from "@/lib/db";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Shield,
  User,
  Mail,
  Calendar,
  FileText,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Link, useLoaderData } from "@tanstack/react-router";
import { useLang } from "@/components/LanguageProvider";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — Dr. Abdellatif Tarek" },
      {
        name: "description",
        content: "Book your medical appointment online with Dr. Abdellatif Tarek. Fast, easy, and secure.",
      },
    ],
  }),
  component: Booking,
});

const schema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(80),
  phone: z.string().trim().min(6, "Phone number is required").max(20),
  email: z.string().trim().email("Please enter a valid email").max(120),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  service: z.string().optional(),
  reason: z.string().trim().max(500).optional(),
});

import { checkAuthFn } from "@/lib/auth";

export const submitBookingFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const auth = await (checkAuthFn as any)();
    if (!auth.isAuthenticated) throw new Error("Please log in to book an appointment.");

    const data = ctx.data as z.infer<typeof schema>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newBooking = {
      id: Date.now(),
      ...parsed.data,
      userId: auth.user?.id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await addBooking(newBooking);
    return { success: true, bookingId: newBooking.id };
  });

const times = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

function Booking() {
  const { t, lang } = useLang();
  const auth = (useLoaderData({ from: "__root__" }) as any) || { isAuthenticated: false };
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", date: "", time: "", service: "", reason: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await (submitBookingFn as any)({ data: parsed.data });
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const sideInfo = [
    { icon: Clock, title: t.booking.sideHours, text: lang === "ar" ? "الأحد–الخميس · 08:00–19:00\nالسبت · 09:00–13:00" : lang === "fr" ? "Lun–Ven · 08:00–19:00\nSamedi · 09:00–13:00" : "Mon–Fri · 08:00–19:00\nSaturday · 09:00–13:00" },
    { icon: MapPin, title: t.booking.sideLocation, text: t.footer.address },
    { icon: Phone, title: t.contact.label || "Phone", text: "+213 699 693 509" },
    { icon: Shield, title: t.booking.sideSecure, text: t.booking.sideSecureDesc },
  ];

  return (
    <div>
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-hero noise pt-32 pb-20">
        <div className="absolute right-1/4 top-1/4 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="container-xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="badge-pill bg-white/10 text-white/70 border border-white/20 mb-6">
              {t.booking.badge}
            </span>
            <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
              {t.booking.title}
            </h1>
            <p className="mt-5 text-lg text-white/65">
              {t.booking.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_2fr]">
            {/* Sidebar Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="space-y-5 lg:sticky lg:top-28"
            >
              {/* Doctor card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                    <Stethoscope className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold">Dr. Abdellatif Tarek</div>
                    <div className="text-sm text-muted-foreground">{t.about.subtitle}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    t.booking.sideExp,
                    t.booking.sideFast,
                    t.booking.sideConfirm,
                    t.booking.sideTrust,
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact info cards */}
              {sideInfo.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{item.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Booking Form */}
            <AnimatePresence mode="wait">
              {!auth.isAuthenticated ? (
                <motion.div
                  key="auth-required"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-border bg-card p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="font-display text-3xl font-bold mb-4">{lang === "ar" ? "تسجيل الدخول مطلوب" : lang === "fr" ? "Connexion requise" : "Login Required"}</h2>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md">
                    {lang === "ar" ? "يرجى إنشاء حساب أو تسجيل الدخول لحجز موعد." : lang === "fr" ? "Veuillez créer un compte ou vous connecter pour réserver un rendez-vous." : "Please create an account or log in to book an appointment."}
                  </p>
                  <div className="flex gap-4 flex-wrap justify-center">
                    <Button asChild size="lg" className="bg-gradient-primary text-white rounded-xl px-8 shadow-elegant">
                      <Link to="/login">{t.nav.login || "Login"}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-xl px-8 border-primary/20 hover:bg-primary/5">
                      <Link to="/signup">{lang === "ar" ? "إنشاء حساب" : lang === "fr" ? "Créer un compte" : "Create Account"}</Link>
                    </Button>
                  </div>
                </motion.div>
              ) : submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-12 shadow-card text-center"
                >
                  <div className="h-24 w-24 rounded-full bg-accent/15 flex items-center justify-center mb-6 animate-pulse-ring">
                    <CheckCircle2 className="h-12 w-12 text-accent" />
                  </div>
                  <h2 className="font-display text-3xl font-bold">{t.booking.successTitle}</h2>
                  <p className="mt-4 max-w-md text-muted-foreground text-lg leading-relaxed">
                    {lang === "ar" ? "شكراً" : lang === "fr" ? "Merci," : "Thank you,"} <strong className="text-foreground">{form.name.split(" ")[0]}</strong>!<br />
                    {lang === "ar" ? "لقد استلمنا طلبك ليوم" : lang === "fr" ? "Nous avons reçu votre demande pour le" : "We've received your request for"} <strong className="text-foreground">{form.date}</strong> {lang === "ar" ? "على الساعة" : lang === "fr" ? "à" : "at"} <strong className="text-foreground">{form.time}</strong>.<br />
                    {t.booking.successDesc}
                  </p>
                  <div className="mt-8 flex gap-3 flex-wrap justify-center">
                    <Button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", phone: "", email: "", date: "", time: "", service: "", reason: "" });
                      }}
                      variant="outline"
                      className="rounded-xl px-6"
                    >
                      {t.booking.bookAnother}
                    </Button>
                    <Button asChild className="bg-gradient-primary text-white rounded-xl px-6 shadow-elegant">
                      <Link to="/">{t.booking.backHome} <ArrowRight className="mx-2 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.7 }}
                  className="rounded-3xl border border-border bg-card shadow-card overflow-hidden"
                >
                  <div className="border-b border-border bg-secondary/30 px-8 py-6">
                    <h2 className="font-display text-2xl font-bold">
                      {t.booking.infoTitle}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.booking.infoDesc}
                    </p>
                  </div>

                  <form onSubmit={onSubmit} className="p-8 grid gap-6 md:grid-cols-2">
                    {/* Full name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold">
                        <User className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "الاسم الكامل *" : lang === "fr" ? "Nom Complet *" : "Full Name *"}
                      </Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t.booking.namePlaceholder}
                        maxLength={80}
                        className="h-11 rounded-xl border-border bg-background"
                        dir={lang === "ar" ? "rtl" : "ltr"}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold">
                        <Phone className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "رقم الهاتف *" : lang === "fr" ? "Numéro de téléphone *" : "Phone Number *"}
                      </Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder={t.booking.phonePlaceholder}
                        maxLength={20}
                        className="h-11 rounded-xl border-border bg-background text-left"
                        dir="ltr"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                        <Mail className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "البريد الإلكتروني *" : lang === "fr" ? "Adresse e-mail *" : "Email Address *"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={t.booking.emailPlaceholder}
                        maxLength={120}
                        className="h-11 rounded-xl border-border bg-background text-left"
                        dir="ltr"
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold">
                        <Calendar className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "تاريخ الموعد المفضل *" : lang === "fr" ? "Date préférée *" : "Preferred Date *"}
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        min={today}
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="h-11 rounded-xl border-border bg-background text-left"
                        dir="ltr"
                      />
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                      <Label htmlFor="time" className="flex items-center gap-2 text-sm font-semibold">
                        <Clock className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "الوقت المفضل *" : lang === "fr" ? "Heure préférée *" : "Preferred Time *"}
                      </Label>
                      <Select value={form.time} onValueChange={(v) => setForm({ ...form, time: v })} dir={lang === "ar" ? "rtl" : "ltr"}>
                        <SelectTrigger id="time" className="h-11 rounded-xl border-border bg-background">
                          <SelectValue placeholder={lang === "ar" ? "اختر التوقيت" : lang === "fr" ? "Sélectionnez une heure" : "Select a time slot"} />
                        </SelectTrigger>
                        <SelectContent>
                          {times.map((tItem) => (
                            <SelectItem key={tItem} value={tItem}>{tItem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Service */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="service" className="flex items-center gap-2 text-sm font-semibold">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "الخدمة المطلوبة (اختياري)" : lang === "fr" ? "Service souhaité (optionnel)" : "Service Needed (optional)"}
                      </Label>
                      <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })} dir={lang === "ar" ? "rtl" : "ltr"}>
                        <SelectTrigger id="service" className="h-11 rounded-xl border-border bg-background">
                          <SelectValue placeholder={lang === "ar" ? "اختر الخدمة" : lang === "fr" ? "Sélectionnez un service" : "Select a service"} />
                        </SelectTrigger>
                        <SelectContent>
                          {t.services.list.map((s: any) => (
                            <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="reason" className="flex items-center gap-2 text-sm font-semibold">
                        <FileText className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "سبب الزيارة (اختياري)" : lang === "fr" ? "Raison de la visite (optionnel)" : "Reason for Visit (optional)"}
                      </Label>
                      <Textarea
                        id="reason"
                        value={form.reason}
                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                        placeholder={t.booking.reasonPlaceholder}
                        maxLength={500}
                        rows={4}
                        className="rounded-xl border-border bg-background resize-none"
                        dir={lang === "ar" ? "rtl" : "ltr"}
                      />
                      <div className={`text-xs text-muted-foreground ${lang === "ar" ? "text-left" : "text-right"}`}>{form.reason.length}/500</div>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2 pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full h-14 bg-gradient-primary text-white shadow-elegant rounded-xl text-base font-semibold"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            {t.booking.submitting}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <CalendarCheck className="h-5 w-5" />
                            {t.booking.submit}
                          </span>
                        )}
                      </Button>
                      <p className="mt-4 text-center text-xs text-muted-foreground">
                        {t.booking.agreePolicy}
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
