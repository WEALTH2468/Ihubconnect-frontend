import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { getUsers } from './store/usersSlice';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { getTags } from './store/tagsSlice';
import { getCountries } from './store/countriesSlice';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import UsersHeader from './UserHeader';
import UsersList from './UsersList';
import { useParams } from 'react-router-dom';
import UsersSidebarContent from './UsersSidebarContent';
import LogoForm from '../LogoForm';
import DetailUserSidebarContent from './user/UserLeftSidebar';
import { useDeepCompareEffect } from '@fuse/hooks';
import { getLogo } from './store/settingsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {
        backgroundColor: theme.palette.background.paper,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.divider,
    },
    '& .FusePageSimple-toolbar': {},
    '& .FusePageSimple-content': {},
    '& .FusePageSimple-sidebarHeader': {},
    '& .FusePageSimple-sidebarContent': {},
}));

function UsersApp() {
    const dispatch = useDispatch();
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const isMobile = useThemeMediaQuery((theme) =>
        theme.breakpoints.down('lg')
    );
    const routeParams = useParams();
    const [open, setOpen] = useState(false);
    const [appRender, setAppRender] = useState('User');

    const renderMainContent = () => {
        switch (appRender) {
            case 'User':
                return <UsersList />;
            case 'Logo':
                return <LogoForm />;
            default:
                return null;
        }
    };

    useEffect(() => {
        setRightSidebarOpen(Boolean(routeParams.id));
    }, [routeParams]);

    useDeepCompareEffect(() => {
        dispatch(getUsers());
        dispatch(getTags());
        dispatch(getCountries());
        dispatch(getLogo());
    }, [dispatch]);

    return (
        <FusePageCarded
            header={<UsersHeader setOpen={setOpen} />}
            content={renderMainContent()}
            leftSidebarOpen={open}
            leftSidebarContent={
                <DetailUserSidebarContent
                    setOpen={setOpen}
                    setAppRender={setAppRender}
                />
            }
            rightSidebarContent={<UsersSidebarContent />}
            rightSidebarOpen={rightSidebarOpen}
            rightSidebarOnClose={() => setRightSidebarOpen(false)}
            rightSidebarWidth={540}
            scroll="page"
        />
    );
}

export default withReducer('usersApp', reducer)(UsersApp);
