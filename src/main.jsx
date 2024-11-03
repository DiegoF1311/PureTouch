import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from "./components/Landing/LandingPage";
import ProcessPage from "./components/Process/ProcessPage";
import SummaryPage from "./components/Summary/SummaryPage";
import HeaderUser from "./components/Verify/HeaderUser";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<HeaderUser />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);