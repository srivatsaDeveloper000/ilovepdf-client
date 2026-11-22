import { lazy, Suspense } from 'react';
import { BrowserRouter ,Route,Routes } from 'react-router-dom';

const AdminComponent = lazy(() => import("admin/App"))
const Login = lazy(() => import('./pages/Authentications/login/Login'))

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<div>Loading...........!!!!!!!!!!</div>}>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/admin/*" element={<AdminComponent />} />
            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    </Suspense>
    </BrowserRouter>
  )
}

export default App
