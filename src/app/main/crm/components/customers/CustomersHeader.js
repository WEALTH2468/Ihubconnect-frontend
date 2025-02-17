import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function CustomersHeader({
  totalCustomers,
  setLeftSidebarOpen,
}) {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  return (
    <div className="flex sm:space-y-0 flex-1 w-full items-center justify-between">
      <div className="p-24 sm:p-32 w-full flex flex-col sm:flex-row space-y-8 sm:space-y-0 items-center justify-between">
        <div className="flex gap-5 items-center">
          <IconButton onClick={() => setLeftSidebarOpen((prev) => !prev)}>
            <MenuIcon />
          </IconButton>
          <div className="flex flex-col items-start space-y-8">
            <Typography
              component={Link}
              to="/crm/customers"
              className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
              role="button"
            >
              Customers
            </Typography>
            <Typography className="text-16 md:text-[24] tracking-tight leading-none">
              {totalCustomers && `${totalCustomers} Total Customers`}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end space-x-8">
        <Button
          className=""
          variant="contained"
          color="secondary"
          component={NavLinkAdapter}
          to="/crm/customers/new/edit"
          size="small"
        >
          <FuseSvgIcon size={24}>heroicons-outline:plus</FuseSvgIcon>
          <span className="mx-4 sm:mx-8">Add</span>
        </Button>
      </div>
    </div>
  );
}
