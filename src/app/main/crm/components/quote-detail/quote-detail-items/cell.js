import { Autocomplete, Box, FormControl, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import { useRef, useState } from 'react';
import { setHasUpdatedTable } from '../../../store/quotesSlice';
import { useDispatch } from 'react-redux';

export function CheckboxCell({ row, value, column, saveHandler }) {
  const [isChecked, setIsChecked] = useState(value);
  const dispatch = useDispatch();

  const handleChange = (targetValue) => {
    row._valuesCache[column.id] = targetValue;
    setIsChecked(targetValue);
    dispatch(setHasUpdatedTable(true));
  };

  return (
    <Checkbox
      className="border"
      checked={isChecked}
      onChange={(e) => handleChange(e.target.checked)}
    />
  );
}

export function SelectCell({ items, row, column, value }) {
  const [selectedItem, setSelectedItem] = useState(
    () => items.find((item) => item._id === value) || null
  );
  const selectRef = useRef(null);
  const dispatch = useDispatch();

  const handleChange = (targetValue) => {
    if (!targetValue) {
      row._valuesCache[column.id] = '';
      return;
    }

    const { _id } = targetValue;
    row._valuesCache[column.id] = _id;
    setSelectedItem(targetValue);

    if (row.original.createdAt) {
      dispatch(setHasUpdatedTable(true));
    }
  };

  const handleButtonClick = () => {
    if (selectRef.current) {
      selectRef.current.blur();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <Autocomplete
          size="small"
          multiple={false}
          sx={{
            boxShadow: 'none',
            height: '20px',
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
          }}
          options={items}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(_props, option, { selected }) => (
            <li {..._props}>{option.name}</li>
          )}
          value={selectedItem}
          onChange={(event, newValue) => {
            handleChange(newValue);
          }}
          fullWidth
          renderInput={(params) => <TextField {...params} />}
        />
      </FormControl>
    </Box>
  );
}

export function EditCell({ value, row, column, type, maxLength }) {
  const [editValue, setEditValue] = useState(value || '');
  const dispatch = useDispatch();

  const handleChange = (targetValue) => {
    setEditValue(targetValue);
    row._valuesCache[column.id] = targetValue;

    dispatch(setHasUpdatedTable(true));
  };

  return (
    <TextField
      id="outlined-textarea"
      className="w-full text-right px-1"
      value={editValue}
      type={type}
      multiline
      inputProps={{
        style: {
          lineHeight: '1.5',
          fontSize: '16px',
        },
        maxLength,
      }}
      sx={{
        '& .MuiInputBase-root ': {
          padding: '4px 16px',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            border: 'none',
          },
          '&:hover fieldset': {
            border: '1px solid #4f46e5',
          },
          '&.Mui-focused fieldset': {
            border: '1px solid #4f46e5',
          },
        },
      }}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
