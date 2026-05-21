import { DOCTORS } from "../data/content";

export default function Doctors() {
  return (
    <section id="doctors" className="bg-brand-soft/40 py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Врачи из Турции</h2>
          <p className="mt-3 text-ink-muted">
            Высококвалифицированные офтальмохирурги с международным опытом
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {DOCTORS.map((doctor) => (
            <a
              key={doctor.name}
              href={doctor.href}
              className="card-premium group overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-52 w-full shrink-0 bg-slate-100 sm:h-auto sm:w-36">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                    width="288"
                    height="360"
                  />
                </div>
                <div className="relative flex flex-1 flex-col p-5">
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
              </div>
            </a>
          ))}
        </div>

        <p className="mt-10 text-center">
          <a href="/doctors/" className="text-sm font-semibold text-brand hover:underline">
            Все врачи клиники →
          </a>
        </p>
      </div>
    </section>
  );
}
