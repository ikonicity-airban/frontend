import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    register: UseFormRegister<any>;
    className?: string;
    disabled?: boolean;
    initialValue?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = 'text', register, className, ...rest }) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                {...rest}
                {...register(name)}
                type={type}
                className="mt-1 p-3 block w-full rounded-md border-gray-300 border-[0.1px] shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
        </div>
    );
};

export default InputField;
