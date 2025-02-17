/* eslint-disable no-shadow */
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useThemeMediaQuery } from '@fuse/hooks';
import withReducer from 'app/store/withReducer';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FuseLoading from '@fuse/core/FuseLoading';
import {
  getQuotes,
  selectIsFetched as selectIsQuoteFetched,
  selectLoadingFetch as selectLoadingQuoteFetch,
  selectQuoteById,
} from '../../store/quotesSlice';
import reducer from '../../store';
import QuoteDetailHeader from './QuoteDetailHeader';
import QuoteContent from './QuoteContent';
import {
  getItems,
  selectItems,
  selectIsFetched as selectIsItemFetched,
  selectLoadingFetch as selectLoadingItemFetch,
} from '../../store/itemsSlice';
import useQuoteItemTable from '../../hooks/useQuoteItemTable';

const schema = yup.object().shape({});

function QuoteDetail() {
  const [convertedContent, setConvertedContent] = useState(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const routeParams = useParams();
  const [stage, setStage] = useState([]);
  const loadingQuoteFetch = useSelector(selectLoadingQuoteFetch);
  const loadingItemFetch = useSelector(selectLoadingItemFetch);

  const dispatch = useDispatch();
  const quote = useSelector((state) => selectQuoteById(state, routeParams.id));

  const isQuoteFetched = useSelector(selectIsQuoteFetched);
  const isItemFetched = useSelector(selectIsItemFetched);
  const items = useSelector(selectItems);

  useEffect(() => {
    if (!isQuoteFetched) {
      dispatch(getQuotes());
    }

    if (!isItemFetched) {
      dispatch(getItems());
    }
  }, [isQuoteFetched, isItemFetched, dispatch]);

  const defaultValues = {
    ...quote,
  };

  useEffect(() => {
    if (quote) {
      reset(quote);
      setStage(quote.stage);
      setConvertedContent(quote.paymentTerms);
    }
  }, [quote]);

  const { control, watch, handleSubmit, reset, formState, getValues } = useForm(
    {
      mode: 'onChange',
      resolver: yupResolver(schema),
      defaultValues,
    }
  );

  const tableArgs = useQuoteItemTable(quote || []);

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  const formControlLabelStyle = {
    '& .MuiFormControlLabel-label': {
      fontSize: '11px',
    },
  };

  if (loadingQuoteFetch || loadingItemFetch) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={
        <QuoteDetailHeader
          quote={quote}
          handleSubmit={handleSubmit}
          isValid={isValid}
          stage={stage}
          table={tableArgs.table}
          dirtyFields={dirtyFields}
          items={items}
          convertedContent={convertedContent}
          setConvertedContent={setConvertedContent}
        />
      }
      content={
        <QuoteContent
          quote={quote}
          control={control}
          errors={errors}
          stage={stage}
          setStage={setStage}
          tableArgs={tableArgs}
          convertedContent={convertedContent}
          setConvertedContent={setConvertedContent}
          formControlLabelStyle={formControlLabelStyle}
        />
      }
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarContent={<p>Content</p>}
      rightSidebarWidth={540}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('crmApp', reducer)(QuoteDetail);
