import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import * as yup from 'yup';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import {
  addCategory,
  selectCategoryById,
  updateCategory,
} from '../../store/categorySlice';

// Form Validation

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
});

export default function CategoryForm() {
  const params = useParams();

  const data = useSelector((state) => selectCategoryById(state, params.id));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const defaultValues = {
    name: data?.name || '',
    description: data?.description || '',
  };

  const { control, watch, handleSubmit, formState, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { isValid, dirtyFields, errors } = formState;

  const formControlLabelStyle = {
    '& .MuiFormControlLabel-label': {
      fontSize: '11px',
    },
  };


  const onSubmit = (formData) => {
    if (data) {
      dispatch(updateCategory({ ...data, ...formData })).then((action) => {
        if (action.error) {
          console.error('action error', action.error);
          dispatch(
            showMessage({
              message: 'An Error Occurred While Updating the Item',
              variant: 'error',
            })
          );
          navigate('/crm/categories');
        } else {
          dispatch(
            showMessage({
              message: 'Item Updated Successfully',
              variant: 'success',
            })
          );
          navigate('/crm/categories');
        }
      });
    } else {
      dispatch(addCategory(formData)).then((action) => {
        if (action.error) {
          dispatch(
            showMessage({
              message: 'An Error Occurred While Adding the Category',
              variant: 'error',
            })
          );
          navigate('/crm/categories');
        } else {
          dispatch(
            showMessage({
              message: 'Category Added Successfully',
              variant: 'success',
            })
          );
          navigate('/crm/categories');
        }
      });
    }
  };

  return (
    <div className="flex flex-col my-32 md:ltr:pr-32 md:rtl:pl-32 ">
      <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
        <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
          <div className="flex items-center max-w-full">
            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {data ? 'Update' : 'Add'} a Category
              </Typography>
              <Typography variant="caption" className="font-medium">
                Category Detail
              </Typography>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
        >
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to="/crm/categories/"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </motion.div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative flex flex-col flex-auto items-start px-24 sm:px-48">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Category Name"
                {...field}
                variant="outlined"
                error={!!errors?.name}
                helperText={errors?.name?.message}
                required
                fullWidth
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Category Description"
                {...field}
                variant="outlined"
                error={!!errors?.description}
                helperText={errors?.description?.message}
                fullWidth
              />
            )}
          />
        </div>
      </form>
    </div>
  );
}
