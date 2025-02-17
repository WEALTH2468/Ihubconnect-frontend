import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import reducer from '../../store';
import LeftSidebarContent from '../LeftSidebarContent';

import {
  getItems,
  selectIsFetched,
  selectLoadingFetch,
  selectItems,
} from '../../store/itemsSlice';
import ItemsSidebarContent from './ItemsSidebarContent';
import ItemsHeader from './ItemsHeader';
import ItemsTable from './ItemsTable';

function Items() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const routeParams = useParams();
  const items = useSelector(selectItems);
  const loadingFetch = useSelector(selectLoadingFetch);
  const isFetched = useSelector(selectIsFetched);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetched) {
      dispatch(getItems());
    }
  }, [dispatch, isFetched]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  if (loadingFetch) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<ItemsHeader setLeftSidebarOpen={setLeftSidebarOpen} />}
      content={<ItemsTable loading={loadingFetch} items={items} />}
      rightSidebarContent={<ItemsSidebarContent />}
      leftSidebarContent={<LeftSidebarContent setOpen={setLeftSidebarOpen} />}
      rightSidebarOpen={rightSidebarOpen}
      leftSidebarOpen={leftSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={540}
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}

export default withReducer('crmApp', reducer)(Items);
