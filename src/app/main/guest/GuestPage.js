import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';

function GuestPage() {
  const user = useSelector(selectUser)
  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="flex items-center w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-480 sm:w-480 mx-auto sm:mx-0">
          <img className="w-48 mx-auto" src="assets/images/logo/logo.svg" alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight text-center">
           Welcome! {user.displayName}
          </Typography>
          <Typography className="mt-24 text-xl font-semibold tracking-tight leading-tight text-center">
          Contact Admin to assign a role to you
          </Typography>
         <div className=' mt-12 flex items-center w-full justify-center gap-20'>
         <Link to="/idesk" className='text-lg text-center'>
            Go to idesk
          </Link>
          <Link to="/sign-out" className='text-lg text-center'>
            Log out
          </Link>
         </div>
          
        </div>
      </Paper>
    </div>
  );
}

export default GuestPage;
