import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import FuseLoading from '@fuse/core/FuseLoading';
import {
  getCustomers,
  selectCustomers,
  selectIsFetched,
  selectLoadingFetch,
} from '../../store/customersSlice';
import ItemTab from './ItemTab';
import PaymentTerms from './PaymentTerms';
import currencyToSymbolMap from 'currency-symbol-map/map';
import { selectUser } from 'app/store/userSlice';

/**
 * @function QuoteFormFields
 * @description Renders the form fields for the quote.
 * @param {Object} props - The component props.
 * @param {Object} props.control - The react-hook-form control object.
 * @param {Object} props.errors - The errors object for form validation.
 * @param {Array} props.customers - The list of customers.
 * @param {Array} props.statuses - The list of statuses.
 * @param {Array} props.currencies - The list of currencies.
 * @param {string} props.showTotal - The value for show total radio group.
 * @param {string} props.showPrice - The value for show price radio group.
 * @param {Function} props.setShowTotal - The setter function for show total.
 * @param {Function} props.setShowPrice - The setter function for show price.
 * @param {Object} props.formControlLabelStyle - The styles for form control labels.
 * @param {Object} props.quote - The quote object.
 */
function QuoteFormFields({
  control,
  errors,
  stage,
  setStage,
  customers,
  statuses,
  currencies,
  showTotal,
  showPrice,
  setShowTotal,
  setShowPrice,
  formControlLabelStyle,
  quote,
}) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-between space-x-12">
        <ControllerField
          control={control}
          name="quoteNo"
          label="Quote No"
          type="text"
          errors={errors}
          disabled
        />
        <ControllerField
          control={control}
          name="title"
          label="Title"
          type="text"
          errors={errors}
        />
        <ControllerField
          control={control}
          name="attention"
          label="Attention"
          type="text"
          errors={errors}
        />
        <ControllerCheckbox
          name="stage"
          control={control}
          options={stage}
          setOptions={setStage}
        />
      </div>
      <div className="flex flex-row justify-between space-x-12">
        <ControllerAutocomplete
          control={control}
          name="customer"
          label="Customer"
          options={customers}
          errors={errors}
        />
        <ControllerAutocomplete
          control={control}
          name="status"
          label="Status"
          options={statuses}
          errors={errors}
        />
        <ControllerDatePicker
          control={control}
          name="quoteDate"
          label="Quote Date"
          errors={errors}
          quote={quote}
        />
        <ControllerDatePicker
          control={control}
          name="dueDate"
          label="Due Date"
          errors={errors}
          quote={quote}
        />
      </div>
      <div className="flex flex-row justify-between w-full space-x-12">
        <ControllerField
          control={control}
          name="discount"
          label="Discount"
          type="number"
          errors={errors}
        />
        <ControllerField
          control={control}
          name="vat"
          label="VAT%"
          type="number"
          errors={errors}
        />
        <ControllerField
          control={control}
          name="increaseRatio"
          label="Increase Ratio"
          type="number"
          errors={errors}
        />
        <ControllerCurrencyAutocomplete
          control={control}
          name="currency"
          label="Currency"
          options={currencies}
          errors={errors}
        />
        <GridRadioGroup
          control={control}
          name="showTotal"
          label="Show Total"
          value={showTotal}
          setValue={setShowTotal}
          options={['Yes', 'No']}
          formControlLabelStyle={formControlLabelStyle}
        />
        <GridRadioGroup
          control={control}
          name="showPrice"
          label="Show Price"
          value={showPrice}
          setValue={setShowPrice}
          options={['Yes', 'No']}
          formControlLabelStyle={formControlLabelStyle}
        />
      </div>
    </div>
  );
}

/**
 * @function ControllerField
 * @description A reusable component for rendering a TextField with react-hook-form Controller.
 * @param {Object} props - The component props.
 */
function ControllerField({ control, name, label, errors, type, disabled = false }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, value }) => (
        <TextField
          value={value}
          size="small"
          className="mt-32"
          label={label}
          {...field}
          type={type}
          variant="outlined"
          disabled={disabled}
          error={!!errors?.[name]}
          helperText={errors?.[name]?.message}
          required
          fullWidth
        />
      )}
    />
  );
}

function ControllerCheckbox({ control, name, options, setOptions }) {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const user = useSelector(selectUser);

  const handleChange = (id) => {
    const updatedOptions = options.map((option) => {
      if (option.id === id) {
        return {
          ...option,
          value: option.value ? null : user._id,
        };
      }
      return option;
    });

    setOptions(updatedOptions);
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormGroup {...field} c>
          <div className="relative flex items-center justify-center gap-2 border px-12 h-full mt-32">
            {options.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    {...label}
                    checked={option.value !== null}
                    onChange={() => {
                      handleChange(option.id);
                      field.onChange(options);
                    }}
                  />
                }
                label={option?.name}
              />
            ))}
            <p className="px-8 bg-white text-[#a0a5b3] absolute -top-8 left-12 text-sm z-10">
              Stage
            </p>
          </div>
        </FormGroup>
      )}
    />
  );
}

/**
 * @function ControllerAutocomplete
 * @description A reusable component for rendering an Autocomplete with react-hook-form Controller.
 * @param {Object} props - The component props.
 */
