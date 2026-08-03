import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-200 whitespace-nowrap'

const variants = {
  primary: 'bg-accent text-bg hover:bg-white',
  secondary: 'bg-transparent text-ink border border-border hover:border-accent/60',
  ghost: 'bg-transparent text-ink hover:text-accent',
}

const sizes = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon = true,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <motion.span
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={classes}
    >
      {children}
      {icon && (
        <ArrowUpRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
    </motion.span>
  )

  if (to) {
    return (
      <Link to={to} className="group inline-block" {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-block"
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className="group inline-block" {...props}>
      {content}
    </button>
  )
}
