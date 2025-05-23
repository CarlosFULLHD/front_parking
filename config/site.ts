export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Vehiculos',
      href: '/docs',
    },
    {
      label: 'Espacios',
      href: '/about',
    },
  ],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Vehiculos',
      href: '/docs',
    },
    {
      label: 'Espacios',
      href: '/about',
    },
  ],
  links: {
    github: 'https://github.com/heroui-inc/heroui',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
};
