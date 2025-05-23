import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import IconButton from '@mui/material/IconButton';
import { Outlet } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function QuotesSidebarContent(props) {
  return (
    <div className="flex flex-col flex-auto">
      <IconButton
        className="absolute top-0 right-0 my-16 mx-32 z-10"
        sx={{ color: 'white' }}
        component={NavLinkAdapter}
        to="/crm/quotes"
        size="large"
      >
        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
      </IconButton>

      <Outlet />
    </div>
  );
}

export default QuotesSidebarContent;
