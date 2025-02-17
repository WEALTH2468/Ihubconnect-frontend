import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { getUser } from "src/app/main/settings/users/store/userSlice";
import ProfileView from "./contact/ContactView";
import ProfileForm from "./contact/ContactForm";
import { useLocation } from "react-router-dom";

//REDUX
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import reducer from "./store";
import { selectUser } from "app/store/userSlice";
import { Box } from "@mui/system";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Stack, Tooltip } from "@mui/material";
import UsersApp from "src/app/main/settings/users/UsersApp";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProfileTab() {

  const [edit, setEdit] = useState(false);
  const [unitId, setUnitId] = useState(null);
  const [moreMenuEl, setMoreMenuEl] = useState(null);
  const [slice, setSlice] = useState(-8);
  const [showAllMembers, setShowAllMembers] = useState(false);

  const [teamMateId, setTeamMateId] = useState(null);
  const teamInfo = useSelector((state) => state.usersApp.user.user)
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch();
  const [user, setUser] = useState(null)
  const [memberData, setMemberData] = useState(user)
  const data = useSelector((state) => state.usersApp.user.user)
  const [userId, setUserId] = useState(id);
  const me = useSelector(selectUser)


  useEffect(() => {
    showAllMembers ? setSlice(0) : setSlice(-8);
  }, [showAllMembers]);


  useEffect(() => {
    setUserId(id)
    let route = true;
    dispatch(getUser({ id, route }))
    setUser(data)
  }, [userId])

  useEffect(() => {
    setUser(data)
  }, [data])

  useEffect(() => {

  }, [id])

  const showEdit = me._id === id;

  const handleViewTeamMemberProfile = (id) => {
    navigate(`/profile/${id}`)
    const route = true;
    dispatch(getUser({ id, route }))
  }

  function handleUnitFilter(unitId) {
    return user?.unitsMembers
      .filter((member) => (unitId ? member.units.includes(unitId) : true))
      .map((friend) => (
        <Tooltip title={friend.displayName}>
          <Avatar
            key={friend._id}
            className="w-64 h-64 rounded-12 m-4"
            src={friend.avatar}
            alt={friend.displayName}
            onClick={() => handleViewTeamMemberProfile(friend._id)}
          />
        </Tooltip>
      ));
  }


  const teamData = handleUnitFilter(unitId);

  function handleMoreMenuClick(event) {
    setMoreMenuEl(event.target);
  }
  function handleMoreMenuClose() {
    setMoreMenuEl(null);
  }

  // useEffect(() => {
  //   axios.get("/api/profile/about").then((res) => {
  //     setData(res.data);
  //   });
  // }, []);

  // if (!data) {
  //   return null;
  // }

  // const { general, work, contact, groups, friends } = data;

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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <div className="md:flex">
        {edit ? (
          <ProfileForm setEdit={setEdit} memberData={user} />
        ) : (
          <ProfileView setEdit={setEdit} memberData={user} id={id} />
        )}

        <div className="flex flex-col md:w-320">
          <Card
            component={motion.div}
            variants={item}
            className={`w-full  mb-32`}
          >
            <CardContent>
              <div className="flex items-center">
                <Typography className="flex flex-1 text-2xl font-semibold leading-tight">
                  {unitId ? ` ${unitId} Unit ` : " My Team "}
                  <Typography>{` (${teamData?.length}) `}</Typography>
                </Typography>

                <IconButton
                  aria-controls="main-more-menu"
                  aria-haspopup="true"
                  onClick={handleMoreMenuClick}
                  size="large"
                >
                  <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
                </IconButton>
                <Menu
                  id="main-more-menu"
                  anchorEl={moreMenuEl}
                  open={Boolean(moreMenuEl)}
                  onClose={handleMoreMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleMoreMenuClose();
                      setUnitId(null);
                    }}
                  >
                    All
                  </MenuItem>

                  {memberData?.units &&
                    memberData.units.map((id) => (
                      <MenuItem
                        onClick={() => {
                          handleMoreMenuClose();
                          setUnitId(id);
                        }}
                      >
                        {id} Unit
                      </MenuItem>
                    ))}
                </Menu>
              </div>
              <Stack
                sx={{
                  display: "flex",
                  flexFlow: "row wrap",
                  paddingBlock: "24px",
                  overflow: "hidden",
                }}
              >
                {teamData?.slice(slice).reverse().map((person) => person)}
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {teamData?.length > -slice && (
                  <Button
                    className="-mx 8"
                    size="small"
                    onClick={() => setShowAllMembers(!showAllMembers)}
                  >
                    {showAllMembers
                      ? "See Less"
                      : `See ${teamData?.length + slice} more`}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          <Card
            component={motion.div}
            variants={item}
            className="w-full mb-32 rounded-16 shadow"
          >
            <div className="px-32 pt-24 flex items-center">
              <Typography className="flex flex-1 text-2xl font-semibold leading-tight">
                Time Line
              </Typography>
              <div className="-mx-8">
                <Button color="inherit" size="small">
                  See more
                </Button>
              </div>
            </div>
            <CardContent className="px-32">
              <List className="p-0"></List>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default withReducer("ProfileApp", reducer)(ProfileTab, UsersApp);
