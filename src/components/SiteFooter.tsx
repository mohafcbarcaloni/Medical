import { Link } from "@tanstack/react-router";
import { Stethoscope, Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

export function SiteFooter() {
  const { t, lang } = useLang();

  const clinicLinks = [
    { label: t.nav.about, to: "/about" },
    { label: t.nav.services, to: "/services" },
    { label: t.nav.testimonials, to: "/testimonials" },
    { label: t.nav.book, to: "/booking" },
  ];

  return (
    <footer className="mt-0 border-t border-border/50" style={{ backgroundColor: "#0b1120", color: "rgba(255,255,255,0.7)" }}>
      <div className="container-xl py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1.5fr]">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-white shadow-elegant">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <span className="font-display text-base font-bold text-white block">Dr. Abdellatif Tarek</span>
                <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {lang === "ar" ? "جراح عام" : lang === "fr" ? "Chirurgien Général" : "General Surgeon"}
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t.footer.desc}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              {lang === "ar" ? "الصفحات" : lang === "fr" ? "Navigation" : "Pages"}
            </h4>
            <ul className="space-y-3">
              {clinicLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="flex items-center gap-1 text-sm transition-colors hover:text-white group" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              {lang === "ar" ? "التواصل" : lang === "fr" ? "Contact" : "Contact"}
            </h4>
            <ul className="space-y-4">
              {[
                { icon: Phone, text: "+213 699 693 509", href: "tel:+213699693509" },
                { icon: Mail, text: "contact@tarek-medical.dz", href: "mailto:contact@tarek-medical.dz" },
                { icon: MapPin, text: t.footer.address },
                { icon: Clock, text: lang === "ar" ? "الأحد–الخميس · 08:00–19:00" : lang === "fr" ? "Lun–Ven · 08:00–19:00" : "Mon–Fri · 08:00–19:00" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <item.icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#14b8a6" }} />
                  {item.href ? (
                    <a href={item.href} className="hover:text-white transition-colors">{item.text}</a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container-xl flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row" style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>© {new Date().getFullYear()} {t.footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
