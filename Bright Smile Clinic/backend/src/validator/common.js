const { z } = require('zod');

// Shared zod primitives so every new feature's validator stays consistent.
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id.');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format.');
const timeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:mm format.');

function formatZodErrors(zodError) {
  const fieldErrors = {};
  for (const issue of zodError.issues) {
    const field = issue.path[0] || 'form';
    if (!fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return fieldErrors;
}

// Validates req.body and replaces it with the parsed/coerced data.
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

// req.query has no setter in Express 5 (it's a getter over the raw URL),
// so query validation results are stashed on req.validatedQuery instead.
function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        data: { errors: formatZodErrors(result.error) },
        message: 'Validation failed.',
      });
    }
    req.validatedQuery = result.data;
    next();
  };
}

module.exports = { objectId, isoDate, timeOfDay, formatZodErrors, validate, validateQuery };
