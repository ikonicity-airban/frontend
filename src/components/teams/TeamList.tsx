import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    useTeams,
    useCreateTeam,
    useRemoveTeamMember,
    useUpdateTeamLead,
} from '../../api/admin';
import { Team } from '../../api/admin';
import { useDebounce } from '../../hooks/useDebounce';

const ITEMS_PER_PAGE = 10;

const TeamList: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const navigate = useNavigate();

    const { data: teams, isLoading } = useTeams();
    const createTeam = useCreateTeam();
    const removeTeamMember = useRemoveTeamMember();
    const updateTeamLead = useUpdateTeamLead();

    const filteredTeams = teams?.filter(team =>
        team.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        team.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ) ?? [];

    const totalTeams = filteredTeams.length;
    const totalPages = Math.ceil(totalTeams / ITEMS_PER_PAGE);
    const paginatedTeams = filteredTeams.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleCreateTeam = () => {
        navigate('/teams/new');
    };

    const handleEditTeam = (teamId: string) => {
        navigate(`/teams/${teamId}`);
    };

    const handleRemoveMember = (teamId: string, userId: string) => {
        if (window.confirm('Are you sure you want to remove this member?')) {
            removeTeamMember.mutate({ teamId, userId });
        }
    };

    const handleUpdateTeamLead = (teamId: string, teamLeadId: string) => {
        updateTeamLead.mutate({ teamId, teamLeadId });
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Teams</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage teams and their members ({totalTeams} total)
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-none flex items-center space-x-2">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                name="search"
                                id="search"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Search teams..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleCreateTeam}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Create Team
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Description
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Team Lead
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Members
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Loading teams...
                                                </td>
                                            </tr>
                                        ) : paginatedTeams.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No teams found {searchTerm && `for "${searchTerm}"`}
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedTeams.map((team: Team) => (
                                                <tr key={team.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {team.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {team.description || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {team.teamLead?.name || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <UsersIcon className="h-4 w-4 mr-1" />
                                                            {team.members.length}
                                                        </div>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <button
                                                            onClick={() => handleEditTeam(team.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                            title="Edit Team"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                            <span className="sr-only">Edit {team.name}</span>
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
                                {' '}to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalTeams)}</span>
                                {' '}of <span className="font-medium">{totalTeams}</span> results
                            </p>
                        </div>
                        <div className="flex flex-1 justify-between sm:justify-end">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1 || isLoading}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default TeamList; 