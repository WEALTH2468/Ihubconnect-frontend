import { AhavaCheck } from '@fuse/utils/ahavaCheck';

import ahavaTheme from './ahavaTheme';
import ihubTheme from './ihubTheme';




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

if (AhavaCheck()) {
  themesConfig = ahavaTheme;
} else {
  themesConfig = ihubTheme;
}


export default themesConfig;

