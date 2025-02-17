import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import {
    Box,
    Button,
    Input,
    Menu,
    MenuItem,
    Paper,
    lighten,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DepartmentTable from './DepartmentTable';
import UnitTable from './UnitTable';

export default function CreateDepartment() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="p-32">
            <Box
                className="p-16 w-full rounded-16 mb-24 border"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? lighten(theme.palette.background.default, 0.4)
                            : lighten(theme.palette.background.default, 0.02),
                }}
            >
                <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.2 },
                        }}
                    >
                        <Button
                            className="mx-8 whitespace-nowrap"
                            variant="contained"
                            color="secondary"
                            startIcon={
                                <FuseSvgIcon size={20}>
                                    heroicons-outline:plus
                                </FuseSvgIcon>
                            }
                            component={NavLinkAdapter}
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            Create New
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem
                                component={NavLinkAdapter}
                                to="departments/new/department"
                                onClick={() => handleClose()}
                            >
                                <FuseSvgIcon>
                                    heroicons-outline:plus
                                </FuseSvgIcon>
                                Create Department
                            </MenuItem>
                            <MenuItem
                                component={NavLinkAdapter}
                                to="departments/new/unit"
                                onClick={() => handleClose()}
                            >
                                <FuseSvgIcon>
                                    heroicons-outline:plus
                                </FuseSvgIcon>
                                Create Unit
                            </MenuItem>
                        </Menu>
                    </motion.div>
                </div>
            </Box>

            <div className="flex flex-col gap-16">
                <DepartmentTable />
                <UnitTable />
            </div>
        </div>
    );
}
