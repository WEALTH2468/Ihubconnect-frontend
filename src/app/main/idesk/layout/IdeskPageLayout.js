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
import PostAddIcon from '@mui/icons-material/PostAdd';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


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
import { AhavaCheck } from "@fuse/utils/ahavaCheck";



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

  function useDailyRandomImages() {

    let images = [];

    if (AhavaCheck()) {
      images = [
        "assets/images/idesk-images/pexels-israwmx-28688224.jpg",
        "assets/images/idesk-images/pexels-israwmx-28486792.jpg",
        "assets/images/idesk-images/pexels-soulwinnersforchrist-10823756.jpg",
        "assets/images/idesk-images/pexels-soulwinnersforchrist-10831945.jpg",
        "assets/images/idesk-images/pexels-soulwinnersforchrist-16726690.jpg",
        "assets/images/idesk-images/pexels-chris-liu-753004655-22710978.jpg",
        "assets/images/idesk-images/pexels-tara-winstead-8383493.jpg",
        "assets/images/idesk-images/pexels-tara-winstead-8383656.jpg",
      ]

      useEffect(() => {
        document.title = "Ahava Tribe - Idesk";
      }, []);
      
    } else {
      images = [
        "assets/images/idesk-images/pexels-cookiecutter-1148820.jpg",
        "assets/images/idesk-images/pexels-divinetechygirl-1181354.jpg",
        "assets/images/idesk-images/pexels-divinetechygirl-1181675.jpg",
        "assets/images/idesk-images/pexels-joshsorenson-1714208.jpg",
        "assets/images/idesk-images/pexels-luis-gomes-166706-546819.jpg",
        "assets/images/idesk-images/pexels-pixabay-257699.jpg",
        "assets/images/idesk-images/pexels-pixabay-356056.jpg",
        "assets/images/idesk-images/pexels-shottrotter-1309766.jpg",
      ];

      useEffect(() => {
        document.title = "Ihub Connect - Idesk";
      }, []);
    }
   

   
  
    const [randomImages, setRandomImages] = useState([]);
  
    useEffect(() => {
      // Use today's date as seed (in milliseconds)
      const today = new Date().toDateString();
      const seed = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
      // Shuffle images and pick the first one
      const shuffled = shuffle([...images], seed);
      setRandomImages(shuffled.slice(0, 1));
    }, []);
  
    // Shuffle array based on seed
    const shuffle = (array, seed) => {
      let currentIndex = array.length;
      let randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor((random(seed++) * currentIndex));
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    };
  
    // Pseudo-random number generator based on seed
    const random = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
  
    return randomImages;
  }
  
  const randomImage = useDailyRandomImages();


  useDeepCompareEffect(() => {
    dispatch(getContacts());
    dispatch(getCountries());
    dispatch(getTags());
  }, [dispatch]);


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

  const stats = [
    {
      icon: <MilitaryTechIcon fontSize="medium" sx={{ color: '#fff' }} />,
      count: 1000,
      label: 'Iscore',
    },
    {
      icon: <RocketLaunchIcon fontSize="medium" sx={{ color: '#fff' }} />,
      count: 1000,
      label: 'Performance',
    },
    {
      icon: <PostAddIcon fontSize="medium" sx={{ color: '#fff' }} />,
      count: 1000,
      label: 'Post',
    },
  
  
  ];

  return (
    <Root
      header={
        <div className="flex flex-col relative h-[250px] lg:h-[350px] bg-black/80 w-full">
        {/* Background image */}
        <img
          src={randomImage[0]}
          alt="IHOBCONNECT ADS"
          className="absolute inset-0 w-full h-full  bg-black/80 object-cover z-0"
        />
      
        {/* Optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60 z-10" />
      
        {/* Bottom-aligned content */}
        <div className="flex flex-col flex-0 lg:flex-row items-center justify-center w-full mx-auto pt-[50px]
         px-32 lg:h-[120px] absolute bottom-0  right-0 z-20 text-white">
          {/* Avatar */}
          <div className="-mt-[50px] lg:-mt-[70px] rounded-full">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { delay: 0.1 } }}
            >
              <Avatar
                sx={{ borderColor: "white" }}
                className="w-128 h-128 border-4"
                src={addBackendProtocol(user.avatar)}
                alt="User avatar"
              />
            </motion.div>
          </div>
      
          {/* User info */}
          {user.firstName && (
            <div className="hidden lg:flex flex-col items-start lg:items-start -mt-[30px] lg:-mt-[30px] lg:ml-[20px]">
              <Typography className="text-[30px] font-bold leading-none text-white">
                {`${user.firstName}`}
              </Typography>
              <Typography className="text-lg font-bold leading-none text-white pt-[3px]">
                {`${user.jobPosition? user.jobPosition.title: "No Job Position"}`}
              </Typography>
              <Typography className="text-white pt-[3px]">{`${country}, ${user.city}`}</Typography>
            </div>
          )}
      
          {/* Tabs */}
          <div className="flex justify-start my-16 lg:my-0 ml-[40px]">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons={false}
              className="-mx-4 min-h-40 text-white font-bold"
              classes={{
                indicator: "flex justify-center bg-transparent w-full h-full",
              }}
              TabIndicatorProps={{
                children: (
                  <Box
                    sx={{ bgcolor: "text.disabled" }}
                    className="w-full h-full rounded-[10%] opacity-30"
                  />
                ),
              }}
            >
              {[
                { label: "Idesk", icon: "heroicons-outline:home" },
                { label: "Profile", icon: "heroicons-outline:user-circle" },
                { label: "Score", icon: "heroicons-outline:book-open" },
              ].map((tab, index) => {
                const isActive = selectedTab === index;

                return (
                  <Tab
                    key={index}
                    className={`
                      min-h-40 min-w-64 mx-4 px-12
                      ${isActive ? "text-[var(--color-secondary.main)]" : "text-white"}
                      hover:text-[var(--color-secondary.main)] transition-colors duration-200
                    `}
                    disableRipple
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FuseSvgIcon sx={{ marginRight: 1, fontSize: 20 }}>
                          {tab.icon}
                        </FuseSvgIcon>
                        <span className="text-14 font-semibold">{tab.label}</span>
                      </Box>
                    }
                  />
                );
              })}

            </Tabs>
          </div>

          {/* User performance */}
          <div className="hidden lg:flex justify-center gap-x-[20px] -mt-[50px] lg:-mt-[45px] ml-[60px]">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                >
                  {stat.icon}
                  <Typography className="text-[18px] font-bold leading-none text-white pt-[7px]">
                    {stat.count}
                  </Typography>
                  <Typography className="text-white pt-[7px]">{stat.label}</Typography>
                </div>
              ))}
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
      scroll={isMobile ? "normal" : "page"}
    />
  )
}

export default IdeskPageLayout;
