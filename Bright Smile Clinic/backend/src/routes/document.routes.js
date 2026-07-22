const express = require('express');
const documentController = require('../controllers/document.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { createDocumentSchema, updateDocumentSchema } = require('../validator/document.validator');

const router = express.Router();

// Admin-only: feeds the chatbot's knowledge base (see CLAUDE.md RAG rules) —
// no public read here, patient chat only ever does read-only vector lookups.
router.use(verifyToken, requireRole('admin'));

router.get('/', documentController.listDocuments);
router.post('/', validate(createDocumentSchema), documentController.createDocument);
router.put('/:id', validate(updateDocumentSchema), documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
