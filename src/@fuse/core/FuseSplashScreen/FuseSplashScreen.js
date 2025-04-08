import { memo } from 'react';
import Box from '@mui/material/Box';
import { selectLogo } from 'src/app/main/settings/users/store/settingsSlice';
import { useSelector } from 'react-redux';


function FuseSplashScreen() {
  //const logo = useSelector(selectLogo)
  return (
    <div id="fuse-splash-screen">
      <div className="logo">
        <img width="128" src={""} alt="logo" />
      </div>
      <Box
        id="spinner"
      >
        <div className="bounce1 w-4 h-4 rounded-full !bg-[#f17e46]" />
          <div className="bounce2 w-4 h-4 rounded-full !bg-[#f17e46]" />
          <div className="bounce3 w-4 h-4 rounded-full !bg-[#f17e46]" />
      </Box>
    </div>
  );
}

export default memo(FuseSplashScreen);
