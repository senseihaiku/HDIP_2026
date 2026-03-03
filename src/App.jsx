import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import DatasetDetail from './pages/DatasetDetail';
import Pricing from './pages/Pricing';
import About from './pages/About';
import AccessModels from './pages/AccessModels';
import Documentation from './pages/Documentation';
import Providers from './pages/Providers';
import ProviderDetail from './pages/ProviderDetail';
import HolderDashboard from './pages/dashboard/HolderDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import NewDataset from './pages/dashboard/NewDataset';

function DashboardRedirect() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'data-holder') return <Navigate to="/dashboard/holder" replace />;
  if (currentUser.role === 'admin') return <Navigate to="/dashboard/holder" replace />;
  return <Navigate to="/dashboard/user" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:id" element={<DatasetDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/access-models" element={<AccessModels />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/providers/:id" element={<ProviderDetail />} />

              {/* Dashboard redirect */}
              <Route path="/dashboard" element={<DashboardRedirect />} />

              {/* Data Holder routes */}
              <Route element={<ProtectedRoute allowedRoles={['data-holder', 'admin']} />}>
                <Route path="/dashboard/holder" element={<HolderDashboard />} />
                <Route path="/dashboard/holder/new" element={<NewDataset />} />
              </Route>

              {/* Data User routes */}
              <Route element={<ProtectedRoute allowedRoles={['data-user', 'admin']} />}>
                <Route path="/dashboard/user" element={<UserDashboard />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">404</h2>
                    <p className="text-gray-600 mb-4">Page not found.</p>
                    <Link to="/" className="text-sm font-medium text-teal-600 hover:text-teal-700">Back to home</Link>
                  </div>
                </div>
              } />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
