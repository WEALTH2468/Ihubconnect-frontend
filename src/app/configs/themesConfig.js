import { fuseDark, skyBlue, customOrange } from '@fuse/colors';
import { blueGrey } from '@mui/material/colors';

import { deepOrange } from '@mui/material/colors';

import ahavaTheme from './ahavaTheme';
import ihubTheme from './ihubTheme';



console.log('window.REACT_APP_FRONTEND_DOMAIN', process.env.REACT_APP_BASE_FRONTEND);



export const lightPaletteText = {
  primary: 'rgb(17, 24, 39)',
  secondary: 'rgb(107, 114, 128)',
  disabled: 'rgb(149, 156, 169)',
};

export const darkPaletteText = {
  primary: 'rgb(255,255,255)',
  secondary: 'rgb(148, 163, 184)',
  disabled: 'rgb(156, 163, 175)',
};

let themesConfig;

if (process.env.REACT_APP_BASE_FRONTEND === "http://localhost:3001") {
  themesConfig = ahavaTheme;
} else {
  themesConfig = ihubTheme;
}


export default themesConfig;

