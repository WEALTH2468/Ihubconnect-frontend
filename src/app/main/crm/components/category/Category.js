import { useThemeMediaQuery } from '@fuse/hooks';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LeftSidebarContent from '../LeftSidebarContent';
import CategoryHeader from './CategoryHeader';
import FusePageCarded from '@fuse/core/FusePageCarded';
import CategorySidebarContent from './CategorySidebarContent';
import CategoryTable from './CategoryTable';
import reducer from '../../store';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
  categorySelector,
  getCategories,
  selectCategories,
  selectLoadingFetch,
} from '../../store/categorySlice';

function Category() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const categories = useSelector(categorySelector.selectAll);
  const loadingFetch = useSelector((state) => selectLoadingFetch(state));
  const routeParams = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <FusePageCarded
      header={<CategoryHeader setLeftSidebarOpen={setLeftSidebarOpen} />}
      content={<CategoryTable loading={loadingFetch} categories={categories} />}
      rightSidebarContent={<CategorySidebarContent />}
      leftSidebarContent={<LeftSidebarContent setOpen={setLeftSidebarOpen} />}
      rightSidebarOpen={rightSidebarOpen}
      leftSidebarOpen={leftSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={540}
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}

export default withReducer('crmApp', reducer)(Category);
