import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import reducer from '../../store';
import LeftSidebarContent from '../LeftSidebarContent';
import QuotesHeader from './QuotesHeader';
import QuotesTable from './QuotesTable';
import QuotesSidebarContent from './QuotesSidebarContent';
import {
  getQuotes,
  selectIsFetched,
  selectLoadingFetch,
  selectQuotes,
} from '../../store/quotesSlice';

function Quotes() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const routeParams = useParams();
  const quotes = useSelector(selectQuotes);
  const loadingFetch = useSelector(selectLoadingFetch);
  const isFetched = useSelector(selectIsFetched);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetched) {
      dispatch(getQuotes());
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
      header={<QuotesHeader setLeftSidebarOpen={setLeftSidebarOpen} />}
      content={<QuotesTable quotes={quotes} />}
      rightSidebarContent={<QuotesSidebarContent />}
      leftSidebarContent={<LeftSidebarContent setOpen={setLeftSidebarOpen} />}
      rightSidebarOpen={rightSidebarOpen}
      leftSidebarOpen={leftSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={540}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('crmApp', reducer)(Quotes);
