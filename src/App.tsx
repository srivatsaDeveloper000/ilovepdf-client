import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';

const AdminComponent = lazy(() => import("admin/App"))
const Login = lazy(() => import('./pages/Authentications/login/Login'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...........!!!!!!!!!!</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/*" element={<AdminComponent />} />
          <Route path="*" element={<div>Page not found</div>} />
          <Route path="/dashboard" element={<Dashboard />}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
