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
      {label && (
        <p className="section-label mb-3">{label}</p>
      )}
      <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-ink-muted">{subtitle}</p>}
    </div>
  );
}
