import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useUpdateUser } from '../api/users';
import { ArrowLeftIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { UserRoles } from '../lib/roles';
import InputField from '../components/InputField';
import { useNotification } from '../context/NotificationContext';
import { format } from 'date-fns';

type UserFormData = {
    name: string;
    email: string;
    role: UserRoles;
    position?: string;
    department?: string;
    phone?: string;
    createdAt?: string;
    employeeId?: string;
};


const toUserFormData = (user: any): UserFormData => {
    const {
        id,
        createdAt,
        updatedAt,
        ...formData
    } = user;

    return formData;
}

const UserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: user, isLoading } = useUser(id!);
    const updateUser = useUpdateUser(id!);
    const { register, handleSubmit, reset, setValue } = useForm<UserFormData>();
    const { showNotification } = useNotification();

    React.useEffect(() => {
        if (user) {
            reset(user);
            setValue('createdAt', format(new Date(user.createdAt), 'yyyy-MM-dd'));
        }
    }, [user, reset]);

    const onSubmit = async (data: UserFormData) => {
        try {
            const newData = toUserFormData({ ...user, ...data });
            console.log(newData);
            await updateUser.mutateAsync(newData);
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
                                <InputField label="Role" name="role" register={register} />
                                <InputField label="Position" name="position" register={register} />
                                <InputField label="Department" name="department" register={register} />
                                <InputField label="Phone" name="phone" type="tel" register={register} />
                                <InputField label="Hire Date" name="createdAt" type='date' initialValue={format(new Date(user.createdAt), 'yyyy-MM-dd')} register={register} />
                                <InputField label="Employee ID" name="id" disabled register={register} />
                                {/* <InputField label="Employee ID" name="id" disabled value={user.id} /> */}
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
