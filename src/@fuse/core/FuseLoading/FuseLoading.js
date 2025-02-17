import { useTimeout } from '@fuse/hooks';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { getLogo } from 'src/app/main/settings/users/store/settingsSlice';
import { useDispatch } from 'react-redux';
function FuseLoading(props) {
  const [showLoading, setShowLoading] = useState(!props.delay);
  const dispatch = useDispatch()

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
      <Box
        id="spinner"
        sx={{
          '& > div': {
            backgroundColor: 'palette.secondary.main',
          },
        }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
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
