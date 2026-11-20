import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import SuperAdmin from './SuperAdmin.jsx';

// Super Admin URL: https://aquamark.pages.dev/?portal=admin
const params = new URLSearchParams(window.location.search);
const isSuperAdminRoute = params.get('portal') === 'admin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isSuperAdminRoute ? <SuperAdmin /> : <App />}
  </StrictMode>,
);