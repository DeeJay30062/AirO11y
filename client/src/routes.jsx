// client/src/routes.js
import Dashboard from './pages/Dashboard';
import BookSearchFlights from './pages/book/SearchFlights';
import AdminFlights from './pages/AdminFlights';
import ObservabilityDashboard from './pages/ObservabilityDashboard';


const routes = [
  { path: '/dashboard', element: <Dashboard />},
  { path: '/book/search', element: <BookSearchFlights /> },
  { path: '/admin/flights', element: <AdminFlights />},
  { path: '/o11y', element: <ObservabilityDashboard />}
  
  
];


export default routes;
