import { useTimeout } from '@fuse/hooks';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Box, useTheme } from '@mui/material';
import { getLogo } from 'src/app/main/settings/users/store/settingsSlice';
import { useDispatch } from 'react-redux';
function FuseLoading(props) {
  const [showLoading, setShowLoading] = useState(!props.delay);
  const dispatch = useDispatch()

  const theme = useTheme(); // Access the MUI theme
  

  useEffect(() => {
    dispatch(getLogo())
  },[])

  useTimeout(() => {
    setShowLoading(true);
  }, props.delay);

  return (
      <div
        className={clsx(
          'flex flex-1 flex-col items-center justify-center p-24',
          !showLoading && 'hidden'
        )}
      >
        <Typography className="text-13 sm:text-20 font-medium -mb-16" color="text.secondary">
          Loading
        </Typography>
    
        <Box id="spinner" className="flex gap-2 mt-4">
                <div
                  className="bounce1 w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.palette.secondary.main }}
                />
                <div
                  className="bounce2 w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.palette.secondary.main }}
                />
                <div
                  className="bounce3 w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.palette.secondary.main }}
                />
              </Box>
      </div>
    
  );
}

FuseLoading.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

FuseLoading.defaultProps = {
  delay: false,
};

export default FuseLoading;
