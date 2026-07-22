const { z } = require('zod');

const DOCUMENT_CATEGORIES = ['insurance', 'policy', 'procedure_instructions'];

// content is optional here — the controller requires either a pasted
// `content` string or an uploaded PDF (req.file) to be present, since a
// document can now arrive either way. fileUrl is never client-supplied — it's
// derived server-side from the uploaded file (see upload.service.js).
const createDocumentSchema = z.object({
  title: z.string().trim().min(1, 'title is required.'),
  category: z.enum(DOCUMENT_CATEGORIES),
  content: z.string().trim().optional(),
});

const updateDocumentSchema = z.object({
  title: z.string().trim().min(1, 'title is required.').optional(),
  category: z.enum(DOCUMENT_CATEGORIES).optional(),
  content: z.string().trim().optional(),
});

module.exports = { createDocumentSchema, updateDocumentSchema };
