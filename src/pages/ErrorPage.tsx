import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangleIcon } from 'lucide-react';

interface ErrorPageProps {
  error?: Error | string;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, message }) => {
  const navigate = useNavigate();
  const errorMessage = error ? (typeof error === 'string' ? error : error.message) : message || 'An unexpected error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 mx-auto bg-red-100 rounded-full">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ml-4"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
