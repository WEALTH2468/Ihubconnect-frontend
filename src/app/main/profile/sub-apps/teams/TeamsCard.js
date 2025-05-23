import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';


//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { Box } from '@mui/system';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Stack, Tooltip } from '@mui/material';
import { getUser } from 'src/app/main/settings/users/store/userSlice';
import { selectUnits } from 'app/store/settingsSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';

function TeamsCard() {
    const user = useSelector(selectUser);
    
    const units = useSelector(selectUnits);
    const userUnitIds = user?.units || [];
    
    const userUnits = units.filter((unit) =>
      userUnitIds.includes(unit._id)
    );
    

    const dispatch = useDispatch();
    const [unitId, setUnitId] = useState(null);
    const [moreMenuEl, setMoreMenuEl] = useState(null);
    const [slice, setSlice] = useState(-8);
    const [showAllMembers, setShowAllMembers] = useState(false);

    useEffect(() => {
        showAllMembers ? setSlice(0) : setSlice(-8);
    }, [showAllMembers]);
    const handleViewTeamMemberProfile = (id) => {
        dispatch(getUser({ id, route }));
    };
    function handleUnitFilter(unitId) {
        return user.unitsMembers
            .filter((member) => (unitId ? member.units.includes(unitId) : true))
            .map((friend) => (
                <Tooltip key={friend._id} title={friend.firstName}>
                    <Avatar
                        className="w-64 h-64 rounded-12 m-4"
                        src={addBackendProtocol(friend.avatar)}
                        alt={friend.firstName}
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

                <div className="flex flex-col md:w-320">
                    <Card
                                            component={motion.div}
                                            variants={item}
                                            className={`w-full  mb-32`}
                                        >
                                            <CardContent>
                                                <div className="flex items-center">
                                                    <Typography className="flex flex-1 text-2xl font-semibold leading-tight">
                                                        {unitId
                                                            ? ` ${
                                                                  userUnits.find(
                                                                      (unit) => unit._id == unitId
                                                                  ).name
                                                              }`
                                                            : ' My Team '}
                                                        <Typography>{` (${teamData.length}) `}</Typography>
                                                    </Typography>
                    
                                                    <IconButton
                                                        aria-controls="main-more-menu"
                                                        aria-haspopup="true"
                                                        onClick={handleMoreMenuClick}
                                                        size="large"
                                                    >
                                                        <FuseSvgIcon>
                                                            heroicons-outline:dots-vertical
                                                        </FuseSvgIcon>
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
                    
                                                        {userUnits &&
                                                            userUnits.map((unit, key) => (
                                                                <MenuItem
                                                                    key={key}
                                                                    onClick={() => {
                                                                        handleMoreMenuClose();
                                                                        setUnitId(unit._id);
                                                                    }}
                                                                >
                                                                    {unit.name}
                                                                </MenuItem>
                                                            ))}
                                                    </Menu>
                                                </div>
                                                <Stack
                                                    sx={{
                                                        display: 'flex',
                                                        flexFlow: 'row wrap',
                                                        paddingBlock: '24px',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {teamData
                                                        .slice(slice)
                                                        .reverse()
                                                        .map((person) => person)}
                                                </Stack>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {teamData.length > -slice && (
                                                        <Button
                                                            className="-mx 8"
                                                            size="small"
                                                            onClick={() =>
                                                                setShowAllMembers(!showAllMembers)
                                                            }
                                                        >
                                                            {showAllMembers
                                                                ? 'See Less'
                                                                : `See ${
                                                                      teamData.length + slice
                                                                  } more`}
                                                        </Button>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                </div>
            </div>
        </motion.div>
    );
}

export default TeamsCard;
