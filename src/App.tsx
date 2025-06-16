import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Notes from './pages/Notes';
import DailyPlanner from './pages/DailyPlanner';
import LinkedInTracker from './pages/LinkedInTracker';
import Media from './pages/Media';
import Resume from './pages/Resume';
import Files from './pages/Files';
import RecruiterView from './pages/RecruiterView';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/recruiter" element={<RecruiterView />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="notes" element={<Notes />} />
              <Route path="planner" element={<DailyPlanner />} />
              <Route path="linkedin" element={<LinkedInTracker />} />
              <Route path="media" element={<Media />} />
              <Route path="files" element={<Files />} />
              <Route path="resume" element={<Resume />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;