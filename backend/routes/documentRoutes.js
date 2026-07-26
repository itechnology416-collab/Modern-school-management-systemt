const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadDocument } = require('../middleware/upload');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const cloudinary = require('../config/cloudinary');

// Upload student documents (marksheets, certificates, ID proofs)
router.post('/student/:studentId', protect, uploadDocument.fields([
  { name: 'documents', maxCount: 5 },
  { name: 'photo', maxCount: 1 },
]), async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const uploaded = [];
    if (req.files?.documents) {
      req.files.documents.forEach(f => uploaded.push({ url: f.path, name: f.originalname, type: f.mimetype }));
    }
    if (req.files?.photo?.length) {
      student.photo = req.files.photo[0].path;
    }
    student.documents = [...(student.documents || []), ...uploaded];
    await student.save();
    res.json({ message: 'Documents uploaded', documents: student.documents, photo: student.photo });
  } catch (err) { res.status(500).json({ message: 'Upload failed' }); }
});

// Upload staff documents
router.post('/staff/:staffId', protect, uploadDocument.fields([
  { name: 'documents', maxCount: 5 },
]), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.staffId);
    if (!teacher) return res.status(404).json({ message: 'Staff not found' });

    const uploaded = [];
    if (req.files?.documents) {
      req.files.documents.forEach(f => uploaded.push({ url: f.path, name: f.originalname, type: f.mimetype }));
    }
    teacher.documents = [...(teacher.documents || []), ...uploaded];
    await teacher.save();
    res.json({ message: 'Documents uploaded', documents: teacher.documents });
  } catch (err) { res.status(500).json({ message: 'Upload failed' }); }
});

// Delete a document
router.delete('/:entityType/:entityId/:docIndex', protect, async (req, res) => {
  try {
    const { entityType, entityId, docIndex } = req.params;
    const Model = entityType === 'student' ? Student : Teacher;
    const entity = await Model.findById(entityId);
    if (!entity) return res.status(404).json({ message: 'Not found' });

    const doc = entity.documents?.[docIndex];
    if (doc?.url) {
      const publicId = doc.url.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    entity.documents.splice(docIndex, 1);
    await entity.save();
    res.json({ message: 'Document deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
