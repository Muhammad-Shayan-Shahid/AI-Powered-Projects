const { z } = require('zod');

const DOCUMENT_CATEGORIES = ['insurance', 'policy', 'procedure_instructions'];

const createDocumentSchema = z.object({
  title: z.string().trim().min(1, 'title is required.'),
  category: z.enum(DOCUMENT_CATEGORIES),
  content: z.string().trim().min(1, 'content is required.'),
  fileUrl: z.string().trim().optional(),
});

const updateDocumentSchema = z.object({
  title: z.string().trim().min(1, 'title is required.').optional(),
  category: z.enum(DOCUMENT_CATEGORIES).optional(),
  content: z.string().trim().min(1, 'content is required.').optional(),
  fileUrl: z.string().trim().optional(),
});

module.exports = { createDocumentSchema, updateDocumentSchema };
