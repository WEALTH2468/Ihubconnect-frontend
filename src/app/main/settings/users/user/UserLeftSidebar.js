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

function DetailUserSidebarContent({ setOpen, setAppRender }) {
    const [drop, setDrop] = useState(false);

    const handleClick = () => {
        setDrop(!drop);
    };

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
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <AddModeratorOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Authenticated  " />
                    {drop ? (
                        <ExpandLess sx={{ pr: 2 }} />
                    ) : (
                        <ExpandMore sx={{ pr: 2 }} />
                    )}
                </ListItemButton>
                <Collapse in={drop} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4 }}
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
                <ListItemButton onClick={() => setAppRender('Logo')}>
                    <ListItemIcon>
                        <CameraEnhanceOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Team Logo" />
                </ListItemButton>
                
            </List>
        </motion.div>
    );
}

export default DetailUserSidebarContent;
