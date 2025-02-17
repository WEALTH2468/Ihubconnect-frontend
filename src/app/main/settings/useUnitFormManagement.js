import { yupResolver } from '@hookform/resolvers/yup';
import { addUnit, updateUnit } from 'app/store/settingsSlice';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

export default function useUnitFormManagement(data) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const defaultValues = {
        department: data?.department || '',
        unit: data?.name || '',
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
    }, [reset]);

    const onSubmit = (arg) => (formData) => {
        if (!data) {
            // add a new unit
            dispatch(
                addUnit({
                    name: formData.unit,
                    departmentId: formData.department._id,
                })
            );
            reset({
                name: '',
                description: '',
            });
        } else {
            // update the existing unit
            dispatch(
                updateUnit({
                    _id: data._id,
                    name: formData.unit,
                    departmentId: formData.department._id,
                })
            );
            reset({
                name: '',
                description: '',
            });
        }
        navigate('/settings');
    };

    return { control, onSubmit, handleSubmit, errors, isValid };
}
