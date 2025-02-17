import { yupResolver } from '@hookform/resolvers/yup';
import { addDepartment, updateDepartment } from 'app/store/settingsSlice';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

export default function useDepartmentFormManagement(data) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const defaultValues = {
        name: data?.name || '',
        description: data?.description || '',
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
            // add a new department
            dispatch(addDepartment({ ...formData }));
            reset({
                name: '',
                description: '',
            });
        } else {
            // update the existing department
            dispatch(updateDepartment({ _id: data._id, ...formData }));
            reset({
                name: '',
                description: '',
            });
        }
        navigate('/settings');
    };

    return { control, onSubmit, handleSubmit, errors, isValid };
}
