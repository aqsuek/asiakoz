import Icon from "./Icon";
import { REVIEWS } from "../data/content";

export default function Reviews() {
  return (
    <section id="reviews" className="py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Отзывы наших пациентов</h2>
          <a
            href="/otzyvy-asiakoz-almaty/"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Все отзывы и видео →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {REVIEWS.map((review) => (
            <article key={review.name} className="card-premium flex flex-col p-6">
              <Icon name="quote" className="h-8 w-8 text-brand/50" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted sm:text-base">
                «{review.text}»
              </p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{review.name}</p>
                  <p className="text-xs text-ink-faint">{review.city}</p>
                </div>
                <div className="flex gap-0.5 text-amber-400" aria-label={`Оценка ${review.rating} из 5`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Icon key={i} name="star" className="h-4 w-4 fill-current" strokeWidth={0} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
