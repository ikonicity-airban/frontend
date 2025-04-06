import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    useUsers,   
    useDeleteUser,
} from '../../api/users';
import { User } from '../../api/types'; 
import { useDebounce } from '../../hooks/useDebounce'; 

const ITEMS_PER_PAGE = 10;

const UserList: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300); 
    const navigate = useNavigate();

    const { data: usersData, isLoading, isPlaceholderData } = useUsers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        role: selectedRole === 'all' ? undefined : selectedRole.toUpperCase(), 
        search: debouncedSearchTerm,
    });

    const users = usersData?.data ?? [];
    const totalUsers = usersData?.total ?? 0;
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

    const deleteUser = useDeleteUser();

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRole, debouncedSearchTerm]);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage user accounts ({totalUsers} total)
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-none flex items-center gap-3">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                name="search"
                                id="search"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="STAFF">Staff</option>
                            <option value="LEAD">Team Leads</option>
                            <option value="HR">HR</option>
                            <option value="DIRECTOR">Directors</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => navigate('/users/new')}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add User
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                            <div className={`overflow-hidden shadow-md rounded-lg border border-gray-200 ${isPlaceholderData ? 'opacity-50' : ''}`}>
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Phone
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Address
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Email
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Role
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {isLoading && !isPlaceholderData ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Loading users...
                                                </td>
                                            </tr>
                                        ) : users.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No users found {searchTerm && `for "${searchTerm}"`} {selectedRole !== 'all' && `with role ${selectedRole}`}.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user: User) => ( 
                                                <tr key={user.id} className='hover:bg-gray-50'>
                                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {user.phone || '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {user.address || '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {user.role}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {user.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/users/${user.id}`) }}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                            title="Edit User"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                            <span className="sr-only">Edit {user.name}</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); deleteUser.mutate(user.id) }}
                                                            className="text-red-600 hover:text-red-900"
                                                            disabled={deleteUser.isPending}
                                                            title="Delete User"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                            <span className="sr-only">Delete {user.name}</span>
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

                {totalPages > 1 && (
                    <nav
                        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4"
                        aria-label="Pagination"
                    >
                        <div className="hidden sm:block">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                                {' '}to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)}</span>
                                {' '}of <span className="font-medium">{totalUsers}</span> results
                            </p>
                        </div>
                        <div className="flex flex-1 justify-between sm:justify-end">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1 || isLoading}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages || isLoading}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default UserList;
