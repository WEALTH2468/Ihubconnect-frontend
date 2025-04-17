import { memo } from 'react';
import {Box, useTheme} from '@mui/material';
import { selectCompanyProfile } from 'src/app/main/settings/users/store/settingsSlice'; 
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';

import { selectLogo } from 'src/app/main/settings/users/store/settingsSlice';
import { useSelector } from 'react-redux';


function FuseSplashScreen() {
  const theme = useTheme(); // Access the MUI theme

  const company = useSelector(selectCompanyProfile);

  return (
    <div id="fuse-splash-screen">
      <div className="logo">
        <img width="128" src={ addBackendProtocol(company?.logo) } alt="logo" />
      </div>
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

export default memo(FuseSplashScreen);
