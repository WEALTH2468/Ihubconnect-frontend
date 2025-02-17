import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

export default function ReportAppHeader({ setOpen }) {
    return (
        <div className="flex w-full p-24 sm:p-32 ">
            <div className="flex gap-5 items-center space-y-8 sm:space-y-0">
                <IconButton onClick={() => setOpen((prev) => !prev)}>
                    <MenuIcon />
                </IconButton>
                <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
                    <div className="flex flex-auto items-center min-w-0">
                        <div className="flex flex-col min-w-0 mx-16">
                            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                                Report
                            </Typography>

                            <div className="flex items-center">
                                <Typography
                                    className="mx-6 leading-6 truncate"
                                    color="text.secondary"
                                >
                                    This is a Report app
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
