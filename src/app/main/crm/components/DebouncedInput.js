import { TextField } from '@mui/material';

const { useState, useEffect } = require('react');

export default function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 4000,
    ...props
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <TextField
            {...props}
            placeholder="Search"
            size="small"
            InputProps={{
                endAdornment: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#696969"
                        className="w-20 h-20"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                ),
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
