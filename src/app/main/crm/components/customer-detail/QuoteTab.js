import { useEffect } from 'react';
import QuotesTable from '../quotes/QuotesTable';
import { Button } from '@mui/material';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useThemeMediaQuery } from '@fuse/hooks';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'react-router-dom';

export default function QuoteTab({ quotes, setRightSidebarOpen }) {
  useEffect(() => {
    setRightSidebarOpen(false);
  }, []);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const params = useParams();
  return (
    <div>
      <div className="flex flex-1 items-center justify-end space-x-8">
        <Button
          className=""
          variant="contained"
          color="secondary"
          component={NavLinkAdapter}
          to={`/crm/customers/${params.id}/quote/new`}
          size={isMobile ? 'small' : 'medium'}
          onClick={() => {
            if (params.id) {
              setRightSidebarOpen(Boolean(params.id));
            }
          }}
        >
          <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
          <span className="mx-4 sm:mx-8">Add</span>
        </Button>
      </div>
      <QuotesTable quotes={quotes} />
    </div>
  );
}
