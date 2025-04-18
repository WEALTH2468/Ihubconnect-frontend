import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ContactAvatar from '../../ContactAvatar';
import { ChatAppContext } from '../../ChatApp';
import { Card, CardContent } from '@mui/material';
import { motion } from "framer-motion";
import { selectPanelContactById } from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import useGetUserStatus from 'app/theme-layouts/shared-components/chatPanel/hooks/getUserStatus';


function ContactSidebar(props) {
  const {getStatus} = useGetUserStatus()
  const { setContactSidebarOpen } = useContext(ChatAppContext);
  const routeParams = useParams();
  const contactId = routeParams.id;
  const contact = useSelector((state) => selectPanelContactById(state, contactId));

  if (!contact) {
    return null;
  }
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col flex-auto h-full">
      <Box
        className="border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}
      >
        <Toolbar className="flex items-center px-4">
          <IconButton
            onClick={() => setContactSidebarOpen(false)}
            color="inherit"
            size="large"
          >
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>
          <Typography
            className="px-4 font-medium text-16"
            color="inherit"
            variant="subtitle1"
          >
            Contact info
          </Typography>
        </Toolbar>
      </Box>

      <div className="flex flex-col justify-center items-center mt-32">
        <ContactAvatar className="w-160 h-160 text-64" data={{...contact, status: getStatus(contact._id)}} />
        <Typography className="font-semibold my-4 text-15">
          {contact.displayName}
        </Typography>
        

        <Typography className='px-[30px]'>{contact.aboutMe}</Typography>

      </div>
      <Card component={motion.div} variants={item} className="w-[80%] m-auto mb-32 mt-32">
        <div className="px-32 pt-24">
          <Typography className="text-2xl font-semibold leading-tight">
            Work
          </Typography>
        </div>

        <CardContent className="px-32 py-24 " >
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Job Position
            </Typography>
            <Typography>{contact.jobPosition}</Typography>
          </div>
        
        </CardContent>

        
      </Card>
      <Card component={motion.div} variants={item} className="w-[80%] m-auto mb-32 mt-32">
        <div className="px-32 pt-24">
          <Typography className="text-2xl font-semibold leading-tight">
            Details
          </Typography>
        </div>

        <CardContent className="px-32 py-24 " >
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Emails
            </Typography>

            {contact.emails && contact.emails.map((contact) => (
              <div className="flex items-center" key={contact.email}>
                <Typography>{contact.email}</Typography>
              </div>
            ))}
          </div>
          
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">Tel.</Typography>

            {contact.phoneNumbers && contact.phoneNumbers.map((contact) => (
              <div className="flex items-center" key={contact.phoneNumber}>
                <Typography>{contact.phoneNumber}</Typography>
              </div>
            ))}
          </div>
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Gender
            </Typography>
            <Typography>{contact.gender}</Typography>
          </div>
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              Address
            </Typography>
            <Typography>{contact.address}</Typography>
          </div>
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">
              City
            </Typography>
            <Typography>{contact.city}</Typography>
          </div>
        
        </CardContent>        
      </Card>
    </div>
  );
}

export default ContactSidebar;
