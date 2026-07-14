import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useAppointment } from "../hooks/useAppointment";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  preferredDate: "",
  reason: "",
};

export default function BookAppointment() {
  const [form, setForm] = useState(initialForm);
  const { isSubmitting, handleBookAppointment } = useAppointment();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleBookAppointment(form, { onSuccess: () => setForm(initialForm) });
  }

  return (
    <div>
      <section className="bg-ink px-6 py-16 text-center">
        <h1 className="font-sans text-4xl font-extrabold text-white">Book an Appointment</h1>
        <p className="italic-accent mt-2 text-2xl text-signal">we'll take it from here</p>
      </section>

      <section className="mx-auto max-w-xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <div className="mb-6 flex items-center gap-2 text-ink">
              <CalendarCheck size={20} className="text-signal" />
              <h2 className="font-sans text-lg font-bold">Appointment Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-charcoal">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-signal"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-charcoal">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-signal"
                  placeholder="jane@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-charcoal">
                  Phone <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-signal"
                  placeholder="555-0142"
                />
              </div>

              <div>
                <label htmlFor="preferredDate" className="mb-1 block text-sm font-medium text-charcoal">
                  Preferred date
                </label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-signal"
                />
              </div>

              <div>
                <label htmlFor="reason" className="mb-1 block text-sm font-medium text-charcoal">
                  Reason for visit
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-signal"
                  placeholder="e.g. Teeth cleaning, tooth pain, consultation…"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
                {isSubmitting ? <LoadingSpinner size={16} /> : "Confirm Appointment"}
              </Button>
            </form>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
