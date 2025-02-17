

const TemplateNavigation = {
  id: 'Template',
  title: 'Template',
  subtitle: 'Everything you need to know about Fuse',
  icon: 'heroicons-outline:support',
  type: 'group',
  children: [
    {
      id: 'changelog',
      title: 'Changelog',
      type: 'item',
      icon: 'heroicons-outline:speakerphone',
      url: '/Template/changelog',
      badge: {
        // title: fuseReactLatestVersion,
        bg: 'rgb(236, 12, 142)',
        fg: '#FFFFFF',
      },
    }
  ],
};

export default TemplateNavigation;
