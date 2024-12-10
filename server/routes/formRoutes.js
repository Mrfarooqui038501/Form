const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController'); 
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

router.post(
  '/create',
  upload.single('headerImage'), 
  (req, res, next) => {
      console.log('Request received:', req.body, req.file);
      next();
  },
  formController.createForm
);
router.get('/', formController.getAllForms);
router.get('/:id', formController.getFormById);

router.post('/submit', formController.submitFormResponse);
router.get('/:formId/responses', formController.getFormResponses);
module.exports = router;
