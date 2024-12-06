import React, { useState } from 'react';
import FormEditor from './components/FormEditor';
import FormResponse from './components/FormResponse';
import FormList from './components/FormList';

function App() {
  const [currentView, setCurrentView] = useState('editor');
  const [selectedFormId, setSelectedFormId] = useState(null);

  const renderView = () => {
    switch(currentView) {
      case 'editor':
        return <FormEditor />;
      case 'list':
        return (
          <FormList 
            onSelectForm={(formId) => {
              setSelectedFormId(formId);
              setCurrentView('response');
            }} 
          />
        );
      case 'response':
        return selectedFormId ? (
          <FormResponse formId={selectedFormId} />
        ) : null;
      default:
        return <FormEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Form Builder</h1>
          <div className="space-x-4">
            <button 
              onClick={() => setCurrentView('editor')}
              className="bg-white text-blue-600 px-4 py-2 rounded"
            >
              Create Form
            </button>
            <button 
              onClick={() => setCurrentView('list')}
              className="bg-white text-blue-600 px-4 py-2 rounded"
            >
              Form List
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto mt-6">
        {renderView()}
      </div>
    </div>
  );
}

export default App;