// client/src/routes.js
import Dashboard from './pages/Dashboard';
import SearchFlights from './pages/SearchFlights';
import AdminFlights from './pages/AdminFlights';
import ObservabilityDashboard from './pages/ObservabilityDashboard';


const routes = [
  { path: '/dashboard', element: <Dashboard />},
  { path: '/search', element: <SearchFlights /> },
  { path: '/admin/flights', element: <AdminFlights />},
  { path: '/o11y', element: <ObservabilityDashboard />}
  
  
];


export default routes;
