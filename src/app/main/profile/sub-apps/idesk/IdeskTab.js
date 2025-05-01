//React
import { useEffect, useState } from "react";

//Fuse
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
//Libraries
import axios from "axios";
import { motion } from "framer-motion";

//Material ui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { AhavaCheck } from '@fuse/utils/ahavaCheck';

//Redux
import withReducer from "app/store/withReducer";
import reducer from "./store";
import { getPosts, SelectPosts } from "./store/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";


//Components
import IdeskEvent from "./components/IdeskEvent";
import PostForm from "./post/postForm";
import PostCard from "./post/postCard";

const IdeskTab = ({setSelectedTab}) => {

  const user = useSelector(selectUser);
  const dispatch = useDispatch()

  useEffect(() => {
    if (AhavaCheck()) {
      document.title = "Ahava Tribe - Idesk 222"; //Set the title of the page
    } else {
      document.title = "Ihub Connect - Idesk"; //Set the title of the page
    }
    !user.avatar && setSelectedTab(1) // CHECKING IF PROFILE IS UPDATED
  }, [user]);

  const posts = useSelector(SelectPosts.selectAll); // GETTING POSTING FROM REDUX

  

  useEffect(() => {
    dispatch(getPosts());
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

  return (
    <Box sx={{ width: "100%" }}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <Box display="flex" sx={{ width: "100%" }}>
          <Box sx={{  }}>
            <Card
              component={motion.div}
              variants={item}
              className="flex flex-col w-full px-32 pt-24"
            >
              <div className="flex justify-between items-center pb-16">
                <Typography className="text-2xl font-semibold leading-tight">
                  About
                </Typography>
                <Button
                  color="inherit"
                  size="small"
                  className="font-medium -mx-8"
                ></Button>
              </div>

              <CardContent className="p-0">
              <Typography>{user.firstName} {user.lastName}</Typography> 
              <Typography>{user.email}</Typography>
              <Typography>{user.address}</Typography>

              </CardContent>
            </Card>

            <Card
              sx={{ marginTop: "10px" }}
              component={motion.div}
              variants={item}
              className="flex flex-col w-full px-32 pt-24"
            >
              <div className="flex justify-between items-center pb-16">
                <Typography className="text-2xl font-semibold leading-tight">
                  KPI
                </Typography>
                <Button
                  color="inherit"
                  size="small"
                  className="font-medium -mx-8"
                ></Button>
              </div>

              <CardContent className="p-0"></CardContent>
            </Card>
            <Card
              sx={{ marginTop: "10px" }}
              component={motion.div}
              variants={item}
              className="flex flex-col w-full px-32 pt-24"
            >
              <div className="flex justify-between items-center pb-16">
                <Typography className="text-2xl font-semibold leading-tight">
                  Background
                </Typography>
                <Button
                  color="inherit"
                  size="small"
                  className="font-medium -mx-8"
                ></Button>
              </div>

              <CardContent className="p-0">
              <Typography>{user.jobPosition}</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ }}>
            {/* <IdeskEvent /> */}
            <PostForm />
            {posts.length > 0 &&
              posts
                .map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
                .reverse()}
          </Box>

          <Box sx={{}}>
            <Card
              component={motion.div}
              variants={item}
              className="flex flex-col w-full px-32 pt-24"
            >
              <div className="flex justify-between items-center pb-16">
                <Typography className="text-2xl font-semibold leading-tight">
                  Notifications
                </Typography>
                <Button
                  color="inherit"
                  size="small"
                  className="font-medium -mx-8"
                >
                  See All
                </Button>
              </div>

              {/* <CardContent className="p-0">
                <List className="p-0">
                  <ListItem key={user.id} className="px-0 space-x-12">
                    <Avatar className="" alt={user.firstName} src={user.avatar} />
                    <ListItemText
                      className="flex-1"
                      primary={
                        <div className="flex">
                          <Typography
                            className="font-normal whitespace-nowrap"
                            color="secondary"
                            paragraph={false}
                          >
                            {user.firstName}
                          </Typography>

                          <Typography className="px-4 truncate" paragraph={false}>
                           Hello Bro 
                          </Typography>
                        </div>
                      }
                      secondary={user.time}
                    />
                  </ListItem>
                </List>
              </CardContent> */}
            </Card>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default withReducer("IdeskApp", reducer)(IdeskTab);
