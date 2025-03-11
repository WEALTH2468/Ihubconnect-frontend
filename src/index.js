// Internet Explorer 11 requires polyfills and partially supported by this project.
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
// import * as Sentry from '@sentry/react';

// Sentry.init({
//   dsn: 'https://bece212c3246a88293a540c3dea6268b@o4508949867659264.ingest.de.sentry.io/4508950051684432',
//   environment: process.env.NODE_ENV || 'development',
// });

console.log('In: ', process.env.NODE_ENV);

import './i18n';
import './styles/app-base.css';
import './styles/app-components.css';
import './styles/app-utilities.css';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
