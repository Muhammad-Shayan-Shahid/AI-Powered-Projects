const express = require('express');
const documentController = require('../controllers/document.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { createDocumentSchema, updateDocumentSchema } = require('../validator/document.validator');
const { uploadPdf } = require('../middlewares/upload.middleware');

const router = express.Router();

// Admin-only: feeds the chatbot's knowledge base (see CLAUDE.md RAG rules) —
// no public read here, patient chat only ever does read-only vector lookups.
router.use(verifyToken, requireRole('admin'));

router.get('/', documentController.listDocuments);
// uploadPdf only engages for multipart requests (a PDF file) — a plain JSON
// "paste text" submission passes through untouched, so both modes share one route.
router.post('/', uploadPdf, validate(createDocumentSchema), documentController.createDocument);
router.put('/:id', uploadPdf, validate(updateDocumentSchema), documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
