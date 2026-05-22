import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { HERO_FEATURES, WHATSAPP_URL } from "../data/content";

export default function Hero() {
  return (
    <section className="relative min-h-[min(92svh,780px)] w-full overflow-hidden sm:min-h-[640px] lg:min-h-[680px]">
      <div className="absolute inset-0 bg-[#0a6d82]">
        <video
          className="hero-video-bg motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/clinic-1.png"
          aria-hidden
        >
          <source src="/images/videos/hero.mp4" type="video/mp4" />
        </video>
        <img
          src="/images/clinic-1.png"
          alt=""
          className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand/40 via-brand/50 to-[#085a6b]/90" />
      </div>

      <div className="section-container relative z-10 flex min-h-[inherit] flex-col items-center justify-center px-4 py-20 text-center text-white sm:py-24 lg:py-28">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Турецкая офтальмология
        </p>

        <h1 className="max-w-4xl text-[1.75rem] font-extrabold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          Турецкая глазная клиника
          <span className="mt-2 block text-white/95">в Алматы и Актау</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
          Сложные операции на глазах, диагностика и лечение у офтальмохирургов с
          международным опытом.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-primary"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Записаться в WhatsApp
          </a>
          <a href="/uslugi/" className="btn-hero-outline">
            Смотреть услуги
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-10 max-w-xl text-sm leading-relaxed text-white/80 sm:mt-12">
          Хотите избавиться от очков и линз? Запишитесь на консультацию — подберём
          лечение под ваш случай.
        </p>

        <ul className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3 sm:gap-4">
          {HERO_FEATURES.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm font-medium text-white/95 backdrop-blur-sm"
            >
              <Icon name="badge" className="h-4 w-4 shrink-0 text-white" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
