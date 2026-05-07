import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/LanguageProvider";
import { GraduationCap, Award, Briefcase, HeartPulse, Stethoscope, ArrowRight, CheckCircle2, Star, Quote, Scissors } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Dr. Abdellatif Tarek, Chirurgien Général" },
      { name: "description", content: "Chirurgien général diplômé en 1994 avec 30+ ans d'expérience. Chirurgie digestive, hernies, paroi abdominale." },
    ],
  }),
  component: About,
});

function About() {
  const { t, lang } = useLang();

  const timeline = [
    { year: "1994", icon: GraduationCap, color: "from-blue-600 to-indigo-600", title: lang === "ar" ? "شهادة الطب العام" : lang === "fr" ? "Diplôme de Médecine" : "Medical Degree", desc: lang === "ar" ? "تخرج من كلية الطب بتخصص الجراحة العامة عام 1994." : lang === "fr" ? "Obtention du diplôme de fin d'études médicales en chirurgie générale." : "Graduation in General Medicine / General Surgery, 1994." },
    { year: "1998", icon: Briefcase, color: "from-teal-500 to-cyan-600", title: lang === "ar" ? "التخصص في الجراحة" : lang === "fr" ? "Spécialisation Chirurgicale" : "Surgical Specialization", desc: lang === "ar" ? "أتم تدريبه المتخصص في الجراحة العامة والجراحة الهضمية." : lang === "fr" ? "Achèvement de la formation spécialisée en chirurgie générale et digestive." : "Completion of specialized training in general and digestive surgery." },
    { year: "2005", icon: Award, color: "from-amber-500 to-orange-600", title: lang === "ar" ? "اعتراف وطني" : lang === "fr" ? "Reconnaissance Nationale" : "National Recognition", desc: lang === "ar" ? "أصبح جراحاً معترفاً به على المستوى الوطني في جراحة الفتق وجدار البطن." : lang === "fr" ? "Reconnaissance nationale pour l'expertise en chirurgie des hernies et de la paroi abdominale." : "Nationally recognized expertise in hernia and abdominal wall surgery." },
    { year: "2010", icon: Scissors, color: "from-emerald-500 to-green-600", title: lang === "ar" ? "افتتاح عيادة خاصة" : lang === "fr" ? "Cabinet Privé" : "Private Practice", desc: lang === "ar" ? "افتتاح عيادته الخاصة لتقديم الرعاية الجراحية الشخصية بأعلى المعايير." : lang === "fr" ? "Ouverture d'un cabinet privé dédié à la chirurgie générale de qualité." : "Opening of a private practice dedicated to high-quality general surgery." },
    { year: lang === "ar" ? "اليوم" : lang === "fr" ? "Aujourd'hui" : "Today", icon: HeartPulse, color: "from-violet-600 to-purple-600", title: lang === "ar" ? "+5000 عملية جراحية" : lang === "fr" ? "5 000+ Interventions" : "5,000+ Procedures", desc: lang === "ar" ? "موثوق به من آلاف المرضى في جراحة الجهاز الهضمي والفتق وجدار البطن." : lang === "fr" ? "Reconnu par des milliers de patients pour la chirurgie digestive, des hernies et de la paroi abdominale." : "Trusted by thousands of patients for digestive, hernia, and abdominal wall surgery." },
  ];

  const values = [
    { icon: "🎯", title: lang === "ar" ? "الدقة" : lang === "fr" ? "Précision" : "Precision", desc: lang === "ar" ? "كل تشخيص مبني على الأدلة والتحليل السريري الدقيق." : lang === "fr" ? "Chaque diagnostic repose sur des preuves et un raisonnement clinique rigoureux." : "Every diagnosis backed by evidence and careful clinical reasoning." },
    { icon: "❤️", title: lang === "ar" ? "التعاطف" : lang === "fr" ? "Compassion" : "Compassion", desc: lang === "ar" ? "نعامل كل مريض كإنسان كامل، لا مجرد حالة طبية." : lang === "fr" ? "Nous traitons chaque patient comme une personne entière, pas seulement une pathologie." : "We treat every patient as a whole person, not just a case." },
    { icon: "🔬", title: lang === "ar" ? "الابتكار" : lang === "fr" ? "Innovation" : "Innovation", desc: lang === "ar" ? "توظيف أحدث التقنيات الجراحية لتحقيق أفضل النتائج." : lang === "fr" ? "Adoption continue des techniques chirurgicales les plus récentes." : "Continuously adopting the latest surgical techniques for better outcomes." },
    { icon: "🤝", title: lang === "ar" ? "الشراكة" : lang === "fr" ? "Partenariat" : "Partnership", desc: lang === "ar" ? "الصحة تُبنى عبر ثقة حقيقية بين الطبيب والمريض." : lang === "fr" ? "La santé se construit sur une confiance mutuelle et durable entre médecin et patient." : "Health is built through ongoing trust between doctor and patient." },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero noise pt-32 pb-24">
        <div className="absolute right-1/3 top-1/4 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="container-xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <span className="badge-pill bg-white/10 text-white/70 border border-white/20 mb-6">{t.about.badge}</span>
            <h1 className="font-display text-5xl font-bold text-white md:text-7xl">
              {lang === "ar" ? "الدكتور عبد اللطيف" : "Dr. Abdellatif"}<br />
              <span className="text-accent">{lang === "ar" ? "طارق" : "Tarek"}</span>
            </h1>
            <p className="mt-4 text-accent font-semibold text-xl">
              {t.about.subtitle}
            </p>
            <p className="mt-4 max-w-2xl text-lg text-white/65 leading-relaxed">{t.about.bio1}</p>
          </motion.div>
        </div>
      </section>

      {/* PROFILE */}
      <section className="section-padding bg-background">
        <div className="container-xl">
          <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.6fr]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="sticky top-28">
              <div className="relative rounded-3xl overflow-hidden shadow-elegant h-[500px]">
                <img src="/doctor.png" alt="Dr. Abdellatif Tarek" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="font-display text-2xl font-bold text-white">Dr. Abdellatif Tarek</div>
                  <div className="text-white/65 text-sm mt-1">{t.about.subtitle}</div>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest">
                  {lang === "ar" ? "المؤهلات" : lang === "fr" ? "Accréditations" : "Credentials"}
                </h3>
                {t.about.credentials.map((c) => (
                  <div key={c} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />{c}
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="space-y-12">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
                <h2 className="font-display text-4xl font-bold md:text-5xl">
                  {lang === "ar" ? "فلسفة الرعاية" : lang === "fr" ? "Une philosophie de soins" : "A philosophy of"}{" "}
                  <span className="text-gradient">{lang === "ar" ? "الحقيقية" : lang === "fr" ? "authentique" : "genuine care"}</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{t.about.bio2}</p>
                <p className="text-muted-foreground leading-relaxed">{t.about.bio3}</p>
                <blockquote className="border-s-4 border-accent ps-5 italic text-muted-foreground">
                  {lang === "ar" ? "\"أولويتي الأولى هي سلامة المريض وراحته. كل قرار جراحي يُبنى على أدق المعطيات وأعلى معايير الجودة.\"" : lang === "fr" ? "\"La sécurité, le confort et le bien-être de mes patients sont au cœur de ma pratique.\"" : "\"The safety, comfort and well-being of my patients are at the heart of my practice.\""}
                  <div className="mt-2 text-sm font-semibold text-foreground">— Dr. Abdellatif Tarek</div>
                </blockquote>
              </motion.div>

              {/* Timeline */}
              <div>
                <h3 className="font-display text-2xl font-bold mb-8">
                  {lang === "ar" ? "المسيرة المهنية" : lang === "fr" ? "Parcours Professionnel" : "Professional Journey"}
                </h3>
                <div className="relative">
                  <div className="timeline-line" />
                  <ul className="space-y-6 ps-14">
                    {timeline.map((item, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                        <span className={`absolute -start-14 top-2 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-soft`}>
                          <item.icon className="h-5 w-5" />
                        </span>
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:border-accent/30 hover:shadow-elegant hover:-translate-y-1 duration-300">
                          <div className="text-xs font-bold uppercase tracking-widest text-accent mb-2">{item.year}</div>
                          <div className="font-display text-lg font-semibold">{item.title}</div>
                          <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-padding bg-secondary/30">
        <div className="container-xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold">
              {lang === "ar" ? "القيم الأساسية" : lang === "fr" ? "Valeurs Fondamentales" : "Core Values"}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {lang === "ar" ? "كل قرار في العيادة يُبنى على أربع ركائز أساسية." : lang === "fr" ? "Chaque décision au cabinet est guidée par quatre engagements fondamentaux." : "Every decision at the clinic is guided by four fundamental commitments."}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-8 text-center shadow-card hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display text-xl font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-xl max-w-4xl text-center">
          <div className="mt-10">
            <Button asChild size="lg" className="bg-gradient-primary rounded-xl shadow-elegant font-semibold px-8 h-12">
              <Link to="/booking">{t.booking.submit} <ArrowRight className="ms-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
