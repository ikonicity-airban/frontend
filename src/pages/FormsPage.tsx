import React, { useState } from 'react';
import { 
  ClipboardListIcon, 
  PlusIcon, 
  EditIcon, 
  Trash2Icon, 
  CopyIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRoles } from '../lib/roles';
import { useNotification } from '../context/NotificationContext';
import { adminApi } from '../api/admin';

// Mock data for evaluation forms
const mockForms = [
  {
    id: '1',
    name: 'Performance Evaluation - Standard',
    description: 'Standard employee performance evaluation form',
    questions: 15,
    lastModified: '2023-12-15T14:30:00Z',
    status: 'active',
    type: 'performance'
  },
  {
    id: '2',
    name: 'Leadership Assessment',
    description: 'Evaluation form for leadership qualities',
    questions: 12,
    lastModified: '2023-11-20T09:15:00Z',
    status: 'active',
    type: 'leadership'
  },
  {
    id: '3',
    name: 'Project Management Skills',
    description: 'Assessment for project management capabilities',
    questions: 10,
    lastModified: '2024-01-05T16:45:00Z',
    status: 'active',
    type: 'skills'
  },
  {
    id: '4',
    name: 'Team Collaboration Review',
    description: 'Evaluation of team collaboration skills',
    questions: 8,
    lastModified: '2023-10-10T11:20:00Z',
    status: 'draft',
    type: 'collaboration'
  }
];

// Mock form builder structure
const mockFormBuilder = {
  name: 'Performance Evaluation - Standard',
  description: 'Standard employee performance evaluation form',
  sections: [
    {
      id: 's1',
      title: 'Job Knowledge',
      description: 'Evaluate the employee\'s understanding of job responsibilities and skills',
      questions: [
        {
          id: 'q1-s1',
          text: 'Demonstrates thorough understanding of job responsibilities',
          type: 'rating',
          required: true,
          options: ['1', '2', '3', '4', '5']
        },
        {
          id: 'q2-s1',
          text: 'Applies technical skills effectively',
          type: 'rating',
          required: true,
          options: ['1', '2', '3', '4', '5']
        }
      ]
    },
    {
      id: 's2',
      title: 'Quality of Work',
      description: 'Assess the accuracy, thoroughness, and effectiveness of work',
      questions: [
        {
          id: 'q1-s2',
          text: 'Produces high-quality work with minimal errors',
          type: 'rating',
          required: true,
          options: ['1', '2', '3', '4', '5']
        },
        {
          id: 'q2-s2',
          text: 'Meets deadlines consistently',
          type: 'rating',
          required: true,
          options: ['1', '2', '3', '4', '5']
        }
      ]
    }
  ]
};

const FormsPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activePage, setActivePage] = useState<'list' | 'builder'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter forms based on search term
  const filteredForms = mockForms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle create form
  const handleCreateForm = () => {
    setActivePage('builder');
    // In a real app, we would initialize a new form template here
  };
  
  // Handle edit form
  const handleEditForm = (formId: string) => {
    setActivePage('builder');
    // In a real app, we would load the specific form data here
    
    // Log activity
    adminApi.logActivity({
      action: "edited form template",
      entityType: "form",
      entityId: formId,
      details: `Edited form template ${mockForms.find(f => f.id === formId)?.name}`
    });
  };
  
  // Handle form deletion
  const handleDeleteForm = (formId: string) => {
    // In a real app, we would delete the form here
    showNotification('success', 'Form deleted successfully');
    
    // Log activity
    adminApi.logActivity({
      action: "deleted form template",
      entityType: "form",
      entityId: formId,
      details: `Deleted form template ${mockForms.find(f => f.id === formId)?.name}`
    });
  };
  
  // Handle form duplication
  const handleDuplicateForm = (formId: string) => {
    // In a real app, we would duplicate the form here
    showNotification('success', 'Form duplicated successfully');
    
    // Log activity
    adminApi.logActivity({
      action: "duplicated form template",
      entityType: "form",
      entityId: formId,
      details: `Duplicated form template ${mockForms.find(f => f.id === formId)?.name}`
    });
  };
  
  // Handle form status toggle
  const handleToggleStatus = (formId: string, currentStatus: string) => {
    // In a real app, we would update the form status here
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    showNotification('success', `Form ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    
    // Log activity
    adminApi.logActivity({
      action: `${newStatus === 'active' ? 'activated' : 'deactivated'} form template`,
      entityType: "form",
      entityId: formId,
      details: `Changed status of form template ${mockForms.find(f => f.id === formId)?.name} to ${newStatus}`
    });
  };
  
  // Handle form save
  const handleSaveForm = () => {
    // In a real app, we would save the form here
    showNotification('success', 'Form saved successfully');
    setActivePage('list');
    
    // Log activity
    adminApi.logActivity({
      action: "saved form template",
      entityType: "form",
      details: `Saved form template ${mockFormBuilder.name}`
    });
  };

  if (user?.role !== UserRoles.ADMIN) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">
            Access Restricted
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {activePage === 'list' ? 'Evaluation Forms' : 'Form Builder'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {activePage === 'list' 
              ? 'Manage and create evaluation form templates' 
              : 'Design and customize your evaluation form'}
          </p>
        </div>
        {activePage === 'list' ? (
          <button
            onClick={handleCreateForm}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Form
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={() => setActivePage('list')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveForm}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Form
            </button>
          </div>
        )}
      </div>

      {activePage === 'list' ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="max-w-md w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search forms"
                />
              </div>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredForms.map((form) => (
                <tr key={form.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ClipboardListIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{form.name}</div>
                        <div className="text-sm text-gray-500">{form.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{form.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{form.questions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(form.lastModified).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        form.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {form.status === 'active' ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditForm(form.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateForm(form.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Duplicate"
                      >
                        <CopyIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(form.id, form.status)}
                        className={`${form.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={form.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteForm(form.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2Icon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Form Builder UI */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-6">
              <div>
                <label htmlFor="formName" className="block text-sm font-medium text-gray-700">
                  Form Name
                </label>
                <input
                  type="text"
                  id="formName"
                  name="formName"
                  value={mockFormBuilder.name}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter form name"
                />
              </div>
              <div>
                <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="formDescription"
                  name="formDescription"
                  rows={3}
                  value={mockFormBuilder.description}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter form description"
                />
              </div>
            </div>
          </div>
          
          {/* Form Sections */}
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Form Sections</h2>
              <button
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Section
              </button>
            </div>
            
            {mockFormBuilder.sections.map((section, index) => (
              <div key={section.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      Section {index + 1}: {section.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {section.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500">
                      <ArrowUpIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <ArrowDownIcon className="h-5 w-5" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2Icon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Questions */}
                <div className="space-y-4 ml-4">
                  {section.questions.map((question, qIndex) => (
                    <div key={question.id} className="bg-white p-3 rounded border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Q{qIndex + 1}: {question.text}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Type: {question.type} | {question.required ? 'Required' : 'Optional'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Rating preview */}
                      {question.type === 'rating' && (
                        <div className="mt-2 flex space-x-2">
                          {question.options.map((option) => (
                            <button 
                              key={option} 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Add Question
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsPage;
