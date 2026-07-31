import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations";
import { branchTranslationOverrides } from "./branchOverrides";
import { BRANCH } from "../lib/branch";

const LanguageContext = createContext(null);

function pathIsKk(pathname = "") {
  return pathname === "/kk" || pathname.startsWith("/kk/");
}

function detectInitialLang() {
  if (typeof window !== "undefined" && pathIsKk(window.location.pathname)) {
    return "kz";
  }
  // Non-/kk/ URLs are the RU canonical versions for SEO
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("asiakoz-lang");
      // Prefer URL language over stale localStorage when on canonical RU path
      if (!pathIsKk(window.location.pathname)) return "ru";
      if (saved === "kz" || saved === "ru") return saved;
    } catch {
      /* ignore */
    }
  }
  return "ru";
}

function withTrailingSlash(p) {
  if (!p || p === "/") return "/";
  return p.endsWith("/") ? p : `${p}/`;
}

/** Map current path between RU and /kk/ variants (Aktau: /aktau/ ↔ /kk/aqtau/). */
export function languagePath(lang, pathname = "") {
  const path = pathname || (typeof window !== "undefined" ? window.location.pathname : "/");
  const clean = path.split("?")[0].split("#")[0] || "/";
  if (lang === "kz") {
    if (pathIsKk(clean)) return withTrailingSlash(clean === "/kk" ? "/kk/" : clean);
    // RU Aktau canonical → KK marketing slug
    if (clean === "/aktau" || clean.startsWith("/aktau/")) {
      return withTrailingSlash(clean.replace(/^\/aktau/, "/kk/aqtau"));
    }
    if (clean === "/aqtau" || clean.startsWith("/aqtau/")) {
      return withTrailingSlash(clean.replace(/^\/aqtau/, "/kk/aqtau"));
    }
    if (clean === "/") return "/kk/";
    return `/kk${withTrailingSlash(clean)}`;
  }
  // ru
  if (!pathIsKk(clean)) return withTrailingSlash(clean);
  if (clean === "/kk/aqtau" || clean.startsWith("/kk/aqtau/") || clean === "/kk/aktau" || clean.startsWith("/kk/aktau/")) {
    return withTrailingSlash(clean.replace(/^\/kk\/(aqtau|aktau)/, "/aktau"));
  }
  const stripped = clean.replace(/^\/kk/, "") || "/";
  return withTrailingSlash(stripped);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);
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

  const setLang = (next) => {
    if (next !== "kz" && next !== "ru") return;
    if (typeof window !== "undefined") {
      const target = languagePath(next, window.location.pathname);
      const current = window.location.pathname;
      if (target !== current && target !== `${current}/` && `${target}` !== current) {
        // Crawlable language switch via real navigation
        window.location.assign(target + window.location.search + window.location.hash);
        return;
      }
    }
    setLangState(next);
  };

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
      languagePath,
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
