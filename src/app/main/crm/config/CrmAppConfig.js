import { lazy } from 'react';
import { authRoles } from 'src/app/auth';
import ContactForm from '../components/customer-detail/ContactForm';
import CustomerQuotesForm from '../components/customer-detail/CustomerQuotesForm';

const Customers = lazy(() => import('../components/customers/Customers'));
const CustomersForm = lazy(() =>
  import('../components/customers/CustomersForm')
);
//const ContactForm = lazy('../components/customer-detail/ContactForm');
const CustomerDetail = lazy(() =>
  import('../components/customer-detail/CustomerDetail')
);
const QuoteDetail = lazy(() =>
  import('../components/quote-detail/QuoteDetail')
);
const QuotesForm = lazy(() => import('../components/quotes/QuotesForm'));
const Quotes = lazy(() => import('../components/quotes/Quotes'));
const Items = lazy(() => import('../components/items/Items'));
const ItemsForm = lazy(() => import('../components/items/ItemsForm'));
const Category = lazy(() => import('../components/category/Category'));
const CategoryForm = lazy(() => import('../components/category/CategoryForm'));

const CrmAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.manager,

  routes: [
    {
      path: 'crm/customers',
      element: <Customers />,

      children: [
        {
          path: '/crm/customers/:id/edit',
          element: <CustomersForm />,
        },
      ],
    },
    {
      path: 'crm/customers/:id',
      element: <CustomerDetail />,

      children: [
        {
          path: '/crm/customers/:id/contact/new',
          element: <ContactForm />,
        },
        {
          path: '/crm/customers/:id/quote/new',
          element: <CustomerQuotesForm />,
        },
      ],
    },
    {
      path: 'crm/categories',
      element: <Category />,
      children: [
        {
          path: '/crm/categories/:id/edit',
          element: <CategoryForm />,
        },
      ],
    },
    {
      path: 'crm/quotes',
      element: <Quotes />,

      children: [
        {
          path: '/crm/quotes/:id/edit',
          element: <QuotesForm />,
        },
      ],
    },
    {
      path: 'crm/quotes/:id',
      element: <QuoteDetail />,
    },

    {
      path: 'crm/items',
      element: <Items />,

      children: [
        {
          path: '/crm/items/:id/edit',
          element: <ItemsForm />,
        },
      ],
    },
  ],
};

export default CrmAppConfig;
