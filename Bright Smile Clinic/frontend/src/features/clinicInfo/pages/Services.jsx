import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import { services } from "../data/servicesData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Services() {
  return (
    <div>
      <section className="bg-ink px-6 py-16 text-center">
        <h1 className="font-sans text-4xl font-extrabold text-white">Our Services</h1>
        <p className="italic-accent mt-2 text-2xl text-signal">crafted around your smile</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={fadeUp}>
              <Card className="flex h-full flex-col">
                <img
                  src={service.image}
                  alt={service.name}
                  className="mb-4 h-40 w-full rounded-xl2 object-cover"
                />
                <h3 className="font-sans text-lg font-bold text-ink">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-500">{service.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{service.priceRange}</span>
                  <span className="text-slate-400">{service.duration}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-14 text-center">
          <p className="mb-4 text-slate-500">Not sure which service is right for you?</p>
          <NavLink to="/book-appointment">
            <Button className="inline-flex items-center gap-2">
              Book a Consultation <ArrowRight size={16} />
            </Button>
          </NavLink>
        </div>
      </section>
    </div>
  );
}
