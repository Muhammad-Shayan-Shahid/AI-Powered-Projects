import { motion } from "framer-motion";

const variants = {
  primary: "bg-signal text-white hover:bg-signalDark",
  outline: "border border-slate-300 text-charcoal hover:border-ink",
  ghost: "text-signal hover:underline",
};

export default function Button({
  children,
  variant = "primary",
  as: Component = "button",
  className = "",
  ...props
}) {
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="inline-block">
      <Component
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
}
