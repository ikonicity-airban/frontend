import React from 'react';
import { useSystemHealth, useSystemStats } from '../../api/system';
import { Activity, Server, Database, AlertCircle } from 'lucide-react';

const HealthMonitor: React.FC = () => {
    const { data: health, isLoading: healthLoading } = useSystemHealth();
    const { data: stats, isLoading: statsLoading } = useSystemStats();

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">System Health</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Monitor system performance and status
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Server className={`h-6 w-6 ${health?.server.status === 'healthy' ? 'text-green-500' : 'text-red-500'
                                    }`} />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Server Status
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {health?.server.status}
                                        </div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            {health?.server.uptime} uptime
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Database className={`h-6 w-6 ${health?.database.status === 'healthy' ? 'text-green-500' : 'text-red-500'
                                    }`} />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Database Status
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {health?.database.status}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Activity className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Active Users
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stats?.activeUsers}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent System Alerts
                    </h3>
                    <div className="mt-5 space-y-4">
                        {health?.alerts.map((alert, index) => (
                            <div
                                key={index}
                                className={`rounded-md ${alert.severity === 'high' ? 'bg-red-50' : 'bg-yellow-50'
                                    } p-4`}
                            >
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className={`h-5 w-5 ${alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                                            }`} />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className={`text-sm font-medium ${alert.severity === 'high' ? 'text-red-800' : 'text-yellow-800'
                                            }`}>
                                            {alert.message}
                                        </h3>
                                        <div className={`mt-2 text-sm ${alert.severity === 'high' ? 'text-red-700' : 'text-yellow-700'
                                            }`}>
                                            <p>{alert.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthMonitor;
