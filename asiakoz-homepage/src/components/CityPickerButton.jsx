import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { useCity } from "../context/CityContext";
import {
  NETWORK_BRANCHES,
  branchCityName,
  isComingSoon,
} from "../data/branches";
import { IS_HOME } from "../lib/branch";

export default function CityPickerButton({ className = "" }) {
  const { lang, t } = useLang();
  const { cityId, branch, setCityId } = useCity();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (!IS_HOME) return null;

  const currentName = branchCityName(branch, lang);

  return (
    <div className={`relative shrink-0 ${className}`} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 max-w-[7.5rem] items-center gap-1.5 rounded-full border border-brand/25 bg-brand-soft/70 px-2.5 text-[12px] font-bold text-ink shadow-soft transition-colors hover:border-brand/40 sm:max-w-[9.5rem] sm:px-3 sm:text-[13px]"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t.cityPicker?.label}
      >
        <Icon name="map" className="h-3.5 w-3.5 shrink-0 text-brand sm:h-4 sm:w-4" />
        <span className="truncate">{currentName}</span>
        <Icon
          name="chevron"
          className={`h-3 w-3 shrink-0 text-ink-faint transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-ink/25 sm:hidden"
            aria-label="Close city picker"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-3 bottom-3 z-[70] rounded-[1.25rem] border border-ink/[0.06] bg-white p-3 shadow-float sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-[calc(100%+0.5rem)] sm:w-64 sm:p-2">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {t.cityPicker?.label}
            </p>
            <ul role="listbox" className="grid gap-1" aria-label={t.cityPicker?.label}>
              {NETWORK_BRANCHES.map((item) => {
                const selected = item.id === cityId;
                return (
                  <li key={item.id} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        setCityId(item.id);
                        setOpen(false);
                      }}
                      className={`inline-flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-sm font-semibold transition-colors ${
                        selected
                          ? "bg-brand text-white"
                          : "text-ink hover:bg-surface-muted"
                      }`}
                    >
                      <span>{branchCityName(item, lang)}</span>
                      {isComingSoon(item) ? (
                        <span
                          className={`text-xs ${selected ? "text-white/80" : "text-brand"}`}
                        >
                          {t.cityPicker?.soon}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
