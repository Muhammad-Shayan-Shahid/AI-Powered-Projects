import { NavLink } from "react-router-dom";
import { Sparkles, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-lg font-extrabold text-white">
            <Sparkles size={20} className="text-signal" />
            Bright Smile
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Modern, reliable dental care focused on comfort and long-term oral
            health for every member of your family.
          </p>
          <div className="mt-6 flex gap-4">
            <Facebook size={18} className="cursor-pointer hover:text-white" />
            <Instagram size={18} className="cursor-pointer hover:text-white" />
            <Linkedin size={18} className="cursor-pointer hover:text-white" />
          </div>
        </div>

        <div>
          <p className="italic-accent text-2xl text-white">Start your smile journey today</p>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Book your appointment and experience comfortable, expert dental
            care designed just for you.
          </p>
          <NavLink
            to="/book-appointment"
            className="mt-4 inline-block rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition hover:bg-signalDark"
          >
            Book an Appointment
          </NavLink>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Bright Smile Dental Clinic. All rights reserved.
      </div>
    </footer>
  );
}
