const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController'); // Ensure correct path
const multer = require('multer');
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});
// Form Creation Routes
router.post(
  '/create',
  upload.single('headerImage'), // Use single for headerImage
  (req, res, next) => {
      console.log('Request received:', req.body, req.file); // Log the request body and file
      next();
  },
  formController.createForm
);
router.get('/', formController.getAllForms);
router.get('/:id', formController.getFormById);
// Form Response Routes
router.post('/submit', formController.submitFormResponse);
router.get('/:formId/responses', formController.getFormResponses);
module.exports = router;