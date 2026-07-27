export default function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
  className = "",
}) {
  const alignClass =
    align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center mx-auto";

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {label && <p className="section-eyebrow mb-4">{label}</p>}
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
