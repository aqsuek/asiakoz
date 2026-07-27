import Logo from "./Logo";
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC } from "../data/contacts";
import { homeUrl } from "../lib/routes";

import { IS_LASER } from "../lib/branch";

const LINKS = IS_LASER
  ? [
      { key: "about", hash: "#promo" },
      { key: "services", hash: "#suitability" },
      { key: "doctors", hash: "#doctors" },
      { key: "reviews", hash: "#reviews" },
      { key: "faq", hash: "#faq" },
      { key: "contacts", hash: "#contacts" },
    ]
  : [
      { key: "about", hash: "#about" },
      { key: "services", hash: "#services" },
      { key: "doctors", hash: "#doctors" },
      { key: "reviews", hash: "#reviews" },
      { key: "contacts", hash: "#contacts" },
    ];

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-ink/[0.06] bg-white pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-10 sm:pb-12 sm:pt-12">
      <div className="section-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {t.footer.tagline}
            </p>
            <a
              href={CLINIC.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:border-brand hover:text-brand"
              aria-label="Instagram"
            >
              <Icon name="instagram" className="h-4 w-4" />
            </a>
          </div>

          <nav className="flex flex-col gap-2">
            {LINKS.map((link) => (
              <a
                key={link.hash}
                href={homeUrl(link.hash)}
                className="text-sm text-ink-muted transition-colors hover:text-brand"
              >
                {t.nav[link.key]}
              </a>
            ))}
          </nav>

          <div className="space-y-2 text-sm text-ink-muted">
            <p className="font-medium text-ink">{CLINIC.address}</p>
            {CLINIC.phones.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className="block font-semibold text-brand hover:underline"
              >
                {phone.display}
              </a>
            ))}
            <a
              href={CLINIC.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-brand"
            >
              {CLINIC.instagram.handle}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-ink/[0.06] pt-6 text-center">
          <p className="text-xs leading-relaxed text-ink-faint">{t.footer.note}</p>
          <p className="mt-2 text-xs text-ink-faint">
            © {new Date().getFullYear()} {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
