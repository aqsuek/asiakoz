import { useEffect } from "react";
import { useLang } from "../i18n/LanguageContext";
import { doctorProfileUrl } from "../lib/routes";

/** Legacy SPA doctor route — redirect to full static profile page. */
export default function DoctorPage({ doctorId }) {
  const { lang, t } = useLang();

  useEffect(() => {
    const target = doctorProfileUrl(doctorId, lang);
    if (target) {
      window.location.replace(target);
      return;
    }
    window.location.replace(lang === "ru" ? "/doctors/" : "/kk/doctors/");
  }, [doctorId, lang]);

  return (
    <section className="section-container py-20 text-center">
      <p className="text-ink-muted">{t.news?.loading || "Жүктелуде…"}</p>
    </section>
  );
}
