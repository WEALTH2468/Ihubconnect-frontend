import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import CameraEnhanceOutlinedIcon from '@mui/icons-material/CameraEnhanceOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { AhavaCheck } from '@fuse/utils/ahavaCheck';

function DetailUserSidebarContent({ setOpen, setAppRender, appRender }) {
    const [drop, setDrop] = useState(false);

    const handleClick = () => {
        setDrop(!drop);
    };

    if (AhavaCheck()) {
        return (
            <motion.div
                initial={{ y: 50, opacity: 0.8 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
                className="file-details p-24 sm:p-32"
            >
                <div className="flex items-center justify-end w-full">
                    <IconButton
                        className=""
                        size="large"
                        onClick={() => setOpen(false)}
                    >
                        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                    </IconButton>
                </div>
                <List>
                    <ListItemButton
                     sx={{
                        backgroundColor: appRender === 'User' ? 'rgba(235, 7, 7, 0.1)' : 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(235, 7, 7, 0.15)',
                        },
                    }}
                     onClick={handleClick}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <AddModeratorOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Authenticated  " />
                        {drop ? (
                            <ExpandLess sx={{ pr: 1 }} />
                        ) : (
                            <ExpandMore sx={{ pr: 1 }} />
                        )}
                    </ListItemButton>
                    <Collapse in={drop} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{
                                    backgroundColor: appRender === 'User' ? 'rgba(235, 7, 7, 0.1)' : 'transparent',
                                    pl: 3,
                                    '&:hover': {
                                        backgroundColor: 'rgba(235, 7, 7, 0.15)',
                                    },
                                }}
                                onClick={() => setAppRender('User')}
                            >
                                <ListItemIcon>
                                    <FuseSvgIcon>
                                        heroicons-outline:user-group
                                    </FuseSvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="Members" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton
                     sx={{
                        backgroundColor: appRender === 'Logo' ? 'rgba(235, 7, 7, 0.1)' : 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(235, 7, 7, 0.15)',
                        },
                    }}
                     onClick={() => setAppRender('Logo')}
                     >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                        <BusinessOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Ministry Info" />
                    </ListItemButton>
                    
                </List>
            </motion.div>
        );
    } else {
        return (
            <motion.div
                initial={{ y: 50, opacity: 0.8 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
                className="file-details p-24 sm:p-32"
            >
                <div className="flex items-center justify-end w-full">
                    <IconButton
                        className=""
                        size="large"
                        onClick={() => setOpen(false)}
                    >
                        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                    </IconButton>
                </div>
                <List>
                    <ListItemButton
                     sx={{
                        backgroundColor: appRender === 'User' ? 'rgba(247, 146, 5, 0.1)' : 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(247, 146, 5, 0.15)',
                        },
                    }}
                     onClick={handleClick}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <AddModeratorOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Authenticated  " />
                        {drop ? (
                            <ExpandLess sx={{ pr: 1 }} />
                        ) : (
                            <ExpandMore sx={{ pr: 1 }} />
                        )}
                    </ListItemButton>
                    <Collapse in={drop} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{
                                    backgroundColor: appRender === 'User' ? 'rgba(247, 146, 5, 0.1)' : 'transparent',
                                    pl: 3,
                                    '&:hover': {
                                        backgroundColor: 'rgba(247, 146, 5, 0.15)',
                                    },
                                }}
                                onClick={() => setAppRender('User')}
                            >
                                <ListItemIcon>
                                    <FuseSvgIcon>
                                        heroicons-outline:user-group
                                    </FuseSvgIcon>
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton
                     sx={{
                        backgroundColor: appRender === 'Logo' ? 'rgba(247, 146, 5, 0.1)' : 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(247, 146, 5, 0.15)',
                        },
                    }}
                     onClick={() => setAppRender('Logo')}
                     >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                        <BusinessOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Company Info" />
                    </ListItemButton>
                    
                </List>
            </motion.div>
        );
    }

  
}

export default DetailUserSidebarContent;
