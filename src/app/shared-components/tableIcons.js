import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const tableIcons = {
  ArrowDownwardIcon: (props) => (
    <FuseSvgIcon size={20} {...props}>
      heroicons-outline:arrow-down
    </FuseSvgIcon>
  ),
  ClearAllIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:menu-alt-3</FuseSvgIcon>
  ), // Adjusted, closest match
  DensityLargeIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:menu-alt-4</FuseSvgIcon>
  ), // Adjusted, closest match
  DensityMediumIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:menu</FuseSvgIcon>
  ), // Adjusted, closest match
  DensitySmallIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:view-list</FuseSvgIcon>
  ), // Adjusted, closest match
  DragHandleIcon: () => (
    <FuseSvgIcon className="rotate-45" size={16}>
      heroicons-outline:arrows-expand
    </FuseSvgIcon>
  ), // Adjusted, closest match
  FilterListIcon: (props) => (
    <FuseSvgIcon size={16} {...props}>
      heroicons-outline:filter
    </FuseSvgIcon>
  ),
  FilterListOffIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:filter</FuseSvgIcon>
  ), // Heroicons may not have a direct match for "off" state; consider custom handling
  FullscreenExitIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:arrows-expand</FuseSvgIcon>
  ), // Adjusted, closest match
  FullscreenIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:arrows-expand</FuseSvgIcon>
  ),
  SearchIcon: (props) => (
    <FuseSvgIcon color="action" size={20} {...props}>
      heroicons-outline:search
    </FuseSvgIcon>
  ),
  SearchOffIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:search</FuseSvgIcon>
  ), // Heroicons may not have a direct match for "off" state; consider custom handling
  ViewColumnIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:view-boards</FuseSvgIcon>
  ),
  MoreVertIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
  ),
  MoreHorizIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:dots-horizontal</FuseSvgIcon>
  ),
  SortIcon: (props) => (
    <FuseSvgIcon size={20} {...props}>
      heroicons-outline:sort-ascending
    </FuseSvgIcon>
  ), // Adjusted, closest match
  PushPinIcon: (props) => (
    <FuseSvgIcon size={20} {...props}>
      heroicons-outline:thumb-tack
    </FuseSvgIcon>
  ), // Adjusted, closest match
  VisibilityOffIcon: () => (
    <FuseSvgIcon size={20}>heroicons-outline:eye-off</FuseSvgIcon>
  ),
};

export default tableIcons;
