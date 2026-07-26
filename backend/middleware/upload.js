const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Profile image storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'school-management/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

// Study material storage
const materialStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'school-management/materials',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'ppt', 'pptx'],
    resource_type: 'auto',
  },
});

// Homework attachment storage
const homeworkStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'school-management/homework',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    resource_type: 'auto',
  },
});

// Document storage (student certificates, ID proofs, etc.)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'school-management/documents',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    resource_type: 'auto',
  },
});

const uploadProfile = multer({ storage: profileStorage });
const uploadMaterial = multer({ storage: materialStorage });
const uploadHomework = multer({ storage: homeworkStorage });
const uploadDocument = multer({ storage: documentStorage });

module.exports = { uploadProfile, uploadMaterial, uploadHomework, uploadDocument };
