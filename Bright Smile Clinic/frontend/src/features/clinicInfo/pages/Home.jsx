import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { ShieldCheck, ArrowRight, Quote } from "lucide-react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import { services } from "../data/servicesData";
import { doctors } from "../data/doctorsData";

const stats = [
  { value: "20K+", label: "Happy Patients" },
  { value: "300+", label: "Expert Doctors" },
  { value: "14K+", label: "Successful Treatments" },
  { value: "98%", label: "Patient Satisfaction" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white">
              <ShieldCheck size={14} className="text-signal" />
              20K+ satisfied patients
            </div>
            <h1 className="font-sans text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Strong Teeth
              <br />
              <span className="italic-accent text-signal">Bright Smile</span>
            </h1>
            <p className="mt-5 max-w-md text-slate-300">
              Modern dentistry designed to keep your smile strong and
              confident. Relax — we'll take care of the rest.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button as={NavLink} to="/book-appointment">
                Book Appointment
              </Button>
              <Button as={NavLink} to="/services" variant="outline" className="border-white/30 text-white hover:border-white">
                Browse Services
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="overflow-hidden rounded-xl2"
          >
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=80"
              alt="Dentist examining a smiling patient"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-signal">
          About Us
        </p>
        <h2 className="font-sans text-2xl font-bold leading-snug md:text-3xl">
          We are dedicated to providing high-quality dental care tailored to
          your needs.{" "}
          <span className="text-slate-400">
            Our team focuses on both oral health and aesthetics, ensuring every
            patient leaves with a confident smile.
          </span>
        </h2>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center"
            >
              <p className="font-sans text-3xl font-extrabold text-ink md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-cloud px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-sans text-3xl font-extrabold text-ink">
                Trusted Solutions
              </h2>
              <p className="italic-accent text-2xl text-signal">for every smile</p>
            </div>
            <NavLink to="/services" className="hidden items-center gap-1 text-sm font-semibold text-signal md:flex">
              View all <ArrowRight size={16} />
            </NavLink>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {services.slice(0, 3).map((service) => (
              <motion.div key={service.id} variants={fadeUp}>
                <Card className="flex h-full flex-col">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="mb-4 h-40 w-full rounded-xl2 object-cover"
                  />
                  <h3 className="font-sans text-lg font-bold text-ink">{service.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-500">{service.description}</p>
                  <NavLink
                    to="/services"
                    className="mt-4 flex items-center gap-1 text-sm font-semibold text-signal"
                  >
                    View Details <ArrowRight size={14} />
                  </NavLink>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team preview */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-sans text-3xl font-extrabold text-ink">Meet Our Expert</h2>
        <p className="italic-accent text-2xl text-signal">dental team</p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {doctors.map((doc) => (
            <motion.div key={doc.id} variants={fadeUp} className="text-center">
              <img
                src={doc.image}
                alt={doc.name}
                className="mx-auto h-56 w-full rounded-xl2 object-cover"
              />
              <p className="mt-4 font-sans font-bold text-ink">{doc.name}</p>
              <p className="text-sm text-slate-500">{doc.role}</p>
            </motion.div>
          ))}
        </motion.div>

        <NavLink to="/doctors">
          <Button className="mt-10">View All Team</Button>
        </NavLink>
      </section>

      {/* Testimonial */}
      <section className="bg-cloud px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&q=80"
            alt="Happy patient"
            className="h-72 w-full rounded-xl2 object-cover"
          />
          <div>
            <Quote size={32} className="text-signal" />
            <p className="mt-4 text-lg leading-relaxed text-charcoal">
              Working with the Bright Smile team was a game-changer. They
              understood my concerns and delivered gentle, high-quality care
              that exceeded my expectations.
            </p>
            <p className="mt-4 font-semibold text-ink">— Amelia R., patient since 2023</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink px-6 py-20 text-center">
        <h2 className="font-sans text-3xl font-extrabold text-white md:text-4xl">
          Start Your Smile
        </h2>
        <p className="italic-accent text-3xl text-signal md:text-4xl">Journey Today</p>
        <p className="mx-auto mt-4 max-w-md text-slate-300">
          Book your appointment today and experience comfortable, expert
          dental care designed just for you.
        </p>
        <NavLink to="/book-appointment">
          <Button className="mt-8">Book an Appointment</Button>
        </NavLink>
      </section>
    </div>
  );
}
