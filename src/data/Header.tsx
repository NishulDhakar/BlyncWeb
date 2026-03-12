export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  logo: {
    src: '/og-logo.png',
    width: 70,
    height: 70,
  },
  navItems: [
    // {
    //   label: 'Blog',
    //   href: '/capgemini-cognitive-ability-games',
    // },
    // {
    //   label: 'Memory Games',
    //   href: '/games/memory',
    // },
    {
      label: 'All Games',
      href: '/games',
    },
    {
      label: 'Leaderboard',
      href: '/leaderboard',
    },
       {
      label: 'Profile',
      href: '/profile',
    },

    // {
    //   label: 'IQ Tests',
    //   href: '/iq-tests',
    // },
    //      {
    //   label: 'Contact',
    //   href: '/contact',
    // },
  ] as NavItem[],
};