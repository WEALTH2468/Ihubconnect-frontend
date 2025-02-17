import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DebouncedInput from './components/DebouncedInput';

export default function CrmAppHeader({
  globalFilter,
  setGlobalFilter,
  setRightOpen,
  setLeftOpen,
  rightOpen,
}) {
  return (
    <div className="w-full flex flex-col">
      <div className="pt-24 sm:pt-32 w-full flex flex-col sm:flex-row space-y-8 sm:space-y-0 items-center justify-between">
        <div className="flex gap-5 items-center space-y-8 sm:space-y-0">
          <IconButton onClick={() => setLeftOpen((prev) => !prev)}>
            <MenuIcon />
          </IconButton>
          <motion.div
            className="flex items-end"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
          >
            <div className="flex flex-col items-start space-y-8">
              <Typography
                component={Link}
                to="/task"
                className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
                role="button"
              >
                Customer Relation Manager
              </Typography>
              <Typography
                component={Link}
                to="/task"
                className="text-16 md:text-[24] tracking-tight leading-none"
                role="button"
              >
                Customer's List
              </Typography>
            </div>
          </motion.div>
        </div>
        <div>
          <Button
            id="demo-customized-button"
            className="mx-8 whitespace-nowrap"
            variant="contained"
            color="secondary"
            size="medium"
            aria-controls={rightOpen ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={rightOpen ? 'true' : undefined}
            disableElevation
            onClick={() => setRightOpen((prev) => !prev)}
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            Add new customer
          </Button>
        </div>
      </div>
      <div className="flex self-end py-12">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
        />
      </div>
    </div>
  );
}
