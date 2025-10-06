import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import "./css/homepage.css";
import "./css/home-nav.css";
import "./css/LoginPage.css";
import "./css/ForgotPage.css";
import "./css/popup.css";
import "./css/color.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);