function ControllerAutocomplete({ control, name, label, options, errors }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          multiple={false}
          id={name}
          className="mt-32"
          size="small"
          options={options}
          disableCloseOnSelect={false}
          getOptionLabel={(option) => option?.name || option || ''}
          isOptionEqualToValue={(option) =>
            option._id === value?._id || option === value
          }
          renderOption={(_props, option) => (
            <li {..._props}>{option?.name || option}</li>
          )}
          value={
            value
              ? options.find(
                  (option) => option._id === value?._id || option === value
                )
              : null
          }
          onChange={(event, newValue) => {
            onChange(newValue || null);
          }}
          fullWidth
          renderInput={(params) => (
            <TextField
              size="small"
              {...params}
              label={label}
              placeholder={label}
            />
          )}
        />
      )}
    />
  );
}

function ControllerCurrencyAutocomplete({
  control,
  name,
  label,
  options,
  errors,
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          multiple={false}
          id={name}
          className="mt-32"
          size="small"
          options={options}
          disableCloseOnSelect={false}
          getOptionLabel={(option) =>
            `${option.name} ${option?._id} ` || option || ''
          }
          isOptionEqualToValue={(option) =>
            option._id === value?._id || option === value
          }
          renderOption={(_props, option) => (
            <li {..._props}>{`${option.name} ${option?._id} ` || option}</li>
          )}
          value={
            value
              ? options.find(
                  (option) => option._id === value?._id || option === value
                )
              : null
          }
          onChange={(event, newValue) => {
            onChange(newValue || null);
          }}
          fullWidth
          renderInput={(params) => (
            <TextField
              size="small"
              {...params}
              label={label}
              placeholder={label}
            />
          )}
        />
      )}
    />
  );
}

/**
 * @function ControllerDatePicker
 * @description A reusable component for rendering a DatePicker with react-hook-form Controller.
 * @param {Object} props - The component props.
 */
function ControllerDatePicker({ control, name, label, errors, quote }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DatePicker
          {...field}
          className="mt-32 w-full"
          label={label}
          sx={{ height: '37.13px' }}
          variant="outlined"
          clearable
          showTodayButton
          value={new Date(quote?.[name])}
          error={!!errors?.[name]}
          helperText={errors?.[name]?.message}
          required
        />
      )}
    />
  );
}

/**
 * @function GridRadioGroup
 * @description A reusable component for rendering a RadioGroup inside a Grid with react-hook-form Controller.
 * @param {Object} props - The component props.
 */
function GridRadioGroup({
  control,
  name,
  label,
  value,
  setValue,
  options,
  formControlLabelStyle,
}) {
  return (
    <Grid className="mt-32 border w-full" container spacing={0}>
      <Grid item xs={12}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <FormControl className="flex items-center" size="small">
              <FormLabel>{label}</FormLabel>
              <RadioGroup
                size="small"
                onClick={(e) => setValue(e.target.value)}
                {...field}
                row
                value={value}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio size="small" />}
                    label={option}
                    checked={value === option}
                    sx={{ ...formControlLabelStyle }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );
}

/**
 * @function QuoteContent
 * @description The main component that renders the quote content, including form fields and tabs for items and attachments.
 * @param {Object} props - The component props.
 * @param {Object} props.quote - The quote object.
 * @param {Object} props.control - The react-hook-form control object.
 * @param {Object} props.errors - The errors object for form validation.
 * @param {Object} props.formControlLabelStyle - The styles for form control labels.
 */
export default function QuoteContent({
  quote,
  control,
  stage,
  setStage,
  tableArgs,
  errors,
  convertedContent,
  setConvertedContent,
  formControlLabelStyle,
}) {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const loadingFetch = useSelector(selectLoadingFetch);
  const isFetched = useSelector(selectIsFetched);
  const statuses = ['Open', 'Close'];

  const currencyArray = Object.entries(currencyToSymbolMap).map(
    ([key, value]) => ({
      _id: key,
      name: value,
    })
  );

  const [showTotal, setShowTotal] = useState(quote?.showTotal ?? '');
  const [showPrice, setShowPrice] = useState(quote?.showPrice ?? '');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!isFetched) {
      dispatch(getCustomers());
    }
  }, [dispatch, isFetched]);

  if (loadingFetch || !quote) {
    return <FuseLoading />;
  }

  const handleTabChange = (event, value) => setTabValue(value);

  return (
    <div className="p-32">
      <form onSubmit={(e) => e.preventDefault()}>
        <QuoteFormFields
          control={control}
          errors={errors}
          customers={customers}
          statuses={statuses}
          stage={stage}
          setStage={setStage}
          currencies={currencyArray}
          showTotal={showTotal}
          showPrice={showPrice}
          setShowTotal={setShowTotal}
          setShowPrice={setShowPrice}
          formControlLabelStyle={formControlLabelStyle}
          quote={quote}
        />
      </form>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        classes={{ root: 'w-full h-64 border-b-1' }}
      >
        <Tab className="h-64" label="Items" />
        <Tab className="h-64" label="Payment Terms" />
      </Tabs>
      <div className="mt-16 w-full">
        {tabValue === 0 && <ItemTab quote={quote} tableArgs={tableArgs} />}
        {tabValue === 1 && (
          <PaymentTerms
            quote={quote}
            convertedContent={convertedContent}
            setConvertedContent={setConvertedContent}
          />
        )}
      </div>
    </div>
  );
}
