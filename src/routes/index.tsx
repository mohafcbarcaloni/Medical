import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/LanguageProvider";
import {
  Activity, Award, CalendarCheck, HeartPulse, Sparkles,
  ArrowRight, Star, Phone, Clock, Users, CheckCircle2,
  ChevronRight, Quote, Scissors, Stethoscope, ShieldCheck,
} from "lucide-react";
import { Magnetic } from "@/components/Magnetic";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Abdellatif Tarek — Chirurgien Général" },
      { name: "description", content: "Chirurgien spécialisé en chirurgie générale — 30+ ans d'expérience. Chirurgie digestive, hernies, paroi abdominale." },
    ],
  }),
  component: Index,
});

const serviceIcons = [Scissors, Stethoscope, Activity, HeartPulse, ShieldCheck, Award];

function Index() {
  const { t, lang } = useLang();

  const whyUs = [
    { icon: ShieldCheck, title: t.home.whyUs[0].title, desc: t.home.whyUs[0].desc },
    { icon: Clock, title: t.home.whyUs[1].title, desc: t.home.whyUs[1].desc },
    { icon: HeartPulse, title: t.home.whyUs[2].title, desc: t.home.whyUs[2].desc },
    { icon: Sparkles, title: t.home.whyUs[3].title, desc: t.home.whyUs[3].desc },
  ];

  const testimonials = t.home.testimonials.map(tm => ({ ...tm, rating: 5 }));

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden noise">
        <div className="absolute inset-0">
          <img src="/clinic-hero.png" alt="Clinic" className="h-full w-full object-cover" />
          <div className="hero-image-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-hero opacity-85" />
        </div>
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float-slow pointer-events-none" />

        <div className="container-xl relative z-10 pt-28 pb-20">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="badge-pill bg-accent/20 border border-accent/30 text-accent backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-6 font-display text-5xl font-bold text-white md:text-7xl lg:text-8xl leading-none"
            >
              {t.hero.title}
              <br /><span className="text-accent">{t.hero.titleAccent}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-7 max-w-2xl text-lg text-white/75 leading-relaxed md:text-xl"
            >
              {t.hero.desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-10 flex flex-wrap gap-5"
            >
              <Magnetic>
                <Button asChild size="lg" className="h-14 px-10 bg-accent hover:bg-accent/90 text-white shadow-elegant rounded-xl text-base font-bold">
                  <Link to="/booking"><CalendarCheck className="me-2 h-5 w-5" />{t.hero.cta1}</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild size="lg" variant="outline" className="h-14 px-10 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm rounded-xl text-base font-bold">
                  <Link to="/about">{t.hero.cta2} <ArrowRight className="ms-2 h-4 w-4" /></Link>
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-10 flex flex-wrap items-center gap-6 text-white/60 text-sm">
              <a href="tel:+213699693509" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-4 w-4" /> +213 699 693 509
              </a>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {lang === "ar" ? "الأحد–الخميس · 08:00–19:00" : lang === "fr" ? "Lun–Ven · 08:00–19:00" : "Mon–Fri · 08:00–19:00"}</span>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {t.stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div className="font-display text-3xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* DOCTOR INTRO */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="relative h-[550px] overflow-hidden rounded-3xl shadow-elegant">
                <img src="/doctor.png" alt="Dr. Abdellatif Tarek" className="h-full w-full object-cover" />
                <div className="glass-dark absolute bottom-6 left-6 right-6 rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-display text-lg font-bold text-white">Dr. Abdellatif Tarek</div>
                      <div className="text-sm text-white/60">{t.about.subtitle}</div>
                    </div>
                    <div className="ms-auto flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
              <span className="badge-pill bg-accent/10 text-accent border border-accent/20">{t.about.badge}</span>
              <h2 className="font-display text-4xl font-bold md:text-5xl">
                {lang === "ar" ? "رعاية تنبع من" : lang === "fr" ? "Des soins qui" : "Care that truly"}{" "}
                <span className="text-gradient">{lang === "ar" ? "القلب" : lang === "fr" ? "écoutent vraiment." : "listens."}</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.about.bio1}</p>
              <p className="text-muted-foreground leading-relaxed">{t.about.bio2}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {t.about.credentials.map((c) => (
                  <span key={c} className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />{c}
                  </span>
                ))}
              </div>
              <div className="pt-2 flex gap-4 flex-wrap">
                <Button asChild className="bg-gradient-primary rounded-xl shadow-elegant font-semibold px-6">
                  <Link to="/about">{lang === "ar" ? "السيرة الكاملة" : lang === "fr" ? "Biographie complète" : "Full Biography"} <ArrowRight className="ms-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl px-6">
                  <Link to="/booking">{t.nav.book}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-padding bg-secondary/30">
        <div className="container-xl">
          <div className="mb-16 flex flex-col items-center text-center">
            <span className="badge-pill bg-primary/10 text-primary border border-primary/20 mb-4">{t.services.badge}</span>
            <h2 className="font-display text-4xl font-bold md:text-5xl max-w-2xl">{t.services.title}</h2>
            <p className="mt-4 max-w-xl text-muted-foreground text-lg">{t.services.desc}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.list.map((s, i) => {
              const Icon = serviceIcons[i];
              const colors = ["from-blue-600 to-indigo-600","from-teal-500 to-cyan-600","from-violet-600 to-purple-600","from-emerald-500 to-green-600","from-rose-500 to-pink-600","from-amber-500 to-orange-600"];
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="service-card group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-card cursor-pointer"
                >
                  <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${colors[i]} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15`} />
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colors[i]} text-white shadow-soft transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {s.duration}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" variant="outline" className="rounded-xl px-8 h-12 font-semibold">
              <Link to="/services">{lang === "ar" ? "عرض كل الخدمات" : lang === "fr" ? "Voir tous les services" : "View All Services"} <ArrowRight className="ms-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WHY US + TESTIMONIALS */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="badge-pill bg-mint/20 text-mint-foreground border border-mint/30">
                {t.home.whyUsBadge}
              </span>
              <h2 className="font-display text-4xl font-bold md:text-5xl">
                {t.home.whyUsTitle}
                <br /><span className="text-gradient">{t.home.whyUsAccent}</span>
              </h2>
              <div className="space-y-5 pt-4">
                {whyUs.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                    <div className="mt-1 h-10 w-10 shrink-0 rounded-xl bg-accent/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              {testimonials.map((t2, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative rounded-2xl border border-border bg-card p-7 shadow-card">
                  <Quote className="absolute end-6 top-6 h-8 w-8 text-muted/40 fill-current" />
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t2.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">"{t2.text}"</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">{t2.author[0]}</div>
                    <div>
                      <div className="text-sm font-semibold">{t2.author}</div>
                      <div className="text-xs text-muted-foreground">{t2.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="relative overflow-hidden bg-gradient-hero noise">
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="container-xl relative z-10 py-24 text-center">
            <h2 className="font-display text-4xl font-bold text-white md:text-6xl mb-6">
              {t.home.ctaTitle}
              {" "}<span className="text-accent">{t.home.ctaAccent}</span>
            </h2>
            <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto">
              {t.home.ctaDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-10 bg-accent hover:bg-accent/90 text-white shadow-elegant rounded-xl text-base font-semibold">
                <Link to="/booking"><CalendarCheck className="me-2 h-5 w-5" />{t.hero.cta1}</Link>
              </Button>
              <Button asChild size="lg" className="h-14 px-10 bg-white/15 border border-white/25 hover:bg-white/25 text-white rounded-xl text-base font-semibold backdrop-blur-sm">
                <Link to="/contact">{t.nav.contact} <ArrowRight className="ms-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
