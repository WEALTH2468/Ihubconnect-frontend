import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import format from 'date-fns/format';
import _ from '@lodash';
import { getUser, selectUser } from '../store/userSlice';
import { selectCountries } from '../store/countriesSlice';
import { selectTags } from '../store/tagsSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
const UserView = () => {
  const user = useSelector((state) => state.usersApp.user.user);
  const countries = useSelector(selectCountries);
  const tags = useSelector(selectTags);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const { id } = routeParams;
  useEffect(() => {
    dispatch(getUser({ id }));
  }, [dispatch, routeParams]);

  function getCountryByIso(iso) {
    return countries.find((country) => country.iso === iso);
  }

  if (!user) {
    return <FuseLoading />;
  }

  return (
    <>
      {user && (
        <Box
          className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
          sx={{
            backgroundColor: 'background.default',
          }}
        >
          {user && (
            <img
              className="absolute inset-0 object-cover w-full h-full"
              src={addBackendProtocol(user.background)}
              alt="user background"
            />
          )}
        </Box>
      )}
      {user && (
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
                src={addBackendProtocol(user?.avatar)}
                alt={user?.displayName}
              >
                {user?.displayName}
              </Avatar>
              <div className="flex items-center ml-auto mb-4">
                <Button
                  variant="contained"
                  color="secondary"
                  component={NavLinkAdapter}
                  to={`/settings/users/${user._id}/edit`}
                >
                  <FuseSvgIcon size={20}>
                    heroicons-outline:pencil-alt
                  </FuseSvgIcon>
                  <span className="mx-8">Edit</span>
                </Button>
              </div>
            </div>

            <Typography className="mt-12 text-4xl font-bold truncate">
              {user?.displayName}
            </Typography>

            {/* <div className="flex flex-wrap items-center mt-8">
             {user.units.map((id) => (
              
              <Chip
                key={id}
                label={_.find(tags, { id }).title}
                className="mr-12 mb-12"
                size="small"
              />
            ))}
          </div> */}

            <Divider className="mt-16 mb-24" />

            <div className="flex flex-col space-y-32">
              {user?.title && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
                  <div className="ml-24 leading-6">{user?.firstName}</div>
                </div>
              )}

              {/* {user?.company && (
              <div className="flex items-center">
                <FuseSvgIcon>heroicons-outline:office-building</FuseSvgIcon>
                <div className="ml-24 leading-6">{user?.company}</div>
              </div>
            )} */}

              {user?.emails.length &&
                user?.emails.some((item) => item.email.length > 0) && (
                  <div className="flex">
                    <FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
                    <div className="min-w-0 ml-24 space-y-4">
                      {user?.emails.map(
                        (item) =>
                          item.email !== '' && (
                            <div
                              className="flex items-center leading-6"
                              key={item.email}
                            >
                              <a
                                className="hover:underline text-primary-500"
                                href={`mailto: ${item.email}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {item.email}
                              </a>
                              {item.label && (
                                <>
                                  <Typography
                                    className="text-md truncate"
                                    color="text.secondary"
                                  >
                                    <span className="mx-8">&bull;</span>
                                    <span className="font-medium">
                                      {item.label}
                                    </span>
                                  </Typography>
                                </>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {user?.phoneNumbers.length &&
                user?.phoneNumbers.some(
                  (item) => item.phoneNumber.length > 0
                ) && (
                  <div className="flex">
                    <FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
                    <div className="min-w-0 ml-24 space-y-4">
                      {user.phoneNumbers.map(
                        (item, index) =>
                          item.phoneNumber !== '' && (
                            <div
                              className="flex items-center leading-6"
                              key={index}
                            >
                              <Box
                                className="hidden sm:flex w-24 h-16 overflow-hidden"
                                sx={{
                                  background:
                                    "url('/assets/images/apps/users/flags.png') no-repeat 0 0",
                                  backgroundSize: '24px 3876px',
                                  backgroundPosition: getCountryByIso(
                                    item.country
                                  )?.flagImagePos,
                                }}
                              />

                              <div className="sm:ml-12 font-mono">
                                {getCountryByIso(item.country)?.code}
                              </div>

                              <div className="ml-10 font-mono">
                                {item.phoneNumber}
                              </div>

                              {item.label && (
                                <>
                                  <Typography
                                    className="text-md truncate"
                                    color="text.secondary"
                                  >
                                    <span className="mx-8">&bull;</span>
                                    <span className="font-medium">
                                      {item.label}
                                    </span>
                                  </Typography>
                                </>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {user?.address && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
                  <div className="ml-24 leading-6">{user.address}</div>
                </div>
              )}

              {user?.birthday && (
                <div className="flex items-center">
                  <FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
                  <div className="ml-24 leading-6">
                    {format(new Date(user.birthday), 'MMMM d, y')}
                  </div>
                </div>
              )}

              {user?.notes && (
                <div className="flex">
                  <FuseSvgIcon>heroicons-outline:menu-alt-2</FuseSvgIcon>
                  <div
                    className="max-w-none ml-24 prose dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: user.notes,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserView;
