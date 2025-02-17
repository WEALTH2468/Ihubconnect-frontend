import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Avatar, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { removeCustomers, updateCustomer } from '../../store/customersSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';

export default function CustomerDetailHeader({
  handleSubmit,
  customer,
  control,
  isValid,
  dirtyFields,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customerPhoto, setCustomerPhoto] = useState(
    customer.customerPhoto || ''
  );

  const onSubmit = (formValues) => {
    const formData = new FormData();
    formData.append('customerPhoto', customerPhoto);
    formData.append(
      'data',
      JSON.stringify({ ...formValues, category: formValues.category[0] })
    );

    dispatch(updateCustomer({ formData, id: formValues._id })).then(
      (action) => {
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
              message: 'Customers Updated Successfully',
              variant: 'success',
            })
          );
        }
      }
    );
  };

  const handleRemove = (id) => {
    dispatch(removeCustomers([id])).then((action) => {
      if (action.error) {
        dispatch(
          showMessage({
            message: 'An Error Occured while Removing',
            variant: 'error',
          })
        );
      } else {
        dispatch(
          showMessage({
            message: 'Customers Removed Successfully',
            variant: 'success',
          })
        );
      }
    });
    navigate('/crm/customers');
  };

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
      <div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex relative group"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            <Controller
              control={control}
              name="customerPhoto"
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <Avatar
                      sx={{
                        borderWidth: 4,
                        borderStyle: 'solid',
                        borderColor: 'background.paper',
                        backgroundColor: 'background.default',
                        color: 'text.secondary',
                      }}
                      className="w-96 h-96 text-64 font-bold"
                      src={
                        value && value.startsWith('blob')
                          ? value
                          : addBackendProtocol(value)
                      }
                      alt="Samuel.jpg"
                    >
                      {customer?.name.slice(0, 1).toUpperCase()}
                    </Avatar>
                    <div className="border w-full h-full top-0 left-0 right-0 bottom-0 absolute bg-transparent hidden group-hover:flex rounded-full group transition-all duration-300 ease-in-out">
                      <div className="w-full h-full items-center justify-center flex ">
                        <div>
                          <label
                            htmlFor="button-avatar"
                            className="flex p-8 cursor-pointer"
                          >
                            <input
                              accept="image/*"
                              className="hidden"
                              id="button-avatar"
                              type="file"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                setCustomerPhoto(file);
                                onChange(URL.createObjectURL(file));
                              }}
                            />
                            <FuseSvgIcon className="text-white">
                              heroicons-outline:camera
                            </FuseSvgIcon>
                          </label>
                        </div>
                        <IconButton
                          onClick={() => {
                            setCustomerPhoto(null);
                            onChange('');
                          }}
                        >
                          <FuseSvgIcon className="text-white">
                            heroicons-solid:trash
                          </FuseSvgIcon>
                        </IconButton>
                      </div>
                    </div>
                  </>
                );
              }}
            />
          </motion.div>
          <motion.div
            className="flex flex-col min-w-0 mx-8 sm:mx-16 space-y-8"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {customer?.name}
            </Typography>
            <div className="space-y-4">
              <div className="flex items-center gap-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>

                <Typography variant="caption" className="font-medium">
                  {customer?.email}
                </Typography>
              </div>
              <div className="flex items-center gap-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>

                <Typography variant="caption" className="font-medium">
                  {customer?.phoneNumber}
                </Typography>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="flex flex-1 w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        <>
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="error"
            onClick={() => handleRemove(customer._id)}
            startIcon={
              <FuseSvgIcon className="hidden sm:flex">
                heroicons-outline:trash
              </FuseSvgIcon>
            }
          >
            Remove
          </Button>
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            // eslint-disable-next-line no-undef
            disabled={_.isEmpty(dirtyFields) || !isValid}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </>
      </motion.div>
    </div>
  );
}
