import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, ArrowRight, MessageSquare } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Patient Testimonials — Dr. Abdellatif Tarek" },
      {
        name: "description",
        content: "Read stories from patients who have trusted Dr. Abdellatif Tarek with their surgical care.",
      },
    ],
  }),
  component: Testimonials,
});

function Testimonials() {
  const { t, lang } = useLang();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero noise pt-32 pb-24">
        <div className="absolute left-1/3 top-1/3 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="container-xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="badge-pill bg-white/10 text-white/70 border border-white/20 mb-6">
              {t.testimonials.badge}
            </span>
            <h1 className="font-display text-5xl font-bold text-white md:text-7xl">
              {t.testimonials.title}
            </h1>
            <p className="mt-5 text-lg text-white/65">
              {t.testimonials.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* GRID */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {t.testimonials.list.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass relative border-0 p-8 shadow-card transition-all hover:shadow-elegant hover:-translate-y-1 duration-300">
                  <Quote className="absolute end-8 top-8 h-10 w-10 text-accent/10 fill-current" />
                  <div className="flex gap-1 text-amber-400 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed italic text-muted-foreground">"{r.text}"</p>
                  <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-soft">
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{r.name}</div>
                      <div className="text-sm text-muted-foreground">{r.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container-xl">
          <div className="rounded-3xl bg-secondary/50 border border-border p-12 text-center shadow-soft">
            <MessageSquare className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold mb-4">
              {lang === "ar" ? "هل ترغب في مشاركة تجربتك؟" : lang === "fr" ? "Envie de partager votre expérience ?" : "Want to share your experience?"}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              {lang === "ar" ? "نحن نقدر رأي كل مريض. ملاحظاتك تساعدنا على تقديم أفضل رعاية ممكنة." : lang === "fr" ? "Nous apprécions chaque retour. Votre avis nous aide à offrir la meilleure qualité de soins possible." : "We value every patient's voice. Your feedback helps us maintain the highest standards of care."}
            </p>
            <Button asChild size="lg" className="bg-gradient-primary text-white rounded-xl shadow-elegant font-semibold px-8 h-12">
              <Link to="/contact">{t.nav.contact} <ArrowRight className="ms-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
