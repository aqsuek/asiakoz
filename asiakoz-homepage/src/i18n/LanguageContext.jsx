import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations";
import { branchTranslationOverrides } from "./branchOverrides";
import { BRANCH } from "../lib/branch";

const LanguageContext = createContext(null);

function detectInitialLang() {
  try {
    const saved = localStorage.getItem("asiakoz-lang");
    if (saved === "kz" || saved === "ru") return saved;
  } catch {
    /* ignore */
  }
  return "kz";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLang);
  const activeTranslations = useMemo(() => {
    const override = branchTranslationOverrides[BRANCH];
    if (!override) return translations;

    const mergeDeep = (base, patch) => {
      if (Array.isArray(base) || Array.isArray(patch)) return patch ?? base;
      if (
        base &&
        patch &&
        typeof base === "object" &&
        typeof patch === "object"
      ) {
        const out = { ...base };
        for (const key of Object.keys(patch)) {
          out[key] = mergeDeep(base[key], patch[key]);
        }
        return out;
      }
      return patch ?? base;
    };

    return {
      kz: mergeDeep(translations.kz, override.kz || {}),
      ru: mergeDeep(translations.ru, override.ru || {}),
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("asiakoz-lang", lang);
    } catch {
      /* ignore */
    }
    const t = activeTranslations[lang];
    document.documentElement.lang = t.htmlLang;
    document.title = t.seoTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t.seoDescription);
  }, [lang, activeTranslations]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: activeTranslations[lang],
    }),
    [lang, activeTranslations]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
