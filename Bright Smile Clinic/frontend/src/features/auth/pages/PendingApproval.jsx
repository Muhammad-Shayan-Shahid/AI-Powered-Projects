import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

export default function PendingApproval() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Navbar />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-10">
        <Card className="flex w-full max-w-[520px] animate-fade-in-up flex-col items-center gap-5 p-8 text-center shadow-[0_24px_60px_oklch(22%_0.05_265_/_0.12),0_4px_12px_oklch(22%_0.05_265_/_0.07)] sm:p-14">
          <div className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-clinician-subtle">
            <div className="absolute h-[88px] w-[88px] animate-pulse-ring rounded-full border-2 border-clinician/60" />
            <span className="text-[2.25rem] text-clinician">⏳</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-clinician-subtle px-3 py-1.5 text-[0.6875rem] font-bold tracking-wide text-clinician">
            FOR CLINICIANS
          </div>

          <div>
            <h1 className="m-0 mb-2.5 text-2xl font-bold leading-tight tracking-tight text-ink">
              Your account is under review
            </h1>
            <p className="m-0 mx-auto max-w-[400px] text-[0.9375rem] leading-relaxed text-ink-secondary">
              Thanks for applying to join Bright Smile. Our team is reviewing your credentials and typically
              responds within 1–2 business days. We&rsquo;ll email you as soon as you&rsquo;re approved.
            </p>
          </div>

          <div className="my-1 h-px w-full bg-border" />

          <div className="flex w-full flex-col gap-3.5">
            <Button as={Link} to="/" tone="brand" className="no-underline">
              Back to home
            </Button>
            <a
              href="#"
              className="text-sm font-semibold text-clinician no-underline transition-colors duration-200 ease-in-out hover:text-clinician-hover"
            >
              Contact support
            </a>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
