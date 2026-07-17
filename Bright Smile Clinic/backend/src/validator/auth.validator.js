const { z } = require('zod');

// Shared building blocks so patient/doctor schemas stay consistent.
const email = z.string().trim().toLowerCase().email('Enter a valid email address.');
const password = z.string().min(8, 'Password must be at least 8 characters.');
const phone = z.string().trim().min(7, 'Enter a valid phone number.');
const name = z.string().trim().min(2, 'Please enter your full name.');

const registerPatientSchema = z.object({
  name,
  email,
  password,
  phone,
});

const registerDoctorSchema = z.object({
  name,
  email,
  password,
  phone,
  specialization: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  photoUrl: z.string().trim().optional(),
});

const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.'),
});

// Turns a zod parse failure into a { field: message } map the frontend
// can attach directly under each input.
function formatZodErrors(zodError) {
  const fieldErrors = {};
  for (const issue of zodError.issues) {
    const field = issue.path[0] || 'form';
    if (!fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return fieldErrors;
}

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        data: { errors: formatZodErrors(result.error) },
        message: 'Validation failed.',
      });
    }
    req.body = result.data;
    next();
  };
}

module.exports = {
  registerPatientSchema,
  registerDoctorSchema,
  loginSchema,
  validate,
};
