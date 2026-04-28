import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/animations.css';
import App from './App';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with strict mode for better development practices
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Add performance monitoring (you can remove in production)
if (process.env.NODE_ENV === 'development') {
  const reportWebVitals = () => {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  };
  reportWebVitals();
}