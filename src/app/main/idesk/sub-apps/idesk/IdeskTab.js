//React
import { useEffect, useState, Fragment  } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
//Fuse
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
//Libraries
import axios from 'axios';
import { motion } from 'framer-motion';

//Material ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  addCommentToStore,
  addDislikeToStore,
  addLikeToStore,
  addPostToStore,
  deleteCommentFromStore,
  deletePostFromStore,
  updatePostToStore,
} from './store/postSlice';
//Redux
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { getPosts, SelectPosts } from './store/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, selectUser } from 'app/store/userSlice';

//Components
import IdeskEvent from './components/IdeskEvent';
import PostForm from './post/postForm';
import PostCard from './post/postCard';
import UsersApp from 'src/app/main/settings/users/UsersApp';
import { Stack } from '@mui/material';
import UpdateProfileDialog, {
  MainProfileDialog,
} from 'app/shared-components/UpdateProfileDialog';
import { getNewFeatures } from 'app/shared-components/features';
import { AnnouncementDialog } from 'app/shared-components/Announcement';
import { useNavigate } from 'react-router-dom';
import { Can } from 'src/app/AbilityContext';
import ScoreCardApp from 'src/app/main/profile/sub-apps/score-card/ScoreCardTab';
import BirthdayCard from 'src/app/main/profile/sub-apps/upcoming-birthdays/birthdaysCard';
import BirthdayPopup from 'src/app/main/profile/sub-apps/upcoming-birthdays/birthday-popup';

//Mui icons
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EmailIcon from '@mui/icons-material/Email';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const IdeskTab = ({ setSelectedTab }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const posts = useSelector(SelectPosts.selectAll); // GETTING POSTING FROM REDUX
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(0);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [openBirthdayDialog, setOpenBirthdayDialog] = useState(false);
  // const [closeEnabled, setCloseEnabled] = useState(false);

  const handleOpenBirthdayDialog = () => {
    setOpenBirthdayDialog(true);
  };
  
  const handleCloseBirthdayDialog = () => {
      setOpenBirthdayDialog(false); 
  };


  useEffect(() => {
    document.title = 'Ihub Connect - Idesk'; //Set the title of the page
  }, [user]);

  useEffect(() => {
    fetchMoreData();
  }, []);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  function fetchMoreData() {
    dispatch(getPosts(count)).then(({ payload }) => {
      setHasMore(payload.length > 0);
      setCount((prev) => prev + 1);
    });
  }

  const handleClick = () => {
    setStep((prev) => prev + 1);
  };

  const newFeature = getNewFeatures(user.lastLogin);
  if (step < newFeature.length) {
    const feature = newFeature[step];
    return (
      <AnnouncementDialog
        title={feature.title}
        description={feature.description}
        buttonText={feature.action}
        handleClick={handleClick}
      />
    );
  }else{
   if(newFeature > 0){
    dispatch(getUser(user._id))
   }
  }


  if (!user.avatar) {
    return <MainProfileDialog title={'Please Kindly Complete Your Profile'} />;
  }

 
  return (
    <Box>

      <Dialog
        open={openBirthdayDialog}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: '50vw',
            maxWidth: '400px',
          },
        }}
      >
          <IconButton
            aria-label="close"
            onClick={handleCloseBirthdayDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

        <DialogContent>
          <BirthdayPopup />
        </DialogContent>
      </Dialog>


      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <div className="flex gap-[20px]">
          <div className="sticky top-0 w-[35%]">
            <Card
              component={motion.div}
              variants={item}
              className="flex flex-col w-full px-[20px] pt-24"
            >
              <div className="flex justify-between items-center pb-16">
                <Typography className="text-[20px] font-semibold leading-tight">
                  About
                </Typography>
              </div>

              <CardContent className="p-0 space-y-2">
              <Typography className="text-sm text-gray-800">
                {user.aboutMe || "Not available"}
              </Typography>

              <Typography className="text-sm text-gray-800 flex items-center gap-5 pt-[20px] font-semibold pb-[10px]">
                <BusinessCenterIcon fontSize="small" sx={{ color: 'black' }} />
                {user.jobPosition || "Not available"}
              </Typography>

              <Typography className="text-sm text-gray-800 flex items-center gap-5 font-semibold pb-[10px]">
                <EmailIcon fontSize="small" sx={{ color: 'black' }} />
                {user.email || "Not available"}
              </Typography>

              <Typography className="text-sm text-gray-800 flex items-center gap-5 font-semibold pb-[10px]">
                <FmdGoodIcon fontSize="small" sx={{ color: 'black' }} />
                {user.address || "Not available"}
              </Typography>
            </CardContent>
            </Card>

            <Card
                sx={{ marginTop: '10px', }}
              >
                  <ScoreCardApp /> {/* Passing the component inside CardContent */}
                
              </Card>

            <Card
              sx={{ marginTop: '10px' }}
              component={motion.div}
              variants={item}
              className="flex flex-col w-full px-[20px] pt-24"
            >
              <div className="flex justify-between items-center pb-16">
                <Typography className="text-[20px] font-semibold leading-tight">
                  Background
                </Typography>
                 </div>

            <CardContent className="p-0 space-y-2">
            
              <Typography className="text-sm text-gray-800 flex items-center gap-5 font-semibold">
                <BusinessCenterIcon fontSize="small" sx={{ color: 'black' }} />
                {user.jobPosition || "Not available"}
              </Typography>
            </CardContent>
             
            </Card>
          </div>

          <div className="w-[60%]">
            <PostForm />
            {posts.length > 0 && (
              <InfiniteScroll
                dataLength={posts.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>You have seen it all</b>
                  </p>
                }
              >
                {posts.map((post, index) => (
                  <Can I="read" a="Post">
                    <PostCard key={post._id} post={post} />
                  </Can>
                ))}
              </InfiniteScroll>
            )}
          </div>

          <div className="sticky top-0 w-[35%]">
                    <Card
            component={motion.div}
            variants={item}
            className="flex flex-col w-full px-32 pt-24"
          >
            <BirthdayCard onSeeMoreClick={handleOpenBirthdayDialog} />
          </Card>
          </div>
        </div>
      </motion.div>
    </Box>
  );
};

export default withReducer('IdeskApp', reducer)(IdeskTab);
