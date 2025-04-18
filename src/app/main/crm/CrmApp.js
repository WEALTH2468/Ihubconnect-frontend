import FusePageCarded from '@fuse/core/FusePageCarded';
import { useEffect, useState } from 'react';
import withReducer from 'app/store/withReducer';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import CrmAppHeader from './CrmAppHeader';
import reducer from './store';
import { getCountries } from '../settings/users/store/countriesSlice';
import { getContacts } from './store/customersSlice';
import LeftSidebarContent from './components/LeftSidebarContent';
import Contact from './components/customers/Customers';
import RightSidebarContent from './components/RightSidebarContent';
import ContactDetail from './components/ContactDetail';

function CrmApp(props) {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState('');
  const [active, setActive] = useState('Contact');

  const renderMainContent = (view) => {
    switch (view) {
      case 'Contact':
        return (
          <Contact
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        );
      default:
        return <Contact />;
    }
  };
  
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Ihub Connect - Finance';

    return () => {
      document.title = originalTitle; // Reset on unmount
    };
  }, []);

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <FusePageCarded
      header={
        <CrmAppHeader
          setRightOpen={setRightOpen}
          setLeftOpen={setLeftOpen}
          rightOpen={rightOpen}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      }
      content={renderMainContent(active)}
      leftSidebarContent={
        <LeftSidebarContent setOpen={setLeftOpen} setActive={setActive} />
      }
      rightSidebarContent={<RightSidebarContent setOpen={setRightOpen} />}
      leftSidebarOpen={leftOpen}
      rightSidebarOpen={rightOpen}
      rightSidebarWidth={740}
      scroll="page"
    />
  );
}

export default withReducer('crmApp', reducer)(CrmApp);
