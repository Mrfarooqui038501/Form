import React, { useState, useEffect } from 'react';

const FormResponse = ({ formId }) => {
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchForm = async () => {
            try {
               
                const apiUrl = `http://localhost:5000/api/forms/${formId}`; 
                const response = await fetch(apiUrl);
               
                const textResponse = await response.text();
                console.log("Server Response:", textResponse); 
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${textResponse}`);
                }
               
                const data = JSON.parse(textResponse);
                setForm(data);
               
            } catch (error) {
                console.error('Error fetching form:', error);
                setError(error.message);
            }
        };
        fetchForm();
    }, [formId]);
    const handleResponseChange = (questionId, answer) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };
    const submitResponse = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/forms/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formId,
                    responses: Object.entries(responses).map(([questionId, answer]) => ({
                        questionId,
                        answer
                    }))
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            alert('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.message);
        }
    };
    const renderQuestionInput = (question) => {
        switch (question.type) {
            case 'Categorize':
                return (
                    <div>
                        {question.details.categories.map(category => (
                            <div key={category} className="mb-4">
                                <h4 className="font-semibold">{category}</h4>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    placeholder={`Enter items for ${category}`}
                                    onChange={(e) => handleResponseChange(question._id, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                );
            case 'Cloze':
                return (
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Fill in the blanks"
                        onChange={(e) => handleResponseChange(question._id, e.target.value)}
                    />
                );
            case 'Comprehension':
                return (
                    <textarea
                        className="w-full p-2 border rounded"
                        placeholder="Answer the comprehension question"
                        onChange={(e) => handleResponseChange(question._id, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }
    if (!form) {
        return <div>Loading...</div>; 
    }
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">{form.title}</h1>
            {form.headerImage && (
                <img
                    src={form.headerImage}
                    alt="Form Header"
                    className="w-full mb-6 rounded"
                />
            )}
            {form.questions.map((question) => (
                <div key={question._id} className="mb-6 p-4 border rounded">
                    <h3 className="text-lg font-semibold mb-2">
                        {question.title} ({question.points} points)
                    </h3>
                    {question.image && (
                        <img
                            src={question.image}
                            alt="Question"
                            className="mb-4 rounded max-w-full"
                        />
                    )}
                    {renderQuestionInput(question)}
                </div>
            ))}
            <button
                onClick={submitResponse}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
                Submit Response
            </button>
        </div>
    );
};
export default FormResponse;
