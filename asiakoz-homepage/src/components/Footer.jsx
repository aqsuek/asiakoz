import Logo from "./Logo";
import Icon from "./Icon";
import { homeOverrides } from "../i18n/homeCopy";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, clinicAddress } from "../data/contacts";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { showsPhoneCta } from "../lib/contactPolicy";
import { NETWORK_BRANCHES } from "../data/branches";
import { CORPORATE_NAV_ITEMS, navItemHref } from "../lib/siteNav";

export default function Footer() {
  const { lang, t } = useLang();
  const navLabels = homeOverrides[lang === "kz" ? "kz" : "ru"].nav;
  const showPhone = showsPhoneCta();

  return (
    <footer
      className={`border-t border-ink/[0.06] bg-white pt-5 sm:pb-8 sm:pt-8 ${
        IS_LASER
          ? "pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
          : "pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-8"
      }`}
    >
      <div className="section-container">
        {IS_HOME ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
              <div>
                <Logo compact />
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink-muted">
                  {t.footer.tagline}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {NETWORK_BRANCHES.map((b) => (
                    <a
                      key={b.id}
                      href={b.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-ink/10 px-3 text-xs font-semibold text-ink-muted hover:border-brand hover:text-brand"
                    >
                      <Icon name="instagram" className="h-3.5 w-3.5" />
                      {b.instagram.handle}
                    </a>
                  ))}
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {CORPORATE_NAV_ITEMS.map((link) => (
                  <a
                    key={link.key}
                    href={navItemHref(link)}
                    className="py-1 text-sm text-ink-muted transition-colors hover:text-brand"
                  >
                    {navLabels[link.key]}
                  </a>
                ))}
                <a
                  href="/politika-konfidentsialnosti/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 text-sm text-ink-muted transition-colors hover:text-brand"
                >
                  {t.footer.privacy}
                </a>
              </nav>
            </div>
          </>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <div>
              <Logo />
              <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-ink-muted">
                {t.footer.tagline}
              </p>
              <a
                href={CLINIC.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:border-brand hover:text-brand"
                aria-label="Instagram"
              >
                <Icon name="instagram" className="h-4 w-4" />
              </a>
            </div>

            <nav className="flex flex-col gap-1.5">
              {CORPORATE_NAV_ITEMS.map((link) => (
                <a
                  key={link.key}
                  href={navItemHref(link)}
                  className="py-0.5 text-sm text-ink-muted transition-colors hover:text-brand"
                >
                  {navLabels[link.key]}
                </a>
              ))}
            </nav>

            <div className="space-y-1.5 text-sm text-ink-muted">
              <p className="font-medium text-ink">{clinicAddress(lang)}</p>
              {showPhone &&
                CLINIC.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="block py-0.5 font-semibold text-brand hover:underline"
                  >
                    {phone.display}
                  </a>
                ))}
              <a
                href={CLINIC.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-0.5 hover:text-brand"
              >
                {CLINIC.instagram.handle}
              </a>
            </div>
          </div>
        )}

        <div className="mt-5 border-t border-ink/[0.06] pt-3.5 text-center">
          <p className="text-xs leading-relaxed text-ink-faint">{t.footer.note}</p>
          <p className="mt-1.5 text-xs text-ink-faint">
            © {new Date().getFullYear()} {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
