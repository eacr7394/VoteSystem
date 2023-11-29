import { INavData } from '@coreui/angular-pro';

export const navItems: INavData[] = [
  {
    name: 'Propietarios',
    url: '#',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Lista',
        url: 'user-list'
      },
      {
        name: 'Creación',
        url: 'user-create'
      }
    ]
  },
  {
    name: 'Asistencia de Propietarios (Quórum)',
    url: '#',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Lista',
        url: '/assistant-list'
      },
      {
        name: 'Creación',
        url: '/assistant-create'
      }
    ]
  },
  {
    name: 'Asambleas',
    url: '#',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Lista',
        url: '/meeting-list'
      },
      {
        name: 'Creación',
        url: '/meeting-create'
      }
    ]
  },
  {
    name: 'Temas de Votaciones',
    url: '#',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Lista',
        url: '/voting-list'
      },
      {
        name: 'Creación',
        url: '/voting-create'
      }
    ]
  },
  {
    name: 'Votos de Propietarios',
    url: '#',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Lista',
        url: '/user-has-voting-list'
      },
      {
        name: 'Enviar Votación',
        url: '/user-has-voting-create'
      }
    ]
  },

];
