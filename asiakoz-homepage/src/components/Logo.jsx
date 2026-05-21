export default function Logo({ className = "", showText = true }) {
  return (
    <a
      href="/"
      className={`group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3 ${className}`}
      title="AsiaKoz — глазная клиника"
      aria-label="AsiaKoz — на главную"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11">
        <img
          src="/images/logo.png"
          alt=""
          className="h-full w-full object-contain"
          width="44"
          height="44"
          decoding="async"
          aria-hidden
        />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-extrabold tracking-[0.14em] text-brand sm:text-base">
            ASIAKOZ
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-faint sm:text-[11px]">
            Eye Clinic
          </span>
        </span>
      )}
    </a>
  );
}
