import { motion } from 'framer-motion'

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export function StaggerGroup({ children, className = '', amount = 0.2, once = true, ...props }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', as = 'div', ...props }) {
  const MotionTag = motion[as] ?? motion.div
  return (
    <MotionTag variants={staggerItem} className={className} {...props}>
      {children}
    </MotionTag>
  )
}
