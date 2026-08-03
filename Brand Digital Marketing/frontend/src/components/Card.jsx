import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={
        hover
          ? { y: -6, borderColor: 'rgba(212,255,63,0.4)' }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`rounded-2xl border border-border bg-surface p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
