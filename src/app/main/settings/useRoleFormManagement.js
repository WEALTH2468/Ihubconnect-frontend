import { yupResolver } from '@hookform/resolvers/yup';
import { addRole, updateRole } from 'app/store/roleSlice';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

export default function useRoleFormManagement(data) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const defaultValues = {
        name: data?.name || '',
        description: data?.description || '',
        permissions: data?.permissions || [],
        isActive: data?.isActive || true,
    };


    const schema = yup.object().shape({
        // Form schema
    });
    const { control, reset, handleSubmit, formState, watch } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema), // add schema here
    });

    const { isValid, dirtyFields, errors } = formState;
    const form = watch();

    useEffect(() => {
        reset(defaultValues);
    }, [data, reset]);

    const onSubmit = (arg) => (formData) => {
        if (!data) {
            // add a new role
            dispatch(addRole({ ...formData }));
            reset({
                name: '',
                description: '',
                permissions: [],
                isActive: true,
            });
        } else {
            // update the existing role
            dispatch(updateRole({ _id: data._id, ...formData }));
            reset({
                name: '',
                description: '',
                permissions: [],
                isActive: true,
            });
        }
        navigate('/settings');
    };

    return { control, onSubmit, handleSubmit, errors, isValid };
}
