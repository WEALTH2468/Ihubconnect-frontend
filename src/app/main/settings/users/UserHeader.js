import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box } from '@mui/system';
import { IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function UsersHeader({ setOpen }) {
  return (
    <div className="p-24 sm:p-32 w-full border-b-1">
      <div className="flex gap-5 items-start">
        <IconButton onClick={() => setOpen((prev) => !prev)}>
          <MenuIcon />
        </IconButton>
        <div className="flex flex-col items-center sm:items-start">
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="text-24 md:text-32 font-extrabold tracking-tight leading-none"
          >
            Settings
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default UsersHeader;
