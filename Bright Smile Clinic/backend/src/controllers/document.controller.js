const mongoose = require('mongoose');
const { PDFParse } = require('pdf-parse');
const Document = require('../models/document.model');
const { uploadToImageKit } = require('../services/upload.service');

const EXTRACTION_FAILED_MESSAGE =
  "Could not extract text from this PDF (it may be scanned/image-only). The file was saved, but content is empty — add it manually.";

// pdf-parse's getText() always appends a "-- N of M --" page-separator/footer
// to every page, even ones with zero real text (e.g. a scanned/image-only
// PDF) — so checking result.text for emptiness without stripping this first
// would never detect a failed extraction.
const PAGE_SEPARATOR_REGEX = /--\s*\d+\s*of\s*\d+\s*--/g;

// Uploads the PDF to ImageKit and tries to pull its text out with pdf-parse
// (v2's class-based API: new PDFParse({ data }).getText(), then destroy() to
// free the underlying worker). Returns { fileUrl, extractedContent,
// extractionWarning } — extractedContent is null (not thrown) when
// extraction fails, so a bad PDF never blocks the file itself from being saved.
async function uploadAndExtractPdf(file) {
  const fileUrl = await uploadToImageKit({
    buffer: file.buffer,
    fileName: `${Date.now()}-${file.originalname}`,
    folder: '/documents',
  });

  const parser = new PDFParse({ data: file.buffer });
  try {
    const result = await parser.getText();
    const extractedContent = result.text.replace(PAGE_SEPARATOR_REGEX, '').trim();
    if (!extractedContent) {
      return { fileUrl, extractedContent: null, extractionWarning: EXTRACTION_FAILED_MESSAGE };
    }
    return { fileUrl, extractedContent, extractionWarning: null };
  } catch (error) {
    return { fileUrl, extractedContent: null, extractionWarning: EXTRACTION_FAILED_MESSAGE };
  } finally {
    await parser.destroy();
  }
}

async function listDocuments(req, res, next) {
  try {
    const documents = await Document.find().sort({ category: 1, title: 1 });
    return res.status(200).json({ success: true, data: { documents }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function createDocument(req, res, next) {
  try {
    const { title, category, content } = req.body;

    if (!req.file && !content) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Provide document content or upload a PDF file.',
      });
    }

    let fileUrl;
    let finalContent = content || '';
    let extractionWarning = null;

    if (req.file) {
      const result = await uploadAndExtractPdf(req.file);
      fileUrl = result.fileUrl;
      extractionWarning = result.extractionWarning;
      if (result.extractedContent) finalContent = result.extractedContent;
    }

    const document = await Document.create({ title, category, content: finalContent, fileUrl });

    return res.status(201).json({
      success: true,
      data: { document, extractionWarning },
      message: extractionWarning ? 'Document created, but PDF text extraction failed.' : 'Document created.',
    });
  } catch (error) {
    next(error);
  }
}

async function updateDocument(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid document id.' });
    }

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, data: null, message: 'Document not found.' });
    }

    const { title, category, content } = req.body;
    if (title !== undefined) document.title = title;
    if (category !== undefined) document.category = category;
    if (content !== undefined) document.content = content;

    let extractionWarning = null;
    if (req.file) {
      const result = await uploadAndExtractPdf(req.file);
      document.fileUrl = result.fileUrl;
      extractionWarning = result.extractionWarning;
      if (result.extractedContent) document.content = result.extractedContent;
    }

    await document.save();

    return res.status(200).json({
      success: true,
      data: { document, extractionWarning },
      message: extractionWarning ? 'Document updated, but PDF text extraction failed.' : 'Document updated.',
    });
  } catch (error) {
    next(error);
  }
}

async function deleteDocument(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid document id.' });
    }

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, data: null, message: 'Document not found.' });
    }

    await document.deleteOne();
    return res.status(200).json({ success: true, data: null, message: 'Document removed.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listDocuments, createDocument, updateDocument, deleteDocument };
