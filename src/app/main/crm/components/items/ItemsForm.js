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
import { addItem, selectItemById, updateItem } from '../../store/itemsSlice';

// Form Validation

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  type: yup.string().required('Type is required'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive'),
  discount: yup.number().min(0, 'Discount must be at least 0'),
  vat: yup.number().min(0, 'VAT must be at least 0'),
});

export default function ItemsForm() {
  const params = useParams();

  const data = useSelector((state) => selectItemById(state, params.id));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [type, setType] = useState(data?.type || '');

  const defaultValues = {
    name: data?.name || '',
    description: data?.description || '',
    type: data?.type || '',
    price: data?.price || 0,
  };

  const { control, watch, handleSubmit, formState, reset } = useForm({
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

  useEffect(() => {
    if (data) {
      setType(data?.type);
      reset(data);
    } else {
      reset(defaultValues);
      setType('');
    }
  }, [data]);

  const onSubmit = (formData) => {
    if (data) {
      dispatch(updateItem({ ...data, ...formData })).then((action) => {
        if (action.error) {
          dispatch(
            showMessage({
              message: 'An Error Occurred While Updating the Item',
              variant: 'error',
            })
          );
          navigate('/crm/items');
        } else {
          dispatch(
            showMessage({
              message: 'Item Updated Successfully',
              variant: 'success',
            })
          );
          navigate('/crm/items');
        }
      });
    } else {
      dispatch(addItem(formData)).then((action) => {
        if (action.error) {
          dispatch(
            showMessage({
              message: 'An Error Occurred While Adding the Item',
              variant: 'error',
            })
          );
          navigate('/crm/items');
        } else {
          dispatch(
            showMessage({
              message: 'Item Added Successfully',
              variant: 'success',
            })
          );
          navigate('/crm/items');
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
                {data ? 'Update' : 'Add'} an Item
              </Typography>
              <Typography variant="caption" className="font-medium">
                Item Detail
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
                    onClick={(e) => {
                      setType(e.target.value);
                    }}
                    {...field}
                    row
                    value={type}
                  >
                    <FormControlLabel
                      value="Goods"
                      control={<Radio size="small" />}
                      label="Goods"
                      checked={type === 'Goods'}
                      sx={{ ...formControlLabelStyle }}
                    />
                    <FormControlLabel
                      value="Services"
                      control={<Radio size="small" />}
                      label="Services"
                      checked={type === 'Services'}
                      sx={{ ...formControlLabelStyle }}
                    />
                  </RadioGroup>
                )}
              />
            </Grid>
          </Grid>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Item Name"
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
                label="Item Description"
                {...field}
                variant="outlined"
                error={!!errors?.description}
                helperText={errors?.description?.message}
                fullWidth
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <TextField
                id=""
                size="small"
                className="mt-32"
                label="Price"
                {...field}
                variant="outlined"
                error={!!errors?.price}
                helperText={errors?.price?.message}
                required
                type="number"
                fullWidth
              />
            )}
          />
        </div>
      </form>
    </div>
  );
}
