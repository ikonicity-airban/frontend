import React from 'react';

type Quarter = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'completed';
};

const sampleQuarters: Quarter[] = [
    {
        id: '1',
        name: 'Q1 2024',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        status: 'upcoming',
    },
    {
        id: '2',
        name: 'Q4 2023',
        startDate: '2023-10-01',
        endDate: '2023-12-31',
        status: 'active',
    },
    {
        id: '3',
        name: 'Q3 2023',
        startDate: '2023-07-01',
        endDate: '2023-09-30',
        status: 'completed',
    },
];

const TimelineView: React.FC = () => {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Evaluation Timeline</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage evaluation periods and deadlines
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Create New Quarter
                        </button>
                    </div>
                </div>
                <div className="mt-8 space-y-6">
                    {sampleQuarters.map((quarter) => (
                        <div
                            key={quarter.id}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {quarter.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {quarter.startDate} - {quarter.endDate}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${quarter.status === 'upcoming'
                                                ? 'bg-blue-100 text-blue-800'
                                                : quarter.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {quarter.status.charAt(0).toUpperCase() + quarter.status.slice(1)}
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-4 text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;
