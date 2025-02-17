import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import FuseNavigation from "@fuse/core/FuseNavigation";
import FuseSuspense from "@fuse/core/FuseSuspense";
import {
  Link,
  Outlet,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import IdeskPageBreadcrumb from "./IdeskPageBreadcrumb";
import IdeskNavigation from "./IdeskNavigation";

//React
import { useEffect, useState } from "react";
import history from "@history";

//Fuse
import FusePageSimple from "@fuse/core/FusePageSimple";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { useDeepCompareEffect } from '@fuse/hooks';


//Material ui
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

//Components
// import AboutTab from './tabs/AboutTab';
// import PhotosVideosTab from './tabs/PhotosVideosTab';
// import TimelineTab from './tabs/TimelineTab';

//libraries
import { motion } from "framer-motion";

//Sub Apps
import IdeskTab from "../sub-apps/idesk/IdeskTab";
import ProfileTab from "../sub-apps/profile/ProfileTab";
import ScoreCardTab from "../sub-apps/score-card/ScoreCardTab";

//REDUX
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../sub-apps/idesk/store/postSlice";
import { selectUser } from "app/store/userSlice";
import {
  getCountries,
  selectCountries,
} from "../sub-apps/profile/store/countriesSlice";
import { getTags } from "../sub-apps/profile/store/tagsSlice";
import { getContacts } from "../sub-apps/profile/store/contactsSlice";
import addBackendProtocol from "app/theme-layouts/shared-components/addBackendProtocol";
import axios from "axios";



const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    "& > .container": {
      maxWidth: "100%",
    },
  },
}));

function IdeskPageLayout(props) {
  const [taskCount, setTaskCount] = useState(0);
  const userData = useSelector(state => selectUser(state));

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get(`/iperformance/tasks/count/user/${userData._id}`);
      const data = await response.data;
      setTaskCount(data.totalRowCount)
    }

    fetchTasks();
  }, [])

  const dispatch = useDispatch();

  // dispatch(getCountries());
  const countries = useSelector(selectCountries);
  const user = useSelector(selectUser);

  const { firstName, jobPosition } = user;

  const [selectedTab, setSelectedTab] = useState(0);
  const [country, setCountry] = useState(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const location = useLocation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }


  useDeepCompareEffect(() => {
    dispatch(getContacts());
    dispatch(getCountries());
    dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    document.title = "Ihub Connect - Idesk";
  }, []);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [location, isMobile]);

  useEffect(() => {
    const res =
      user.phoneNumbers &&
      countries && countries.find((country) => country.iso === user.phoneNumbers[0].country);
    res && setCountry(res.name);
  }, [user, countries]);

  function getCountryByIso(iso) {
    return countries.find((country) => country.iso === iso);
  }

  return (
    <Root
      header={
        <div className="flex flex-col">
          <img
            className="h-160 lg:h-100 object-cover w-full"
            src={addBackendProtocol(user.background)} //"assets/images/pages/profile/cover.jpg"
            alt="Profile Cover"
          />

          <div className="flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
            <div className="-mt-96 lg:-mt-88 rounded-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.1 } }}
              >
                <Avatar
                  sx={{ borderColor: "background.paper" }}
                  className="w-128 h-128 border-4"
                  src={addBackendProtocol(user.avatar)} //"assets/images/avatars/male-04.jpg"
                  alt="User avatar"
                />
              </motion.div>
            </div>

            {user.firstName && (<div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
              <Typography className="text-lg font-bold leading-none">{`${user.firstName} (${user.jobPosition})`}</Typography>
              <Typography color="text.secondary">{`${country}, ${user.city}`}</Typography>
            </div>)}

            <div className="hidden lg:flex h-32 mx-32 border-l-2" >

            <div className="flex items-center mt-24 lg:mt-0 space-x-24">
              <div className="flex flex-col items-center">
                <Typography className="font-bold">-</Typography>
                <Typography
                  className="text-sm font-medium"
                  color="text.secondary"
                >
                  SCORE
                </Typography>
              </div>
              <div className="flex flex-col items-center">
                <Typography className="font-bold">{taskCount}</Typography>
                <Typography
                  className="text-sm font-medium"
                  color="text.secondary"
                >
                  TASK(S)
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
                classes={{
                  indicator: "flex justify-center bg-transparent w-full h-full",
                }}
                TabIndicatorProps={{
                  children: (
                    <Box
                      sx={{ bgcolor: "text.disabled" }}
                      className="w-full h-full rounded-full opacity-20"
                    />
                  ),
                }}
              >
                <Tab
                  className="min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FuseSvgIcon
                        sx={{ marginRight: 1, fontSize: 20 }}
                      >
                        heroicons-outline:home
                      </FuseSvgIcon>
                      <span className="text-14 font-semibold">Idesk</span>
                    </Box>
                  }
                />
                <Tab
                  className="min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FuseSvgIcon
                        sx={{ marginRight: 1, fontSize: 20 }}
                      >
                        heroicons-outline:user-circle
                      </FuseSvgIcon>
                      <span className="text-14 font-semibold">Profile</span>
                    </Box>
                  }
                />
                <Tab
                  className="min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FuseSvgIcon
                        sx={{ marginRight: 1, fontSize: 20 }}
                      >
                        heroicons-outline:book-open
                      </FuseSvgIcon>
                      <span className="text-14 font-semibold">Score</span>
                    </Box>
                  }
                />
              </Tabs>
            </div>
          </div>
        </div>
        </div>
    }
      
      content={
        <Box
          sx={{
            padding: "10px 0 ",
          }}
          className="flex flex-auto justify-center w-full  mx-auto  "
        >
          {selectedTab === 0 && <IdeskTab setSelectedTab={setSelectedTab} />}
          {selectedTab === 1 && <ProfileTab setSelectedTab={setSelectedTab} />}
          {selectedTab === 2 && (
            <ScoreCardTab setSelectedTab={setSelectedTab} />
          )}
        </Box>
      }
      // leftSidebarContent={
      //   <div className="px-16 py-24">
      //     <FuseNavigation
      //       className={clsx('navigation')}
      //       navigation={IdeskNavigation.children}
      //     />
      //   </div>
      // }
      // leftSidebarOpen={leftSidebarOpen}
      // leftSidebarWidth={288}
      // leftSidebarOnClose={() => {
      //   setLeftSidebarOpen(false);
      // }}
      scroll={isMobile ? "normal" : "page"}
    />
  )
}

export default IdeskPageLayout;
