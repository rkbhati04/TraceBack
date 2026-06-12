import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemDetailPage from './pages/ItemDetailPage';
import PostItemPage from './pages/PostItemPage';
import MyClaimsPage from './pages/MyClaimsPage';
import AdminPage from './pages/AdminPage';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth pages — no navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Pages with navbar */}
          <Route
            path="/"
            element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            }
          />
          <Route
            path="/items/:id"
            element={
              <AppLayout>
                <ItemDetailPage />
              </AppLayout>
            }
          />
          <Route
            path="/post-item"
            element={
              <AppLayout>
                <ProtectedRoute>
                  <PostItemPage />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/my-claims"
            element={
              <AppLayout>
                <ProtectedRoute>
                  <MyClaimsPage />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <AppLayout>
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              </AppLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
