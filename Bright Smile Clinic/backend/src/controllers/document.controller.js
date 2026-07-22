const mongoose = require('mongoose');
const Document = require('../models/document.model');

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
    const { title, category, content, fileUrl } = req.body;
    const document = await Document.create({ title, category, content, fileUrl });
    return res.status(201).json({ success: true, data: { document }, message: 'Document created.' });
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

    const { title, category, content, fileUrl } = req.body;
    if (title !== undefined) document.title = title;
    if (category !== undefined) document.category = category;
    if (content !== undefined) document.content = content;
    if (fileUrl !== undefined) document.fileUrl = fileUrl;
    await document.save();

    return res.status(200).json({ success: true, data: { document }, message: 'Document updated.' });
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
