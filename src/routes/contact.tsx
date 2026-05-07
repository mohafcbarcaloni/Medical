import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { addMessage } from "@/lib/db";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useLang } from "@/components/LanguageProvider";
import { Link, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Dr. Abdellatif Tarek" },
      {
        name: "description",
        content: "Get in touch with Dr. Abdellatif Tarek's clinic. Find our address, phone, hours, and send us a message directly.",
      },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Valid email required").max(120),
  message: z.string().trim().min(5, "Please write a message").max(1000),
});

import { checkAuthFn } from "@/lib/auth";

export const submitContactFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const auth = await (checkAuthFn as any)();
    if (!auth.isAuthenticated) throw new Error("Please log in to send a message.");

    const data = ctx.data as z.infer<typeof schema>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);

    await new Promise((resolve) => setTimeout(resolve, 800));
    const newMessage = { 
      id: Date.now(), 
      ...parsed.data, 
      userId: auth.user?.id,
      status: "unread", 
      createdAt: new Date().toISOString() 
    };
    await addMessage(newMessage);
    return { success: true };
  });

function Contact() {
  const { t, lang } = useLang();
  const auth = (useLoaderData({ from: "__root__" }) as any) || { isAuthenticated: false };
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await (submitContactFn as any)({ data: parsed.data });
      setSent(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: lang === "ar" ? "الهاتف" : lang === "fr" ? "Téléphone" : "Phone",
      value: "+213 699 693 509",
      sub: lang === "ar" ? "الأحد–الخميس، 08:00–18:00" : lang === "fr" ? "Lun–Ven, 08:00–18:00" : "Mon–Fri, 08:00–18:00",
      href: "tel:+213699693509",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: Mail,
      label: lang === "ar" ? "البريد الإلكتروني" : lang === "fr" ? "Email" : "Email",
      value: "contact@tarek-medical.dz",
      sub: lang === "ar" ? "نرد خلال 24 ساعة" : lang === "fr" ? "Nous répondons sous 24h" : "We reply within 24 hours",
      href: "mailto:contact@tarek-medical.dz",
      color: "from-teal-500 to-cyan-600",
    },
    {
      icon: MapPin,
      label: lang === "ar" ? "العنوان" : lang === "fr" ? "Adresse" : "Address",
      value: t.contact.address,
      sub: lang === "ar" ? "اضغط للموقع على الخريطة" : lang === "fr" ? "Cliquez pour voir sur la carte" : "Click to view on map",
      href: t.contact.mapUrl,
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: Clock,
      label: lang === "ar" ? "أوقات العمل" : lang === "fr" ? "Heures d'ouverture" : "Opening Hours",
      value: lang === "ar" ? "الأحد–الخميس · 08:00–19:00" : lang === "fr" ? "Lun–Ven · 08:00–19:00" : "Mon–Fri · 08:00–19:00",
      sub: lang === "ar" ? "السبت · 09:00–13:00" : lang === "fr" ? "Samedi · 09:00–13:00" : "Saturday · 09:00–13:00",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero noise pt-32 pb-24">
        <div className="absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="container-xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="badge-pill bg-white/10 text-white/70 border border-white/20 mb-6">
              {t.contact.badge}
            </span>
            <h1 className="font-display text-5xl font-bold text-white md:text-7xl">
              {t.contact.title}
            </h1>
            <p className="mt-5 text-lg text-white/65 max-w-xl">
              {t.contact.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="py-16 bg-background">
        <div className="container-xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="block rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elegant hover:-translate-y-1 duration-300"
                  >
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-soft`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.label}</div>
                    <div className="font-semibold text-foreground text-left dir-ltr" dir="ltr">{item.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{item.sub}</div>
                  </a>
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-soft`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.label}</div>
                    <div className="font-semibold text-foreground">{item.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{item.sub}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM + MAP */}
      <section className="pb-24 bg-background">
        <div className="container-xl">
          <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-card overflow-hidden shadow-card"
            >
              <div className="border-b border-border bg-secondary/30 px-8 py-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-2xl font-bold">{t.contact.formTitle}</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t.contact.formDesc}</p>
              </div>

              {!auth.isAuthenticated ? (
                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <MessageSquare className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4">{lang === "ar" ? "تسجيل الدخول مطلوب" : lang === "fr" ? "Connexion requise" : "Login Required"}</h3>
                  <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                    {lang === "ar" ? "يرجى تسجيل الدخول لإرسال رسالة إلينا." : lang === "fr" ? "Veuillez vous connecter pour nous envoyer un message." : "Please log in to send us a message."}
                  </p>
                  <div className="flex gap-4 flex-wrap justify-center">
                    <Button asChild className="bg-gradient-primary text-white rounded-xl px-8 shadow-elegant">
                      <Link to="/login">{t.nav.login || "Login"}</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-xl px-8 border-primary/20 hover:bg-primary/5">
                      <Link to="/signup">{lang === "ar" ? "إنشاء حساب" : lang === "fr" ? "Créer un compte" : "Create Account"}</Link>
                    </Button>
                  </div>
                </div>
              ) : sent ? (
                <div className="p-12 text-center">
                  <div className="h-20 w-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5 animate-pulse-ring">
                    <CheckCircle2 className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{t.contact.successTitle}</h3>
                  <p className="mt-3 text-muted-foreground">
                    {lang === "ar" ? "شكراً" : lang === "fr" ? "Merci," : "Thank you,"} <strong className="text-foreground">{form.name.split(" ")[0]}</strong>.
                    <br /> {t.contact.successDesc}
                  </p>
                  <Button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                    variant="outline"
                    className="mt-6 rounded-xl px-6"
                  >
                    {t.contact.sendAnother}
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} className="p-8 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="cname" className="flex items-center gap-2 text-sm font-semibold">
                      <User className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "الاسم الكامل *" : lang === "fr" ? "Nom Complet *" : "Full Name *"}
                    </Label>
                    <Input
                      id="cname"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t.contact.namePlaceholder}
                      maxLength={80}
                      className="h-11 rounded-xl border-border bg-background"
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cemail" className="flex items-center gap-2 text-sm font-semibold">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "البريد الإلكتروني *" : lang === "fr" ? "Adresse e-mail *" : "Email Address *"}
                    </Label>
                    <Input
                      id="cemail"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t.contact.emailPlaceholder}
                      maxLength={120}
                      className="h-11 rounded-xl border-border bg-background text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cmsg" className="flex items-center gap-2 text-sm font-semibold">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" /> {lang === "ar" ? "رسالتك *" : lang === "fr" ? "Message *" : "Message *"}
                    </Label>
                    <Textarea
                      id="cmsg"
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t.contact.messagePlaceholder}
                      maxLength={1000}
                      className="rounded-xl border-border bg-background resize-none"
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <div className={`text-xs text-muted-foreground ${lang === "ar" ? "text-left" : "text-right"}`}>{form.message.length}/1000</div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-primary text-white shadow-elegant rounded-xl font-semibold"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        {t.contact.sending}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> {t.contact.send}
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Map + Extra Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map embed */}
              <div className="overflow-hidden rounded-3xl border border-border shadow-card aspect-[4/3]">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=5.408,36.188,5.418,36.194&layer=mapnik&marker=36.19106,5.41398"
                  className="w-full h-full"
                  title="Clinic Location"
                  loading="lazy"
                />
              </div>

              {/* FAQ mini */}
              <div className="rounded-2xl border border-border bg-card p-7 shadow-card space-y-5">
                <h3 className="font-display text-xl font-bold">{t.contact.faqTitle}</h3>
                {t.contact.faqs.map((faq) => (
                  <div key={faq.q} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="font-semibold text-sm">{faq.q}</div>
                    <div className="text-sm text-muted-foreground mt-1">{faq.a}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
