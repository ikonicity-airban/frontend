import React, { useState } from 'react';
import { 
  CalendarIcon, 
  PlusIcon, 
  CheckCircleIcon, 
  Clock, 
  ArrowRightCircleIcon,
  Calendar,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRoles } from '../lib/roles';
import { useNotification } from '../context/NotificationContext';
import { adminApi } from '../api/admin';
import { format, addMonths, startOfQuarter, endOfQuarter, addDays } from 'date-fns';

interface EvaluationPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  selfEvaluationDeadline: string;
  leadReviewDeadline: string;
  status: 'upcoming' | 'active' | 'completed';
  completionRate?: number;
}

// Mock data for evaluation periods
const mockPeriods: EvaluationPeriod[] = [
  {
    id: '1',
    name: 'Q1 2024',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    selfEvaluationDeadline: '2024-04-15T23:59:59Z',
    leadReviewDeadline: '2024-04-30T23:59:59Z',
    status: 'active',
    completionRate: 45
  },
  {
    id: '2',
    name: 'Q4 2023',
    startDate: '2023-10-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    selfEvaluationDeadline: '2024-01-15T23:59:59Z',
    leadReviewDeadline: '2024-01-31T23:59:59Z',
    status: 'completed',
    completionRate: 98
  },
  {
    id: '3',
    name: 'Q3 2023',
    startDate: '2023-07-01T00:00:00Z',
    endDate: '2023-09-30T23:59:59Z',
    selfEvaluationDeadline: '2023-10-15T23:59:59Z',
    leadReviewDeadline: '2023-10-31T23:59:59Z',
    status: 'completed',
    completionRate: 95
  },
  {
    id: '4',
    name: 'Q2 2024',
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-06-30T23:59:59Z',
    selfEvaluationDeadline: '2024-07-15T23:59:59Z',
    leadReviewDeadline: '2024-07-31T23:59:59Z',
    status: 'upcoming'
  }
];

