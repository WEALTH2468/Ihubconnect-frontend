import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import reducer from '../../store';
import CustomersHeader from './CustomersHeader';
import CustomersTable from './CustomersTable';
import CustomerSidebarContent from './CustomerSidebarContent';
import LeftSidebarContent from '../LeftSidebarContent';
import {
  getCustomers,
  selectCustomers,
  selectIsFetched,
  selectLoadingFetch,
} from '../../store/customersSlice';

function Customers() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const routeParams = useParams();
  const customers = useSelector(selectCustomers);
  const loadingFetch = useSelector(selectLoadingFetch);
  const isFetched = useSelector(selectIsFetched);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetched) {
      dispatch(getCustomers());
    }
  }, [dispatch, isFetched]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <FusePageCarded
      header={
        <CustomersHeader
          totalCustomers={customers.length}
          setLeftSidebarOpen={setLeftSidebarOpen}
        />
      }
      content={<CustomersTable loading={loadingFetch} customers={customers} />}
      rightSidebarContent={
        <CustomerSidebarContent setRightSidebarOpen={setRightSidebarOpen} />
      }
      leftSidebarContent={<LeftSidebarContent setOpen={setLeftSidebarOpen} />}
      rightSidebarOpen={rightSidebarOpen}
      leftSidebarOpen={leftSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={540}
      scroll="page"
    />
  );
}

export default withReducer('crmApp', reducer)(Customers);
