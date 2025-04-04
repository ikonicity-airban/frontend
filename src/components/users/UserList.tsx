import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    useUsers,
    useDeleteUser,
    useStaff,
    useLeads,
    useHrUsers,
    useDirectors,
    useEmployees
} from '../../api/users';

const UserList: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const navigate = useNavigate();

    // Query hooks for different user roles
    const { data: allUsers, isLoading: isLoadingAll } = useUsers();
    const { data: staffUsers, isLoading: isLoadingStaff } = useStaff();
    const { data: leadUsers, isLoading: isLoadingLeads } = useLeads();
    const { data: hrUsers, isLoading: isLoadingHr } = useHrUsers();
    const { data: directorUsers, isLoading: isLoadingDirectors } = useDirectors();
    const { data: employeeUsers, isLoading: isLoadingEmployees } = useEmployees();
    const deleteUser = useDeleteUser();

    const isLoading = isLoadingAll || isLoadingStaff || isLoadingLeads ||
        isLoadingHr || isLoadingDirectors || isLoadingEmployees;

    const getUsersByRole = () => {
        switch (selectedRole) {
            case 'staff': return staffUsers;
            case 'leads': return leadUsers;
            case 'hr': return hrUsers;
            case 'directors': return directorUsers;
            case 'employees': return employeeUsers;
            default: return allUsers;
        }
    };

    const users = getUsersByRole();

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage user accounts and permissions
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="mr-4 rounded-md border-gray-300 py-2 px-3 text-sm"
                        >
                            <option value="all">All Users</option>
                            <option value="staff">Staff</option>
                            <option value="leads">Team Leads</option>
                            <option value="hr">HR</option>
                            <option value="directors">Directors</option>
                            <option value="employees">Employees</option>
                        </select>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add User
                        </button>
                    </div>
                </div>
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                            Name
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Email
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Role
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th className="relative py-3.5 pl-3 pr-4">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                Loading users...
                                            </td>
                                        </tr>
                                    ) : users?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        users?.map((user) => (
                                            <tr key={user.id} className='hover:bg-gray-100 cursor-pointer' onClick={() => navigate(`/users/${user.id}`)}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                                                    <div className="font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-gray-500">{user.username}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {user.email}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {user.role}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => navigate(`/users/${user.id}`)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser.mutate(user.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
