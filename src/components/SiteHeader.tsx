import { Link, useRouterState, useLoaderData, useRouter } from "@tanstack/react-router";
import { Stethoscope, Menu, X, Moon, Sun, Phone, ChevronRight, Globe, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useLang } from "@/components/LanguageProvider";
import type { Lang } from "@/lib/i18n";
import { logoutFn } from "@/lib/auth";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇩🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, t, setLang } = useLang();
  const router = useRouter();
  const routerState = useRouterState();
  const auth = (useLoaderData({ from: "__root__" }) as any) || { isAuthenticated: false };
  const isHome = routerState.location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await (logoutFn as any)();
      await router.invalidate();
      router.navigate({ to: "/login" });
      setOpen(false);
    } catch (err) {
      // Fallback
      window.location.href = "/login";
    }
  };

  const isTransparent = isHome && !scrolled;
  const headerBg = isTransparent ? "bg-transparent border-transparent" : "glass border-border/50 shadow-glass";

  const nav = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/services", label: t.nav.services },
    { to: "/testimonials", label: t.nav.testimonials },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  const currentLang = LANGS.find((l) => l.code === lang)!;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 border ${headerBg}`}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-white shadow-elegant transition-transform group-hover:scale-105">
              <Stethoscope className="h-5 w-5" />
            </span>
            <div>
              <span className={`font-display text-base font-bold tracking-tight leading-none block transition-colors ${isTransparent ? "text-white" : "text-foreground"}`}>
                Dr. Abdellatif Tarek
              </span>
              <span className={`text-[10px] font-medium tracking-widest uppercase transition-colors ${isTransparent ? "text-white/60" : "text-muted-foreground"}`}>
                {lang === "ar" ? "جراح عام" : lang === "fr" ? "Chirurgien Général" : "General Surgeon"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${isTransparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                activeProps={{ className: `rounded-lg px-4 py-2 text-sm font-semibold ${isTransparent ? "text-white bg-white/15" : "text-foreground bg-secondary"}` }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isTransparent ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                <Globe className="h-4 w-4" />
                <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 glass rounded-xl border border-border/50 shadow-glass p-1 min-w-[140px] animate-fade-up z-10">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-start transition-colors hover:bg-secondary ${lang === l.code ? "bg-secondary font-semibold" : ""}`}
                    >
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
              <div className={`h-2 w-2 rounded-full ${auth.isAuthenticated ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {auth.isAuthenticated ? (auth.role === "admin" ? "Admin Mode" : `Patient: ${auth.user?.name?.split(" ")[0]}`) : "Guest Mode"}
              </span>
            </div>

            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={`h-9 w-9 rounded-lg ${isTransparent ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Link to={auth.isAuthenticated ? (auth.role === "admin" ? "/admin" : "/profile") : "/login"}>
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              {auth.isAuthenticated && (
                <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="glass rounded-xl border border-border/50 shadow-glass p-2 min-w-[150px]">
                    <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50 mb-1">
                      {auth.role === "admin" ? "Admin" : "Patient"}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {auth.isAuthenticated && auth.role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className={`rounded-xl border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all ${isTransparent ? "bg-white/10" : ""}`}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`h-9 w-9 rounded-lg ${isTransparent ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Sun className="h-4 w-4 scale-100 dark:scale-0 transition-transform duration-200" />
              <Moon className="absolute h-4 w-4 scale-0 dark:scale-100 transition-transform duration-200" />
            </Button>
            <Button asChild size="sm" className="bg-gradient-primary text-white shadow-elegant rounded-xl font-semibold px-5">
              <Link to="/booking">
                {t.nav.book} <ChevronRight className="ms-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1 rounded-lg p-2 text-sm transition-colors ${isTransparent ? "text-white/70 hover:bg-white/10" : "text-muted-foreground hover:bg-secondary"}`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs">{currentLang.code.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 glass rounded-xl border border-border/50 shadow-glass p-1 min-w-[130px] animate-fade-up z-10">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-start hover:bg-secondary ${lang === l.code ? "bg-secondary font-semibold" : ""}`}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost" size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`h-9 w-9 ${isTransparent ? "text-white/70 hover:bg-white/10" : ""}`}
            >
              <Sun className="h-4 w-4 scale-100 dark:scale-0" />
              <Moon className="absolute h-4 w-4 scale-0 dark:scale-100" />
            </Button>
            <button
              onClick={() => setOpen(!open)}
              className={`p-2 rounded-lg transition-colors ${isTransparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-secondary"}`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="glass mt-2 flex flex-col gap-1 rounded-2xl border border-border/50 p-3 shadow-glass md:hidden animate-fade-up">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                activeProps={{ className: "rounded-xl px-4 py-3 text-sm font-semibold bg-secondary text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2 space-y-2">
              <Button asChild className="w-full bg-gradient-primary rounded-xl font-semibold">
                <Link to="/booking" onClick={() => setOpen(false)}>{t.nav.book}</Link>
              </Button>
              {auth.isAuthenticated && (
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl text-destructive border-destructive/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
