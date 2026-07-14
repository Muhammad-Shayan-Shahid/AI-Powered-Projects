import { motion } from "framer-motion";
import Card from "../../../components/Card";
import { doctors } from "../data/doctorsData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Doctors() {
  return (
    <div>
      <section className="bg-ink px-6 py-16 text-center">
        <h1 className="font-sans text-4xl font-extrabold text-white">Our Doctors</h1>
        <p className="italic-accent mt-2 text-2xl text-signal">experienced hands, gentle care</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {doctors.map((doc) => (
            <motion.div key={doc.id} variants={fadeUp}>
              <Card className="text-center">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="mx-auto h-56 w-full rounded-xl2 object-cover"
                />
                <p className="mt-4 font-sans text-lg font-bold text-ink">{doc.name}</p>
                <p className="text-sm text-signal">{doc.role}</p>
                <p className="mt-2 text-sm text-slate-500">{doc.experience}</p>
                <p className="text-sm text-slate-400">{doc.education}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
