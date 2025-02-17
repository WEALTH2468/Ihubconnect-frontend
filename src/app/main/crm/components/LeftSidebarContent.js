import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';

export default function LeftSidebarContent({ setOpen }) {
  const navigate = useNavigate();
  const handleClick = (value) => {
    setOpen(false);
    navigate(`/crm/${value}`);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0.8 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
      className="file-details p-24 sm:p-32"
    >
      <div className="flex items-center justify-end w-full">
        <IconButton className="" size="large" onClick={() => setOpen(false)}>
          <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
        </IconButton>
      </div>
      <List>
        <ListItemButton onClick={() => handleClick('customers')}>
          {/* <ListItemIcon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24px"
                            height="24px" 
                            viewBox="0 0 48 48"
                        >
                            <defs>
                                <mask id="ipTChecklist0">
                                    <g
                                        fill="none"
                                        stroke="#fff"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="4"
                                    >
                                        <path d="m34 10l8 8m0-8l-8 8m10 12l-7 8l-4-4" />
                                        <path
                                            fill="#555"
                                            d="M26 10H4v8h22zm0 20H4v8h22z"
                                        />
                                    </g>
                                </mask>
                            </defs>
                            <path
                                fill="currentColor"
                                d="M0 0h48v48H0z"
                                mask="url(#ipTChecklist0)"
                            />
                        </svg>
                    </ListItemIcon> */}
          <ListItemText primary="Customers" />
        </ListItemButton>
        <ListItemButton onClick={() => handleClick('quotes')}>
          <ListItemText primary="Quotes" />
        </ListItemButton>
        <ListItemButton onClick={() => handleClick('categories')}>
          <ListItemText primary="Category" />
        </ListItemButton>
        <ListItemButton onClick={() => handleClick('items')}>
          <ListItemText primary="Items" />
        </ListItemButton>
      </List>
    </motion.div>
  );
}
