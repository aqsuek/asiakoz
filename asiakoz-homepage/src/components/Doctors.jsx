import SectionHeading from "./SectionHeading";
import { DOCTORS } from "../data/content";

const BRANCH_LABELS = {
  almaty: { label: "Алматы", className: "doctor-card-site__badge-almaty" },
  aktau: { label: "Ақтау", className: "doctor-card-site__badge-aktau" },
};

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {DOCTORS.map((doctor) => {
            const branch = BRANCH_LABELS[doctor.branch] ?? BRANCH_LABELS.almaty;

            return (
              <article key={doctor.name} className="doctor-card-site">
                <a href={doctor.href} className="doctor-card-site__inner group">
                  <div className="doctor-card-site__photo">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      loading="lazy"
                      width="400"
                      height="533"
                    />
                  </div>
                  <div className="doctor-card-site__body">
                    <div className="doctor-card-site__meta">
                      <span className="doctor-card-site__role">{doctor.role}</span>
                      <span className={branch.className}>{branch.label}</span>
                    </div>
                    <h3 className="doctor-card-site__name group-hover:text-brand">
                      {doctor.name}
                    </h3>
                    <div className="doctor-card-site__tags">
                      {doctor.tags.map((tag) => (
                        <span key={tag} className="doctor-card-site__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {doctor.note ? (
                      <p className="doctor-card-site__note">
                        <span className="font-semibold text-ink">Опыт:</span> {doctor.note}
                      </p>
                    ) : null}
                    <div className="doctor-card-site__action">Подробнее →</div>
                  </div>
                </a>
              </article>
            );
          })}
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
