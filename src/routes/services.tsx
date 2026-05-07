import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/LanguageProvider";
import {
  Stethoscope,
  Microscope,
  Syringe,
  Activity,
  HeartPulse,
  Baby,
  ArrowRight,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Medical Services — Dr. Abdellatif Tarek" },
      {
        name: "description",
        content:
          "Explore our full range of modern surgical services: digestive surgery, hernia repair, and more.",
      },
    ],
  }),
  component: Services,
});

const serviceIcons = [
  Stethoscope, Microscope, Syringe, Activity, HeartPulse, Baby
];

const colors = [
  "from-blue-600 to-indigo-600",
  "from-teal-500 to-cyan-600",
  "from-violet-600 to-purple-600",
  "from-emerald-500 to-green-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-yellow-500",
];

function Services() {
  const { t, lang } = useLang();

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-hero noise pt-32 pb-24">
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="container-xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="badge-pill bg-white/10 text-white/70 border border-white/20 mb-6">
              {t.services.badge}
            </span>
            <h1 className="font-display text-5xl font-bold text-white md:text-7xl">
              {t.services.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/65 leading-relaxed">
              {t.services.desc}
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="h-12 px-8 bg-accent text-white hover:bg-accent/90 rounded-xl font-semibold shadow-elegant">
                <Link to="/booking">{t.services.cta} <ArrowRight className="mx-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
            {t.services.list.map((s, i) => {
              const Icon = serviceIcons[i % serviceIcons.length];
              const color = colors[i % colors.length];
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.06, duration: 0.6 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-400 hover:shadow-elegant hover:-translate-y-2"
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />

                  <div className="p-8">
                    <div className="flex items-start gap-5">
                      <div className={`h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-xl font-bold">{s.title}</h3>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1">
                            <Clock className="h-3.5 w-3.5" />
                            {s.duration}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button asChild variant="outline" className="w-full rounded-xl group-hover:bg-secondary transition-colors">
                        <Link to="/booking">
                          {t.services.cta} <ChevronRight className="mx-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding bg-secondary/30">
        <div className="container-xl text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-4">
            {t.services.helpTitle}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t.services.helpDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 bg-gradient-primary rounded-xl shadow-elegant font-semibold text-white">
              <Link to="/booking">{t.services.cta}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-xl font-semibold">
              <Link to="/contact">{t.nav.contact}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
