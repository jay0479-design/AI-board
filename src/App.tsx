import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProcessPage from './pages/ProcessPage';
import InsightsPage from './pages/InsightsPage';
import KnowhowPage from './pages/KnowhowPage';
import QuestionsPage from './pages/QuestionsPage';
import RadarPage from './pages/RadarPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="process" element={<ProcessPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="knowhow" element={<KnowhowPage />} />
        <Route path="questions" element={<QuestionsPage />} />
        <Route path="radar" element={<RadarPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
