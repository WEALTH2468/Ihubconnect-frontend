import { memo } from 'react';
import Box from '@mui/material/Box';
import { selectLogo } from 'src/app/main/settings/users/store/settingsSlice';
import { useSelector } from 'react-redux';


function FuseSplashScreen() {
  const logo = useSelector(selectLogo)
  return (
    <div id="fuse-splash-screen">
      <div className="logo">
        <img width="128" src={logo} alt="logo" />
      </div>
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

export default memo(FuseSplashScreen);
