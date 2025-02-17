import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import {
  getItems,
  selectIsFetched,
  selectItems,
  selectLoadingFetch,
} from '../../store/itemsSlice';
import QuoteItemsSummary from './QuoteItemsSummary';
import QuoteItemTable from './quote-detail-items/QuoteItemTable';

export default function ItemTab({ quote, tableArgs }) {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const loadingFetch = useSelector(selectLoadingFetch);
  const isFetched = useSelector(selectIsFetched);

  useEffect(() => {
    if (!isFetched) {
      dispatch(getItems());
    }
  }, [dispatch, isFetched]);

  if (loadingFetch) {
    return <FuseLoading />;
  }

  return (
    <>
      <QuoteItemTable quote={quote} tableArgs={tableArgs} />
      <div className="w-full flex justify-end">
        <QuoteItemsSummary quote={quote} items={items} />
      </div>
    </>
  );
}
