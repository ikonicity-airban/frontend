import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import TeamForm from '../components/teams/TeamForm';

const TeamFormPage: React.FC = () => {
    const { id } = useParams();
    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: adminApi.getAllUsers,
    });

    const { data: team } = useQuery({
        queryKey: ['team', id],
        queryFn: () => (id ? adminApi.getTeam(id) : undefined),
        enabled: !!id,
    });

    return <TeamForm team={team} users={users} />;
};

export default TeamFormPage; 