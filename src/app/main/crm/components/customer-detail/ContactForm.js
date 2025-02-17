import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { TextField, Typography, Button } from '@mui/material';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useNavigate, useParams } from 'react-router-dom';
import { selectCustomerById, updateCustomer } from '../../store/customersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

const schema = yup.object().shape({});

export default function ContactForm({ contact }) {
  const navigate = useNavigate();
  const defaultValues = {
    name: contact?.name || '',
    city: contact?.city || '',
    country: contact?.country || '',
    email: contact?.email || '',
    phoneNumber: contact?.phoneNumber || '',
  };

  const { id } = useParams();
  const customer = useSelector((state) => selectCustomerById(state, id));

  const { control, watch, handleSubmit, reset, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const dispatch = useDispatch();

  const onSubmit = (formValues) => {
    const formData = new FormData();
    formData.append(
      'data',
      JSON.stringify({
        ...customer,
        contacts: [...customer.contacts, formValues],
      })
    );

    dispatch(updateCustomer({ formData, id })).then((action) => {
      if (action.error) {
        dispatch(
          showMessage({
            message: 'An Error Occured while Updating',
            variant: 'error',
          })
        );
      } else {
        dispatch(
          showMessage({
            message: 'Contact Added Successfully',
            variant: 'success',
          })
        );
        navigate(`/crm/customers/${id}`);
      }
    });
  };

  const { isValid, dirtyFields, errors } = formState;

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
                {contact ? 'Update a Contact' : 'Add a Contact'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Contact Detail
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
            to={`/crm/customers/${id}`}
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
                label="Contact Name"
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
                label="Email"
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
                label="Phone Number"
                {...field}
                variant="outlined"
                error={!!errors?.phoneNumber}
                helperText={errors?.phoneNumber?.message}
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
                  label="City"
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
                  label="Country"
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
