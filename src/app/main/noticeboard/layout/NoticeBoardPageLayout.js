import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import FuseNavigation from '@fuse/core/FuseNavigation';
import FuseSuspense from '@fuse/core/FuseSuspense';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NoticeBoardPageBreadcrumb from './NoticeBoardPageBreadcrumb';
import NoticeBoardNavigation from './NoticeBoardNavigation';

//Librairies
import { motion } from 'framer-motion';


//Material UI
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

//Fuse
import FusePageSimple from '@fuse/core/FusePageSimple/FusePageSimple';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    '& > .container': {
      maxWidth: '100%',
    },
  },
}));

function NoticeBoardPageLayout(props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const location = useLocation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  useEffect(()=>{
    document.title ="Ihub Connect - Notice Board";
  },[])
  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <Root
      header={
        <div className="flex flex-col">
          <img
            className="h-160 lg:h-100 object-cover w-full"
            src="assets/images/pages/profile/cover.jpg"
            alt="Profile Cover"
          />

          <div className="flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
            <div className="-mt-96 lg:-mt-88 rounded-full">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1 } }}>
                <Avatar
                  sx={{ borderColor: 'background.paper' }}
                  className="w-128 h-128 border-4"
                  src="assets/images/avatars/male-04.jpg"
                  alt="User avatar"
                />
              </motion.div>
            </div>

            <div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
              <Typography className="text-lg font-bold leading-none">Brian Hughes</Typography>
              <Typography color="text.secondary">London, UK</Typography>
            </div>

            <div className="hidden lg:flex h-32 mx-32 border-l-2" />

            <div className="flex items-center mt-24 lg:mt-0 space-x-24">
              <div className="flex flex-col items-center">
                <Typography className="font-bold">200k</Typography>
                <Typography className="text-sm font-medium" color="text.secondary">
                  FOLLOWERS
                </Typography>
              </div>
              <div className="flex flex-col items-center">
                <Typography className="font-bold">1.2k</Typography>
                <Typography className="text-sm font-medium" color="text.secondary">
                  FOLLOWING
                </Typography>
              </div>
            </div>

            <div className="flex flex-1 justify-end my-16 lg:my-0">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="-mx-4 min-h-40"
                classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                TabIndicatorProps={{
                  children: (
                    <Box
                      sx={{ bgcolor: 'text.disabled' }}
                      className="w-full h-full rounded-full opacity-20"
                    />
                  ),
                }}
              >
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Timeline"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="About"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Photos & Videos"
                />
              </Tabs>
            </div>
          </div>
        </div>
      }
      content={
        <div className="p-16 md:p-24 max-w-3xl min-h-full flex flex-auto flex-col">
          <NoticeBoardPageBreadcrumb />
          <div className="flex flex-col flex-1 relative py-32">
            <FuseSuspense>
              <Outlet />
            </FuseSuspense>
          </div>
        </div>
      }
      leftSidebarContent={
        <div className="px-16 py-24">
          <FuseNavigation
            className={clsx('navigation')}
            navigation={NoticeBoardNavigation.children}
          />
        </div>
      }
      // leftSidebarOpen={leftSidebarOpen}
      // leftSidebarWidth={288}
      // leftSidebarOnClose={() => {
      //   setLeftSidebarOpen(false);
      // }}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default NoticeBoardPageLayout;
