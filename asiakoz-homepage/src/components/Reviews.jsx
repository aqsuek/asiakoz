import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { REVIEWS } from "../data/content";

export default function Reviews() {
  return (
    <section id="reviews" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            label="Отзывы"
            title="Отзывы наших пациентов"
            className="max-w-xl text-left sm:mx-0"
          />
          <a
            href="/otzyvy-asiakoz-almaty/"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/25 bg-brand-soft px-4 py-2 text-sm font-semibold text-brand transition-all hover:bg-brand hover:text-white"
          >
            Все отзывы и видео →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {REVIEWS.map((review) => (
            <article
              key={review.name}
              className="card-premium-tint flex flex-col border-l-4 border-l-brand p-6"
            >
              <Icon name="quote" className="h-8 w-8 text-brand" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted sm:text-base">
                «{review.text}»
              </p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-brand/10 pt-5">
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
