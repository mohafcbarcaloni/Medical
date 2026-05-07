import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang } from "@/lib/i18n";

type AnyT = (typeof translations)[Lang];
type CtxType = { lang: Lang; t: AnyT; setLang: (l: Lang) => void };
const Ctx = createContext<CtxType>({} as CtxType);

function detectLang(): Lang {
  if (typeof window === "undefined") return "fr";
  const stored = localStorage.getItem("lang") as Lang | null;
  if (stored && ["ar", "fr", "en"].includes(stored)) return stored;
  const browser = navigator.language.slice(0, 2).toLowerCase();
  if (browser === "ar") return "ar";
  if (browser === "fr") return "fr";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  useEffect(() => {
    const t = translations[lang];
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = translations[lang];

  return <Ctx.Provider value={{ lang, t, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}
