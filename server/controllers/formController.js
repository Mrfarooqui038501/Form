const { Form, Response } = require('../models/Form');
const mongoose = require('mongoose');
exports.createForm = async (req, res) => {
  try {
      const { title } = req.body;
      const headerImage = req.file ? req.file.path : null; // Get the header image path
      // Parse questions from the request body
      const questions = Object.keys(req.body)
          .filter(key => key.startsWith('questions['))
          .map(key => JSON.parse(req.body[key]));
      const newForm = new Form({
          title,
          headerImage,
          questions
      });
      const savedForm = await newForm.save();
      res.status(201).json(savedForm);
  } catch (error) {
      console.error('Error creating form:', error); // Log the error for debugging
      res.status(400).json({ message: error.message });
  }
};
exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id); // Find form by ID
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error getting form by ID:', error);
    res.status(500).json({ message: error.message });
  }
};
exports.submitFormResponse = async (req, res) => {
  try {
    const { formId, responses } = req.body;
    const newResponse = new Response({
      form: formId,
      responses
    });
    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getFormResponses = async (req, res) => {
  try {
    const responses = await Response.find({ form: req.params.formId });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};