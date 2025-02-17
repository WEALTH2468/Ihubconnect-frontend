import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

import {
  Radio,
  FormControlLabel,
  RadioGroup,
  TextField,
  Grid,
} from '@mui/material';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useNavigate } from 'react-router-dom';
import { addCustomer } from '../../store/customersSlice';
import {
  categorySelector,
  getCategories,
  selectCategories,
  selectLoadingFetch,
} from '../../store/categorySlice';

// Form Validation

const schema = yup.object().shape({
  name: yup.string().required('Customer Name is required'),
  email: yup.string().email('Invalid Email').required('Email is required'),
  phoneNumber: yup.string().required('Phone Number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  category: yup.array().required('Category is required'),
  type: yup.string().required('Type is required'),
});

export default function CustomersForm() {
  const [type, setType] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(categorySelector.selectAll);
  const loadingCategories = useSelector((state) => selectLoadingFetch(state));


  const defaultValues = {};

  const {
    resetField,
    control,
    watch,
    reset,
    handleSubmit,
    formState,
    getValues,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;

  const form = watch();
  const formControlLabelStyle = {
    '& .MuiFormControlLabel-label': {
      fontSize: '11px',
    },
  };

  const handleChange = (event) => {
    const val = event.target.value;
    switch (val) {
      case 'Individual':
        setType('Individual');
        break;
      case 'Organization':
        setType('Organization');
        break;
      default:
        break;
    }
  };

  const onSubmit = (formValues) => {
    dispatch(
      addCustomer({ ...formValues, category: formValues.category[0] })
    ).then((action) => {
      if (action.error) {
        dispatch(
          showMessage({
            message: 'An Error Occured During while Adding a Customer',
            variant: 'error',
          })
        );
        navigate('/crm/customers');
      } else {
        dispatch(
          showMessage({
            message: 'Customers Added Successfully',
            variant: 'success',
          })
        );
        navigate('/crm/customers');
      }
    });
  };

  useEffect(() => {
    if (loadingCategories) {
      dispatch(getCategories());
    }
  }, []);

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
                Add a Customer
              </Typography>
              <Typography variant="caption" className="font-medium">
                Customer Detail
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
            to="/crm/customers/"
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
          <Grid className="mt-32  border" container spacing={0}>
            <Grid className="ml-20" item xs={12}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    size="small"
                    onClick={handleChange}
                    {...field}
                    row
                    value={type}
                  >
                    <FormControlLabel
                      value="Individual"
                      control={<Radio size="small" />}
                      label="Individual"
                      checked={type === 'Individual'}
                      sx={{ ...formControlLabelStyle }}
                    />
                    <FormControlLabel
                      value="Organization"
                      control={<Radio size="small" />}
                      label="Organization"
                      checked={type === 'Organization'}
                      sx={{ ...formControlLabelStyle }}
                    />
                  </RadioGroup>
                )}
              />
            </Grid>
          </Grid>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple={false}
                id="category"
                className="mt-32"
                size="small"
                options={categories}
                disableCloseOnSelect={false}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(_props, option, { selected }) => (
                  <li {..._props}>{option?.name}</li>
                )}
                value={
                  value
                    ? categories.find((dept) => dept._id === value[0])
                    : null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    onChange([newValue._id]);
                  } else {
                    onChange([]);
                  }
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    label="Category"
                    placeholder="category"
                  />
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Customer Name"
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
            name="email"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Customer Email"
                {...field}
                variant="outlined"
                error={!!errors?.email}
                helperText={errors?.email?.message}
                required
                fullWidth
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Customer Phone Number"
                {...field}
                variant="outlined"
                error={!!errors?.phoneNumber}
                helperText={errors?.phoneNumber?.message}
                required
                fullWidth
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Customer Address"
                {...field}
                variant="outlined"
                error={!!errors?.address}
                helperText={errors?.address?.message}
                required
                fullWidth
              />
            )}
          />

          <div className="flex flex-row space-x-16">
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <TextField
                  id=""
                  size="small"
                  className="mt-32"
                  label="Customer City"
                  {...field}
                  variant="outlined"
                  error={!!errors?.city}
                  helperText={errors?.city?.message}
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <TextField
                  id=""
                  size="small"
                  className="mt-32"
                  label="Customer Country"
                  {...field}
                  variant="outlined"
                  error={!!errors?.country}
                  helperText={errors?.country?.message}
                  required
                  fullWidth
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
