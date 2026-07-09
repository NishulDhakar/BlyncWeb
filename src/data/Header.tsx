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
    {
      label: 'Blogs',
      href: 'https://medium.com/@nishuldhakar/game-based-aptitude-overview-8a160ad8a3f7',
    },
    {
      label: 'open to work',
      href: 'https://www.nishul.dev/',
    },
    //        {
    //   label: 'More stuff',
    //   href: '/morestuff',
    // },


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