import { Routes, Route } from 'react-router-dom';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Routes>
      {/* ... other routes ... */}
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  );
}

export default App;