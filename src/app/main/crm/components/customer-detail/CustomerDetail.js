import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useEffect, useState, lazy } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Autocomplete,
  FormControlLabel,
  Grid,
  RadioGroup,
  TextField,
  Radio,
} from '@mui/material';
import CustomerDetailHeader from './CustomerDetailHeader';
import reducer from '../../store';
import QuoteTab from './QuoteTab';

import {
  getCustomers,
  selectLoadingFetch,
  selectIsFetched,
  selectCustomerById,
} from '../../store/customersSlice';
import {
  getQuotes,
  selectIsFetched as selectIsQuoteFetched,
  selectQuotes,
} from '../../store/quotesSlice';
import ContactTab from './ContactTab';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import CustomerSidebarContent from '../customers/CustomerSidebarContent';
import CustomerDetailSidebarContent from './CustomerDetailSidebarContent';
import {
  selectCategories,
  categorySelector,
  selectLoadingFetch as selectLoadingCategoriesFetch,
  getCategories,
} from '../../store/categorySlice';

const schema = yup.object().shape({});

function CustomerDetail() {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const routeParams = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const quotes = useSelector(selectQuotes);
  const isFetched = useSelector(selectIsQuoteFetched);
  const categories = useSelector(categorySelector.selectAll);
  const loadingCategories = useSelector((state) =>
    selectLoadingCategoriesFetch(state)
  );


  useEffect(() => {
    if (!isFetched) {
      dispatch(getQuotes());
    }
  }, [dispatch, isFetched]);

  useEffect(() => {
    const path = location.pathname;
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];

    if (lastSegment !== 'new') {
      setRightSidebarOpen(false);
    }
  }, [location]);

  const [tabValue, setTabValue] = useState(0);
  const loadingFetch = useSelector(selectLoadingFetch);

  const isQuoteFetched = useSelector(selectIsFetched);

  const customer = useSelector((state) =>
    selectCustomerById(state, routeParams.id)
  );

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  useEffect(() => {
    if (loadingCategories) {
      dispatch(getCategories());
    }
  }, []);

  useEffect(() => {
    if (!isQuoteFetched) {
      dispatch(getCustomers());
    }
  }, [isQuoteFetched, dispatch]);

  const defaultValues = {};

  const { control, watch, handleSubmit, reset, formState, getValues } = useForm(
    {
      mode: 'onChange',
      resolver: yupResolver(schema),
      defaultValues,
    }
  );
  const { isValid, dirtyFields, errors } = formState;

  const [type, setType] = useState('');

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

  useEffect(() => {
    if (customer) {
      const customerWithCategory = {
        ...customer,
        category: [customer.category],
      };
      reset(customerWithCategory);
      setType(customer.type);
    }
  }, [customer]);

  // get the quotes that relates to the customer
  const customerQuotes = quotes?.filter(
    (quote) => quote.customer._id === customer?._id
  );

  const formControlLabelStyle = {
    '& .MuiFormControlLabel-label': {
      fontSize: '11px',
    },
  };

  if (loadingFetch) {
    return <FuseLoading />;
  }
  return (
    <FusePageCarded
      header={
        <CustomerDetailHeader
          handleSubmit={handleSubmit}
          control={control}
          customer={customer}
          isValid={isValid}
          dirtyFields={dirtyFields}
        />
      }
      content={
        <div className="px-24 sm:px-48">
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="w-full flex flex-col flex-auto items-start ">
                <div className="flex flex-row space-x-16 w-full">
                  <Grid className="mt-32 border w-full" container spacing={0}>
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
                            ? categories.find((option) => {
                                return option._id === value[0];
                              })
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
                </div>

                <div className="flex flex-row space-x-16 w-full">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field, value }) => (
                      <TextField
                        id=""
                        value={value}
                        size="small"
                        className="mt-32"
                        label="Name"
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
                </div>

                <div className="flex flex-row space-x-16 w-full">
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

                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <TextField
                        id=""
                        size="small"
                        className="mt-32"
                        label="Address"
                        {...field}
                        variant="outlined"
                        error={!!errors?.address}
                        helperText={errors?.address?.message}
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className="flex flex-row space-x-16 w-full">
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

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: 'w-full h-64 border-b-1' }}
          >
            <Tab className="h-64" label="Contacts" />
            <Tab className="h-64" label="Quotes" />
          </Tabs>
          <div className="p-16 sm:p-24 w-full">
            <div>
              {tabValue === 0 && (
                <ContactTab
                  customer={customer}
                  id={customer?._id}
                  setRightSidebarOpen={setRightSidebarOpen}
                />
              )}
            </div>

            {tabValue === 1 && (
              <QuoteTab
                quotes={customerQuotes}
                setRightSidebarOpen={setRightSidebarOpen}
              />
            )}
          </div>
        </div>
      }
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarContent={<CustomerDetailSidebarContent />}
      rightSidebarWidth={540}
      scroll="page"
    />
  );
}

export default withReducer('crmApp', reducer)(CustomerDetail);
