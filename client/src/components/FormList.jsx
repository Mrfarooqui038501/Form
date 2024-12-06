import React, { useState, useEffect } from 'react';
import { formService } from '../services/formService';
const FormList = ({ onSelectForm }) => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const fetchedForms = await formService.getForms();
        setForms(fetchedForms);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchForms();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-6">Available Forms</h2>
      {forms.length === 0 ? (
        <p className="text-gray-600">No forms available. Create a new form to get started.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {form.headerImage && (
                <img
                  src={form.headerImage}
                  alt={form.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{form.title}</h3>
                <p className="text-gray-600 mb-4">
                  {form.questions.length} Question(s)
                </p>
                <button
                  onClick={() => onSelectForm(form._id)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Fill Form
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default FormList;