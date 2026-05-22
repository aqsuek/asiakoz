import SectionHeading from "./SectionHeading";
import { DOCTORS } from "../data/content";

export default function Doctors() {
  return (
    <section id="doctors" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-soft blur-3xl"
        aria-hidden
      />

      <div className="section-container relative">
        <SectionHeading
          label="Команда"
          title="Врачи из Турции"
          subtitle="Высококвалифицированные офтальмохирурги с международным опытом"
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {DOCTORS.map((doctor) => (
            <a
              key={doctor.name}
              href={doctor.href}
              className="card-premium group flex flex-col overflow-hidden border-brand/15"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-brand/15 via-brand-soft to-white sm:aspect-[5/6]">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-full w-full object-contain object-center p-3 transition-transform duration-300 group-hover:scale-[1.02] sm:p-4"
                  loading="lazy"
                  width="400"
                  height="500"
                />
              </div>
              <div className="relative flex flex-1 flex-col border-t border-brand/10 bg-gradient-to-b from-white to-brand-soft/40 p-5">
                <h3 className="text-lg font-bold text-ink group-hover:text-brand">{doctor.name}</h3>
                <p className="mt-1 text-sm font-semibold text-brand">{doctor.role}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {doctor.specialty}
                </p>
                <span className="mt-3 text-sm font-semibold text-brand">Подробнее →</span>
                <span
                  className="absolute bottom-4 right-4 text-lg"
                  title="Специалист из Турции"
                  aria-hidden
                >
                  🇹🇷
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-10 text-center">
          <a
            href="/doctors/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-brand-dark"
          >
            Все врачи клиники →
          </a>
        </p>
      </div>
    </section>
  );
}
