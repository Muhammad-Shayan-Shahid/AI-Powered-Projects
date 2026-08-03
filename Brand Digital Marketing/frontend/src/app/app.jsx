import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import ScrollToTop from '../components/ScrollToTop'
import AppRoutes from './app.routes'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <AppRoutes />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
