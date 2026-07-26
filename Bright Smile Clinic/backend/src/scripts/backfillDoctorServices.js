// One-time backfill for the new User.services relationship (see Section on
// the doctor↔service relationship in CLAUDE.md). Existing test doctors were
// seeded with only a free-text `specialization` and no `services` link, so
// this assigns each one the Service matching their specialization — without
// this, the new ?service= filter and profile "services offered" tags would
// leave every pre-existing test doctor stale/empty.
//
// Run from backend/: node src/scripts/backfillDoctorServices.js
require('dotenv').config();
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/config');
const User = require('../models/user.model');
const Service = require('../models/service.model');

// specialization (free text on User — the seeded test doctors predate the
// ProfileEdit.jsx dropdown and use their own wording, e.g. "Endodontist (Root
// Canal Specialist)") -> the Service name it should map to, per the
// test-data reference sheet. Matched by keyword-contains, not exact string,
// so parenthetical suffixes like that one still match.
const SPECIALIZATION_TO_SERVICE = [
  { specialization: /general dentist/i, serviceName: 'General Checkup' },
  { specialization: /orthodontist/i, serviceName: 'Braces Consultation' },
  { specialization: /endodontist/i, serviceName: 'Root Canal' },
  { specialization: /pediatric dentist/i, serviceName: 'Pediatric Checkup' },
  { specialization: /oral surgeon/i, serviceName: 'Tooth Extraction' },
];

async function run() {
  await mongoose.connect(MONGO_URI);

  let updated = 0;
  let skipped = 0;

  for (const { specialization, serviceName } of SPECIALIZATION_TO_SERVICE) {
    const service = await Service.findOne({ name: new RegExp(`^${serviceName}$`, 'i') });
    if (!service) {
      console.warn(`Skipping "${specialization}" -> no Service named "${serviceName}" found. Seed services first.`);
      continue;
    }

    const doctors = await User.find({ role: 'doctor', specialization });
    if (doctors.length === 0) {
      console.warn(`No doctors found with specialization matching ${specialization}.`);
      continue;
    }

    for (const doctor of doctors) {
      const alreadyHasIt = doctor.services.some((id) => String(id) === String(service._id));
      if (alreadyHasIt) {
        skipped += 1;
        continue;
      }
      doctor.services.push(service._id);
      await doctor.save();
      updated += 1;
      console.log(`Assigned "${service.name}" to Dr. ${doctor.name} (${doctor.specialization}).`);
    }
  }

  console.log(`\nDone. ${updated} doctor(s) updated, ${skipped} already had the service assigned.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error('Backfill failed:', error.message);
  process.exit(1);
});
