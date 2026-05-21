export default function Logo({ className = "" }) {
  return (
    <a href="/" className={`inline-flex items-center gap-2.5 ${className}`} title="AsiaKoz">
      <img
        src="/images/logo-long.png"
        alt="AsiaKoz Eye Clinic"
        className="h-9 w-auto max-w-[160px] object-contain sm:h-10"
        width="320"
        height="80"
        decoding="async"
      />
    </a>
  );
}
