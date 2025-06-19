import Dashboard from '@/components/pages/Dashboard';
import Farms from '@/components/pages/Farms';
import Crops from '@/components/pages/Crops';
import Tasks from '@/components/pages/Tasks';
import Weather from '@/components/pages/Weather';
import Finance from '@/components/pages/Finance';

export const routeArray = [
  {
    id: 1,
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    icon: 'LayoutDashboard',
    isActive: true
  },
  {
    id: 2,
    path: '/farms',
    name: 'Farms',
    component: Farms,
    icon: 'MapPin',
    isActive: true
  },
  {
    id: 3,
    path: '/crops',
    name: 'Crops',
    component: Crops,
    icon: 'Wheat',
    isActive: true
  },
  {
    id: 4,
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    icon: 'CheckSquare',
    isActive: true
  },
  {
    id: 5,
    path: '/weather',
    name: 'Weather',
    component: Weather,
    icon: 'Cloud',
    isActive: true
  },
  {
    id: 6,
    path: '/finance',
    name: 'Finance',
    component: Finance,
    icon: 'DollarSign',
    isActive: true
  }
];