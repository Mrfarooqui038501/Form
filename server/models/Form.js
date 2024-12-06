const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Categorize', 'Cloze', 'Comprehension'],
    required: true
  },
  title: String,
  image: String,
  points: Number,
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});
const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  headerImage: String,
  questions: [QuestionSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const ResponseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  responses: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = {
  Form: mongoose.model('Form', FormSchema),
  Response: mongoose.model('Response', ResponseSchema)
};