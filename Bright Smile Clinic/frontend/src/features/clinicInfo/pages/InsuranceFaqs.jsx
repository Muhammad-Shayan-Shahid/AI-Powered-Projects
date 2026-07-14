import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";
import Card from "../../../components/Card";
import { insurancePolicies } from "../data/insuranceData";
import { faqs } from "../data/faqData";

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="font-sans font-semibold text-ink">{question}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-slate-400" />
        </motion.span>
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-sm leading-relaxed text-slate-500"
        >
          {answer}
        </motion.p>
      )}
    </div>
  );
}

export default function InsuranceFaqs() {
  return (
    <div>
      <section className="bg-ink px-6 py-16 text-center">
        <h1 className="font-sans text-4xl font-extrabold text-white">Insurance & FAQs</h1>
        <p className="italic-accent mt-2 text-2xl text-signal">clear answers, no surprises</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-signal" />
              <h3 className="font-sans font-bold text-ink">Accepted Insurance</h3>
            </div>
            <ul className="space-y-1 text-sm text-slate-500">
              {insurancePolicies.accepted.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-2 font-sans font-bold text-ink">Payment Plans</h3>
            <p className="text-sm text-slate-500">{insurancePolicies.paymentPlans}</p>
          </Card>

          <Card>
            <h3 className="mb-2 font-sans font-bold text-ink">Cancellation Policy</h3>
            <p className="text-sm text-slate-500">{insurancePolicies.cancellation}</p>
          </Card>

          <Card>
            <h3 className="mb-2 font-sans font-bold text-ink">New Patients</h3>
            <p className="text-sm text-slate-500">{insurancePolicies.newPatient}</p>
          </Card>
        </div>

        <h2 className="mb-4 mt-16 font-sans text-2xl font-extrabold text-ink">
          Frequently Asked Questions
        </h2>
        <Card>
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </Card>
      </section>
    </div>
  );
}
