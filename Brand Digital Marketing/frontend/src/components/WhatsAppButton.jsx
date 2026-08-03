import { motion } from 'framer-motion'

// Placeholder number — swap with the real business WhatsApp line later.
const WHATSAPP_NUMBER = '15551234567'
const MESSAGE = encodeURIComponent(
  "Hi MSH Services! I'd like to talk about a project.",
)

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.02 2.67C8.65 2.67 2.67 8.65 2.67 16.02c0 2.52.68 4.88 1.87 6.9L2.67 29.33l6.6-1.83a13.28 13.28 0 0 0 6.75 1.85c7.37 0 13.35-5.98 13.35-13.35S23.39 2.67 16.02 2.67Zm0 24.3a11 11 0 0 1-5.63-1.55l-.4-.24-4.02 1.12 1.08-3.92-.26-.4a10.97 10.97 0 0 1-1.7-5.96c0-6.08 4.95-11.03 11.03-11.03s10.93 4.95 10.93 11.03-4.95 10.95-11.03 10.95Zm6.02-8.2c-.33-.17-1.94-.96-2.24-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.38.24-.71.08-.33-.17-1.4-.52-2.66-1.65-.98-.88-1.65-1.96-1.84-2.29-.19-.33-.02-.5.15-.67.15-.15.33-.38.5-.58.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.17-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.41-.3.33-1.16 1.13-1.16 2.76 0 1.63 1.19 3.2 1.35 3.42.17.22 2.34 3.57 5.67 5 .79.34 1.41.55 1.89.7.79.25 1.51.22 2.08.13.63-.1 1.94-.79 2.22-1.56.27-.77.27-1.42.19-1.56-.08-.14-.3-.22-.63-.38Z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] sm:bottom-8 sm:right-8"
    >
      <motion.span
        animate={{ scale: [1, 1.7, 1.7], opacity: [0.6, 0, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full bg-[#25D366]"
      />
      <WhatsAppIcon className="relative h-7 w-7" />
    </motion.a>
  )
}
