import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'idesk',
    title: 'iDesk',
    translate: 'Idesk',
    type: 'item',
    icon: 'heroicons-outline:home',
    url: 'idesk',
    // auth: ['guest', 'staff']
  },
  {
    id: 'crm',
    title: 'Crm',
    translate: 'Crm',
    type: 'group',
    icon: 'heroicons-outline:user-group',
    children: [
      {
        id: 'customers',
        title: 'Customers',
        type: 'item',
        url: 'crm/customers',
        end: true,
      },
      {
        id: 'quotes',
        title: 'Quotes',
        type: 'item',
        url: 'crm/quotes',
        end: true,
      },
      {
        id: 'items',
        title: 'Items',
        type: 'item',
        url: 'crm/items',
        end: true,
      },
    ],
    auth: ['super admin', 'admin', 'manager'],
  },
  {
    id: 'setting',
    title: 'Settings',
    translate: '',
    type: 'item',
    icon: 'heroicons-outline:cog',
    url: 'settings',
    auth: ['admin', 'super admin'],
  },
];

export default navigationConfig;
