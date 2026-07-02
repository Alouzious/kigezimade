/**
 * Two-line hero headline: cream primary line + italic amber accent (line 2 unchanged style).
 */
export default function DisplayHeadline({
  line1,
  line2,
  className = '',
  size = 'hero',
}) {
  const sizes = {
    hero: 'text-[2rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    page: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    section: 'text-2xl sm:text-3xl md:text-4xl',
  }

  return (
    <h1 className={`heading-display ${sizes[size]} max-w-4xl text-balance ${className}`}>
      <span className="text-hero-primary">{line1}</span>
      {line2 && (
        <>
          <br />
          <span className="italic text-amber-light">{line2}</span>
        </>
      )}
    </h1>
  )
}
