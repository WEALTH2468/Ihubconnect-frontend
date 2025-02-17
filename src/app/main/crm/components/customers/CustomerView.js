import { Avatar, Box, Button, Chip, Divider, Typography } from '@mui/material';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'react-router-dom';

export default function CustomerView() {
  const routeParams = useParams();
  return (
    <>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default',
        }}
      />
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl">
          <div className="flex flex-auto items-end -mt-64">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary',
              }}
              className="w-128 h-128 text-64 font-bold"
              src="https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tfGVufDB8fDB8fHww"
              alt="Samuel.jpg"
            >
              Samuel
            </Avatar>
            <div className="flex items-center ml-auto mb-4">
              <Button
                variant="contained"
                color="secondary"
                component={NavLinkAdapter}
                to={`/crm/customers/${routeParams.id}/edit`}
              >
                <FuseSvgIcon size={20}>
                  heroicons-outline:pencil-alt
                </FuseSvgIcon>
                <span className="mx-8">Edit</span>
              </Button>
            </div>
          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">
            Samuel Oseh
          </Typography>
          <div className="flex flex-wrap items-center mt-8">
            <Chip
              key="1"
              label="Individual"
              className="mr-12 mb-12"
              size="small"
            />
          </div>
          <Divider className="mt-16 mb-24" />
          <div className="flex flex-col space-y-32">
            <div className="flex items-center">
              <FuseSvgIcon>heroicons-outline:tag</FuseSvgIcon>
              <div className="ml-24 leading-6">Ihub</div>
            </div>
            <div className="flex">
              <FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
              <div className="min-w-0 ml-24 space-y-4">
                <div
                  className="flex items-center leading-6"
                  key="samueloseh@gmail.com"
                >
                  <a
                    className="hover:underline text-primary-500"
                    href={`mailto: ${'samueloseh@gmail.com'}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    samueloseh@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className="flex">
              <FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
              <div className="min-w-0 ml-24 space-y-4">
                <div className="flex items-center leading-6" key={0}>
                  <div className="font-mono">+234-810-286-7345</div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
              <div className="ml-24 leading-6">
                387 Holt Court, Thomasville, Alaska, PO2867
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
