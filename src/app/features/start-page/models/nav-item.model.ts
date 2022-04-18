import { SHARED_ROUTES_NAMES } from '../../../app.constants';

export interface NavItem {
  label: string;
  link: string;
  id?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Makler finden',
    link: `/${SHARED_ROUTES_NAMES.SEARCHBROKER}`,
    id: 'start-page-navbar-find-broker',
  },
  {
    label: 'Baufinanzierung',
    link: `/${SHARED_ROUTES_NAMES.BROKER}`,
    id: 'start-page-navbar-property-finance',
  },
  {
    label: 'Für Makler',
    link: `/${SHARED_ROUTES_NAMES.PROFESSIONALS}`,
    id: 'start-page-navbar-for-brokers-link',
  },
  {
    label: 'Über uns',
    link: `/${SHARED_ROUTES_NAMES.ABOUT}`,
    id: 'start-page-navbar-about-us-link',
  },
  {
    label: 'So funktioniert\'s',
    link: `/${SHARED_ROUTES_NAMES.HOWITWORKS}`,
    id: 'start-page-navbar-how-it-works',
  },
];
