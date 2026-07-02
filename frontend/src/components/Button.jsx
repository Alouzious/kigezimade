import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

const variants = {
  primary:
    'bg-gradient-to-br from-forest to-forest-mid text-cream hover:from-forest-mid hover:to-forest-light shadow-md shadow-forest/25 hover:shadow-lg hover:shadow-forest/30',
  secondary:
    'bg-gradient-to-br from-bead to-bead-light text-cream hover:from-bead-light hover:to-amber shadow-md shadow-bead/30 hover:shadow-lg hover:shadow-bead/35',
  outline:
    'border-2 border-forest/80 text-forest hover:bg-forest hover:text-cream bg-parchment/50 backdrop-blur-sm',
  ghost:
    'text-forest hover:bg-forest/8',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  to,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
    variants[variant],
    sizes[size],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
