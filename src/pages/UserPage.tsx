import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useUpdateUser } from '../api/users';
import { ArrowLeftIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { UserRoles } from '../lib/roles';
import { User } from '../api/types';
import InputField from '../components/InputField';
import { useNotification } from '../context/NotificationContext';

type UserFormData = {
    name: string;
    email: string;
    username: string;
    role: UserRoles;
    position?: string;
    department?: string;
    phone?: string;
    address?: string;
    hireDate?: string;
    employeeId?: string;
};

const UserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: user, isLoading } = useUser(id!);
    const updateUser = useUpdateUser(id!);
    const { register, handleSubmit, reset } = useForm<UserFormData>();
    const { showNotification } = useNotification();

    React.useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

    const onSubmit = async (data: UserFormData) => {
        try {
            await updateUser.mutateAsync(data);
            showNotification('success', 'User updated successfully');
        } catch (error) {
            console.error('Failed to update user:', error);
            showNotification('error', 'Failed to update user');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <button
                    onClick={() => navigate('/users')}
                    className="mr-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
            </div>

            {user && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-lg p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Personal Information</h3>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                                <InputField label="Name" name="name" register={register} />
                                <InputField label="Email" name="email" type="email" register={register} />
                                <InputField label="Username" name="username" register={register} />
                                <InputField label="Role" name="role" register={register} />
                                <InputField label="Position" name="position" register={register} />
                                <InputField label="Department" name="department" register={register} />
                                <InputField label="Phone" name="phone" type="tel" register={register} />
                                <InputField label="Address" name="address" register={register} />
                                <InputField label="Hire Date" name="hireDate" type="date" register={register} />
                                <InputField label="Employee ID" name="employeeId" register={register} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                disabled={updateUser.isPending}
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Update User
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserPage;
