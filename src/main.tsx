import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root') ?? document.body.appendChild(Object.assign(document.createElement('div'), { id: 'root' }));

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