const TimelinePage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<EvaluationPeriod | null>(null);
  
  // New period form state
  const [newPeriod, setNewPeriod] = useState<Partial<EvaluationPeriod>>({
    name: '',
    startDate: '',
    endDate: '',
    selfEvaluationDeadline: '',
    leadReviewDeadline: '',
    status: 'upcoming'
  });

  // Sort periods by start date (newest first)
  const sortedPeriods = [...mockPeriods].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Generate next quarter
  const handleGenerateNextQuarter = () => {
    // Find the latest period
    const latestPeriod = sortedPeriods[0];
    const latestEndDate = new Date(latestPeriod.endDate);
    
    // Calculate next quarter dates
    const nextQuarterStart = addDays(latestEndDate, 1);
    const nextQuarterStartQuarter = startOfQuarter(nextQuarterStart);
    const nextQuarterEnd = endOfQuarter(nextQuarterStartQuarter);
    
    // Calculate deadlines
    const selfEvalDeadline = addDays(nextQuarterEnd, 15);
    const leadReviewDeadline = addDays(nextQuarterEnd, 30);
    
    // Determine quarter number and year
    const quarterNumber = Math.floor(nextQuarterStartQuarter.getMonth() / 3) + 1;
    const year = nextQuarterStartQuarter.getFullYear();
    
    // Set new period values
    setNewPeriod({
      name: `Q${quarterNumber} ${year}`,
      startDate: nextQuarterStartQuarter.toISOString(),
      endDate: nextQuarterEnd.toISOString(),
      selfEvaluationDeadline: selfEvalDeadline.toISOString(),
      leadReviewDeadline: leadReviewDeadline.toISOString(),
      status: 'upcoming'
    });
    
    setIsCreating(true);
  };

  // Handle creation of a new period
  const handleCreatePeriod = () => {
    // In a real app, we would save the new period here
    showNotification('success', 'Evaluation period created successfully');
    setIsCreating(false);
    
    // Log activity
    adminApi.logActivity({
      action: "created evaluation period",
      entityType: "timeline",
      details: `Created new evaluation period: ${newPeriod.name}`
    });
  };

  // Handle period selection for details view
  const handleViewPeriod = (period: EvaluationPeriod) => {
    setSelectedPeriod(period);
  };

  // Handle input changes for new period form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPeriod(prev => ({
      ...prev,
      [name]: value
    }));
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
            Evaluation Timeline
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage evaluation periods and deadlines
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleGenerateNextQuarter}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Generate Next Quarter
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Period
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Evaluation Periods List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Evaluation Periods
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {sortedPeriods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => handleViewPeriod(period)}
                  className={`w-full text-left px-6 py-4 flex items-center justify-between ${
                    selectedPeriod?.id === period.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div 
                      className={`rounded-full p-2 mr-3 ${
                        period.status === 'active' 
                          ? 'bg-green-100' 
                          : period.status === 'completed'
                            ? 'bg-blue-100'
                            : 'bg-yellow-100'
                      }`}
                    >
                      {period.status === 'active' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : period.status === 'completed' ? (
                        <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {period.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(period.startDate), 'MMM d, yyyy')} - {format(new Date(period.endDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <ArrowRightCircleIcon className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Period Details or Creation Form */}
        <div className="lg:col-span-2">
          {isCreating ? (
            // New Period Form
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Create New Evaluation Period
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Period Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newPeriod.name || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g. Q1 2024"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newPeriod.startDate ? format(new Date(newPeriod.startDate), 'yyyy-MM-dd') : ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newPeriod.endDate ? format(new Date(newPeriod.endDate), 'yyyy-MM-dd') : ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="selfEvaluationDeadline" className="block text-sm font-medium text-gray-700">
                      Self Evaluation Deadline
                    </label>
                    <input
                      type="date"
                      id="selfEvaluationDeadline"
                      name="selfEvaluationDeadline"
                      value={newPeriod.selfEvaluationDeadline ? format(new Date(newPeriod.selfEvaluationDeadline), 'yyyy-MM-dd') : ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="leadReviewDeadline" className="block text-sm font-medium text-gray-700">
                      Lead Review Deadline
                    </label>
                    <input
                      type="date"
                      id="leadReviewDeadline"
                      name="leadReviewDeadline"
                      value={newPeriod.leadReviewDeadline ? format(new Date(newPeriod.leadReviewDeadline), 'yyyy-MM-dd') : ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePeriod}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Create Period
                  </button>
                </div>
              </div>
            </div>
          ) : selectedPeriod ? (
            // Period Details
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedPeriod.name} Details
                  </h2>
                  <span 
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedPeriod.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedPeriod.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedPeriod.status.charAt(0).toUpperCase() + selectedPeriod.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Period Dates</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedPeriod.startDate), 'MMMM d, yyyy')} - {format(new Date(selectedPeriod.endDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  {selectedPeriod.status !== 'upcoming' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPeriod.completionRate}%
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-md font-medium text-gray-900">Deadlines</h3>
                  <div className="mt-4 border-t border-b border-gray-200">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-4 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Self Evaluation</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {format(new Date(selectedPeriod.selfEvaluationDeadline), 'MMMM d, yyyy')}
                        </dd>
                      </div>
                      <div className="py-4 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Lead Review</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {format(new Date(selectedPeriod.leadReviewDeadline), 'MMMM d, yyyy')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {selectedPeriod.status === 'active' && (
                  <div className="mt-8">
                    <h3 className="text-md font-medium text-gray-900">Actions</h3>
                    <div className="mt-4 space-x-3">
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => showNotification('success', 'Reminder emails sent successfully')}
                      >
                        Send Reminders
                      </button>
                      <button
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          showNotification('info', 'Period dates updated');
                          adminApi.logActivity({
                            action: "modified evaluation period",
                            entityType: "timeline",
                            entityId: selectedPeriod.id,
                            details: `Updated dates for period: ${selectedPeriod.name}`
                          });
                        }}
                      >
                        Edit Dates
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // No period selected
            <div className="bg-white shadow-sm rounded-lg overflow-hidden flex flex-col items-center justify-center p-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Period Selected</h3>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Select an evaluation period from the list to view details or create a new one.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Period
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
