import Logo from "./Logo";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { BRANCHES, NAV_LINKS, WHATSAPP_URL } from "../data/content";

export default function Footer() {
  return (
    <footer id="contacts" className="site-footer border-t border-slate-100 bg-white pb-28 pt-14 sm:pb-32">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Logo />
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/asiakoz.clinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-ink-muted transition-all hover:border-brand hover:bg-brand-soft hover:text-brand"
                aria-label="Instagram"
              >
                <Icon name="instagram" className="h-4 w-4" />
              </a>
            </div>
            <nav className="mt-6 flex flex-col gap-2 lg:hidden">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-ink-muted hover:text-brand">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {BRANCHES.map((branch) => (
              <div key={branch.city} className="card-premium overflow-hidden">
                <img
                  src={branch.image}
                  alt={`Филиал AsiaKoz — ${branch.city}`}
                  className="h-32 w-full object-cover"
                  loading="lazy"
                  width="600"
                  height="200"
                />
                <div className="p-5">
                  <h3 className="font-bold text-ink">{branch.city}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{branch.address}</p>
                  <a
                    href={branch.phoneHref}
                    className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
                  >
                    {branch.phone}
                  </a>
                  {branch.phoneAlt && (
                    <a
                      href={branch.phoneAltHref}
                      className="ml-2 inline-block text-sm text-ink-muted hover:text-brand"
                    >
                      · {branch.phoneAlt}
                    </a>
                  )}
                  <p className="mt-1 text-xs text-ink-faint">{branch.hours}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={branch.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-brand hover:underline"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={branch.gis}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-ink-muted hover:text-brand"
                    >
                      2ГИС
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-ink">Есть вопросы?</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Напишите нам — подберём врача и удобное время приёма.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 w-full sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Написать в WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-bottom mt-12 border-t border-slate-100 pt-6 text-center">
          <p className="footer-disclaimer text-xs text-ink-faint">
            Имеются противопоказания. Необходима консультация специалиста.
          </p>
          <p className="footer-copy mt-2 text-xs text-ink-faint">
            © {new Date().getFullYear()} AsiaKoz. Алматы, Актау.
          </p>
        </div>
      </div>
    </footer>
  );
}
