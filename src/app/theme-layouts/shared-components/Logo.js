import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
// import { selectCompanyProfile} from 'src/app/main/settings/users/store/settingsSlice';
import addBackendProtocol from './addBackendProtocol';

const Root = styled('div')(({ theme }) => ({
  '& > .logo-icon': {
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  '& > .badge': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo() {

  // // const company = useSelector(selectCompanyProfile);``
  // return (
  //   <Root className="flex items-center">
  //     <img className="logo-icon w-32 h-32" src={addBackendProtocol(company?.logo)} alt="logo" />

  //     <div
  //       className="badge flex items-center py-4 px-8 mx-8 rounded"
        
  //       // style={{ backgroundColor: '#fff', color: '#fff' }}
  //     >
        
  //       <Typography className="text-11 font-medium capitalize" color="text.secondary">
  //           {company?.companyName}
  //         </Typography>
      
  //     </div>
  //   </Root>
  // );
}

export default Logo;
