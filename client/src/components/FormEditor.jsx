import React, { useState } from 'react';
import { formService } from '../services/formService';
const FormEditor = () => {
  const [formTitle, setFormTitle] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const addQuestion = (type) => {
    const newQuestion = {
      type,
      title: '',
      points: 1,
      image: null,
      details: type === 'Categorize'
        ? { categories: [], items: [] }
        : type === 'Cloze'
        ? { text: '', blanks: [] }
        : { passage: '', questions: [] }
    };
    setQuestions([...questions, newQuestion]);
  };
  const updateQuestion = (index, updates) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    setQuestions(updatedQuestions);
  };
  const handleHeaderImageUpload = (e) => {
    const file = e.target.files[0];
    setHeaderImage(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append('title', formTitle);
    if (headerImage) {
        formData.append('headerImage', headerImage);
    }
    questions.forEach((question, index) => {
        if (question.image) {
            formData.append(`questions[${index}][image]`, question.image); // Correctly append question image
        }
        // Append question details as a stringified JSON
        formData.append(`questions[${index}]`, JSON.stringify({
            ...question,
            index  // Add index for backend processing
        }));
    });
    try {
        const response = await formService.createForm(formData);
        console.log('Form created:', response);
        // Reset form after successful submission
        setFormTitle('');
        setHeaderImage(null);
        setQuestions([]);
    } catch (error) {
        setError(error.message);
    }
};
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Form Editor</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Title Input */}
        <input
          type="text"
          placeholder="Form Title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {/* Header Image Upload */}
        <div>
          <label className="block mb-2">Header Image</label>
          <input
            type="file"
            onChange={handleHeaderImageUpload}
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Question Type Buttons */}
        <div className="flex space-x-4 mb-4">
          {['Categorize', 'Cloze', 'Comprehension'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addQuestion(type)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add {type} Question
            </button>
          ))}
        </div>
        {/* Questions List */}
        {questions.map((question, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">{question.type} Question</h3>
            {/* Question Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                updateQuestion(index, { image: file });
              }}
              className="w-full p-2 border rounded mb-2"
            />
            {/* Question Details */}
            <input
              type="text"
              placeholder="Question Title"
              value={question.title}
              onChange={(e) => updateQuestion(index, { title: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              type="number"
              placeholder="Points"
              value={question.points}
              onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) })}
              className="w-full p-2 border rounded mb-2"
              min="1"
            />
            {/* Question Type Specific Inputs */}
            {question.type === 'Categorize' && (
              <div>
                <input
                  type="text"
                  placeholder="Add Category"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const newCategories = [...question.details.categories, e.target.value];
                      updateQuestion(index, {
                        details: {
                          ...question.details,
                          categories: newCategories
                        }
                      });
                      e.target.value = '';
                    }
                  }}
                  className="w-full p-2 border rounded"
                />
                {/* Display Categories */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.details.categories.map((cat, catIndex) => (
                    <span
                      key={catIndex}
                      className="bg-gray-200 px-2 py-1 rounded inline-block"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Create Form
        </button>
      </form>
    </div>
  );
};
export default FormEditor;