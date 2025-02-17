import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useNavigate } from 'react-router-dom';
import {
  getCustomers,
  selectCustomers,
  selectIsFetched,
  selectLoadingFetch,
} from '../../store/customersSlice';
import { addQuote } from '../../store/quotesSlice';

// Form Validation

const schema = yup.object().shape({});

export default function QuotesForm() {
  const navigate = useNavigate();
  const customers = useSelector(selectCustomers);
  const isFetched = useSelector(selectIsFetched);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetched) {
      dispatch(getCustomers());
    }
  }, [dispatch, isFetched]);

  const defaultValues = {
    title: '',
    attention: '',
    quoteDate: new Date(),
    dueDate: new Date(),
  };

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
    defaultValues,
  });
  const { isValid, dirtyFields, errors } = formState;

  const form = watch();
  const formControlLabelStyle = {
    '& .MuiFormControlLabel-label': {
      fontSize: '11px',
    },
  };

  const onSubmit = (formValues) => {
    dispatch(
      addQuote({ ...formValues, customerId: formValues.customer[0] })
    ).then((action) => {
      if (action.error) {
        dispatch(
          showMessage({
            message: 'An Error Occured During while Adding a Quote',
            variant: 'error',
          })
        );
        navigate('/crm/quotes');
      } else {
        dispatch(
          showMessage({
            message: 'Quote Added Successfully',
            variant: 'success',
          })
        );
        navigate('/crm/quotes');
      }
    });
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
                Add a Quote
              </Typography>
              <Typography variant="caption" className="font-medium">
                Quote Detail
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
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Title"
                {...field}
                variant="outlined"
                error={!!errors?.title}
                helperText={errors?.title?.message}
                required
                fullWidth
              />
            )}
          />

          <Controller
            control={control}
            name="customer"
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple={false}
                id="customer"
                className="mt-32"
                size="small"
                options={customers}
                disableCloseOnSelect={false}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(_props, option, { selected }) => (
                  <li {..._props}>{option?.name}</li>
                )}
                value={
                  value
                    ? customers.find((customer) => customer._id === value[0])
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
                required
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    label="Customer"
                    placeholder="Customer"
                  />
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="attention"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Attention"
                {...field}
                variant="outlined"
                error={!!errors?.attention}
                helperText={errors?.attention?.message}
                required
                fullWidth
              />
            )}
          />

          <div className="flex flex-row space-x-16">
            <Controller
              control={control}
              name="quoteDate"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  className="mt-32 w-full"
                  label="Quote Date"
                  variant="outlined"
                  clearable
                  showTodayButton
                  error={!!errors.quoteDate}
                  helperText={errors?.quoteDate?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  className="mt-32 w-full"
                  label="Due Date"
                  variant="outlined"
                  clearable
                  showTodayButton
                  error={!!errors.dueDate}
                  helperText={errors?.dueDate?.message}
                  required
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
