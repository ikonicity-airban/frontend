import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateTeam,
    useUpdateTeamLead,
    useAddTeamMember,
    useRemoveTeamMember,
    useUpdateMemberRole,
} from '../../api/admin';
import { Team, User, TeamMember } from '../../api/admin';

interface TeamFormProps {
    team?: Team;
    users: User[];
}

const TeamForm: React.FC<TeamFormProps> = ({ team, users }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState(team?.name || '');
    const [description, setDescription] = useState(team?.description || '');
    const [teamLeadId, setTeamLeadId] = useState(team?.teamLeadId || '');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const createTeam = useCreateTeam();
    const updateTeamLead = useUpdateTeamLead();
    const addTeamMember = useAddTeamMember();
    const removeTeamMember = useRemoveTeamMember();
    const updateMemberRole = useUpdateMemberRole();

    useEffect(() => {
        if (team) {
            setName(team.name);
            setDescription(team.description || '');
            setTeamLeadId(team.teamLeadId || '');
            setSelectedUsers(team.members.map((member: TeamMember) => member.userId));
        }
    }, [team]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (id) {
            // Update existing team
            if (teamLeadId !== team?.teamLeadId) {
                await updateTeamLead.mutateAsync({ teamId: id, teamLeadId });
            }
        } else {
            // Create new team
            await createTeam.mutateAsync({
                name,
                description,
                teamLeadId,
            });
        }

        navigate('/teams');
    };

    const handleAddMember = async (userId: string) => {
        if (!id) return;
        await addTeamMember.mutateAsync({
            teamId: id,
            data: { userId },
        });
        setSelectedUsers(prev => [...prev, userId]);
    };

    const handleRemoveMember = async (userId: string) => {
        if (!id) return;
        await removeTeamMember.mutateAsync({ teamId: id, userId });
        setSelectedUsers(prev => prev.filter(id => id !== userId));
    };

    const handleUpdateMemberRole = async (userId: string, isLead: boolean) => {
        if (!id) return;
        await updateMemberRole.mutateAsync({ teamId: id, userId, isLead });
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Team Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="teamLead" className="block text-sm font-medium text-gray-700">
                                Team Lead
                            </label>
                            <select
                                id="teamLead"
                                value={teamLeadId}
                                onChange={(e) => setTeamLeadId(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select Team Lead</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Team Members</label>
                            <div className="mt-2 space-y-2">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleAddMember(user.id);
                                                    } else {
                                                        handleRemoveMember(user.id);
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-900">{user.name}</span>
                                        </div>
                                        {selectedUsers.includes(user.id) && (
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={team?.members.find((m: TeamMember) => m.userId === user.id)?.isLead || false}
                                                    onChange={(e) => handleUpdateMemberRole(user.id, e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-500">Team Lead</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/teams')}
                                className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {id ? 'Update Team' : 'Create Team'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamForm; 